import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';

import {
  Account,
  Recruiter,
  Company,
} from '@job-guetter/api-core/models';
import { EMAIL_SENDER } from '@job-guetter/api-core/utils/env';
import { assert } from '@job-guetter/api-core/utils/assert';
import {
  BadRequest,
  Conflict,
  NotFound,
} from '@job-guetter/api-core/utils/errors';

export const getSirene = async (req, res) => {
  const sirene = req.params.sirene;

  const content = await req.app.get('Sirene_API').get(sirene);

  if (!content) {
    throw NotFound('company_not_found_by_siren');
  }

  res.json({ content });
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
    await Company.findOne({ _id: companyId }).populate('account'),
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
    await Company.findOne({ _id: companyId }).populate('account'),
    NotFound('company_not_found')
  );

  let account = await Account.findOne({ email });

  if (account && company.account._id.toString() !== account._id.toString()) {
    throw Conflict('already_exists');
  }

  if (!account) {
    const old = await Account.findOne({ _id: company.account._id });

    account = await Account.from({
      email,
      password,
      type: Account.TYPE_COMPANY,
    });

    await old?.remove();
  } else {
    Object.assign(account, {
      email,
      password,
    });
  }

  Object.assign(company, {
    account,
    ...companyInfo,
  });

  await company.save();
  await account.save();

  res.json({ company });
};

export const remove = async (req, res) => {
  const companyId = assert(req.params.id, BadRequest('wrong_company_id'),
    val => mongoose.Types.ObjectId.isValid(val));

  const company = assert(
    await Company.findOne({ _id: companyId }).populate('account'),
    NotFound('company_not_found')
  );

  const account = assert(
    await Account.findOne({ _id: company.account._id })
  );

  const recruiters = await Recruiter
    .find({ company })
    .populate({
      path: 'user',
      select: ['account'],
      populate: {
        path: 'account',
        select: ['email', 'type'],
      },
    });

  if (recruiters) {
    for (const recruiter of recruiters) {
      const recruiterEmail = recruiter.user.account.email;

      req.app.get('Sendgrid').send({
        from: EMAIL_SENDER,
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

  const recruiter = await Recruiter.findOne({
    _id: recruiterId,
    company: companyId,
  });

  if (accept) {
    Object.assign(recruiter, { status: accept });
    res.json({ accepted: true });
  } else {
    await recruiter.remove();
    res.json({ deleted: true });
  }
};
