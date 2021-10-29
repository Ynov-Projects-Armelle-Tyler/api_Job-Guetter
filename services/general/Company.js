import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';

import {
  Account,
  Recruiter,
  Company,
} from '@job-guetter/api-core/models';
import { assert } from '@job-guetter/api-core/utils/assert';
import {
  BadRequest,
  Conflict,
  NotFound,
} from '@job-guetter/api-core/utils/errors';

export const getSirene = async (req, res) => {
  const sirene = req.params.sirene;

  const content = await req.app.get('Sirene_API').get(sirene);

  if (content) {
    res.json({ content });
  } else {
    NotFound('user_not_found');
  }
};

export const create = async (req, res) => {
  const email = assert(req.body.email, BadRequest('invalid_email'), isEmail);
  const password = assert(req.body.password, BadRequest('invalid_request'));
  const companyInfo = assert(req.body.company, BadRequest('invalid_request'));

  const exists = await Account.findOne({ email });

  if (exists) {
    throw Conflict('already_exists');
  }

  const account = await Account.from({
    email,
    password,
    type: Account.TYPE_COMPANY,
  });

  const company = await Company.from({ ...companyInfo, account });

  await account.save();
  await company.save();

  res.json({ created: true });
};

export const get = async (req, res) => {
  const companyId = assert(req.params.id, BadRequest('wrong_company_id'),
    val => mongoose.Types.ObjectId.isValid(val));

  const company = assert(
    await Company.findOne({ _id: companyId }),
    NotFound('company_not_found')
  );

  res.json({ company });
};

export const getAll = async (req, res) => {
  const companies = await Company.find().populate('account');
  res.json({ companies });
};

export const update = async (req, res) => {
  const companyId = assert(req.params.id, BadRequest('wrong_company_id'),
    val => mongoose.Types.ObjectId.isValid(val));
  const companyInfo = assert(req.body.company, BadRequest('invalid_request'));
  const email = assert(req.body.email, BadRequest('invalid email'), isEmail);
  const password = assert(req.body.password, BadRequest('invalid password'));

  const company = assert(
    await Company.findOne({ _id: companyId }),
    NotFound('company_not_found')
  );

  const account = assert(
    await Account.findOne({ _id: company.account })
  );

  Object.assign(account, { email, password });

  Object.assign(company, companyInfo);

  await company.save();
  await account.save();

  res.json({ updated: true });
};

export const remove = async (req, res) => {
  const companyId = assert(req.params.id, BadRequest('wrong_company_id'),
    val => mongoose.Types.ObjectId.isValid(val));

  const company = assert(
    await Company.findOne({ _id: companyId }),
    NotFound('company_not_found')
  );

  const account = assert(
    await Account.findOne({ _id: company.account })
  );

  const recruiters = await Recruiter.find({ company });

  if (recruiters) {
    for (const recruiter of recruiters) {
      const recruiterEmail = recruiter.recruiter_email;

      req.get('Sendgrid').send({
        from: 'tyler.escolano@ynov.com',
        to: recruiterEmail,
        subject: 'Company break his link',
        body: `<p>We are sorry but company ${company.name} break ` +
          'his link with you</p>',
      });

      await recruiter.remove();
    }
  }

  await company.remove();
  await account.remove();

  res.json({ deleted: true });
};

export const getRecruiters = async (req, res) => {
  const companyId = assert(req.params.id, BadRequest('wrong_company_id'),
    val => mongoose.Types.ObjectId.isValid(val));

  const company = assert(
    await Company.findOne({ _id: companyId }),
    NotFound('company_not_found')
  );

  const recruiters = await Recruiter.find({ company });

  res.json({ recruiters });
};

export const updateRecruiters = async (req, res) => {
  const companyId = assert(req.params.id, BadRequest('wrong_company_id'),
    val => mongoose.Types.ObjectId.isValid(val));
  const recruiterId = assert(req.params.recruiter_id,
    BadRequest('wrong_company_id'),
    val => mongoose.Types.ObjectId.isValid(val));
  const accept = assert(req.body.accept, BadRequest('invalid_request'));

  if (accept === 'true') {
    assert(
      await Recruiter.updateOne(
        { company: companyId, recruiter: recruiterId },
        { status: true }
      ), NotFound('recruiter_not_found')
    );

    res.json('accepted');
  } else {
    assert(
      await Recruiter.deleteOne(
        { company: companyId, recruiter: recruiterId }
      ), NotFound('recruiter_not_found')
    );

    res.json('deleted');
  }
};
