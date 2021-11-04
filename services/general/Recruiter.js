import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';

import {
  Account,
  User,
  Recruiter,
  Company,
  JobAnnouncement,
} from '@job-guetter/api-core/models';
import { assert } from '@job-guetter/api-core/utils/assert';
import {
  BadRequest,
  Conflict,
  NotFound,
} from '@job-guetter/api-core/utils/errors';
import { omit } from '@job-guetter/api-core/utils/helpers';

export const create = async (req, res) => {
  const recruiter = assert(req.body.recruiter, BadRequest('invalid_request'));
  const email = assert(recruiter.email, BadRequest('email_format'), isEmail);
  const password = assert(recruiter.password, BadRequest('invalid_request'));

  const exists = await Account.findOne({ email });

  if (exists) {
    throw Conflict('already_exists');
  }

  const account = await Account.from({
    email,
    password,
    type: Account.TYPE_RECRUITER,
  });

  const user = await User.from({
    ...omit(recruiter, ['email', 'password']),
    account,
  });

  await account.save();
  await user.save();

  res.json({ created: true });
};

export const ask = async (req, res) => {
  const userId = assert(req.params.id, BadRequest('wrong_recruiter_id'),
    val => mongoose.Types.ObjectId.isValid(val));
  const companyId = assert(
    req.params.companyId,
    BadRequest('wrong_recruiter_id'),
    val => mongoose.Types.ObjectId.isValid(val)
  );

  const user = assert(
    await User.findOne({ _id: userId }),
    NotFound('user_not_found')
  );
  const company = assert(
    await Company.findOne({ _id: companyId }).populate('account', ['email']),
    NotFound('company_not_found')
  );

  await Recruiter.from({
    user,
    company,
    status: false,
  }).save();

  req.app.get('Sendgrid').send({
    from: 'tyler.escolano@ynov.com',
    to: company.account.email,
    subject: 'Recruiter break his link',
    body: `<p>We are sorry but recruiter ${user.first_name} break ` +
      'his link with you</p>',
  });

  res.json({ asked: true });
};

export const get = async (req, res) => {
  const userId = assert(req.params.id, BadRequest('wrong_recruiter_id'),
    val => mongoose.Types.ObjectId.isValid(val));

  const user = assert(
    await User.findOne({ _id: userId }).populate('account', ['email']),
    NotFound('user_not_found')
  );

  res.json({ user });
};

export const getAllCompanies = async (req, res) => {
  const userId = assert(req.params.id, BadRequest('wrong_recruiter_id'),
    val => mongoose.Types.ObjectId.isValid(val));

  const user = assert(
    await User.findOne({ _id: userId }),
    NotFound('user_not_found')
  );

  const recruiters = await Recruiter
    .find({ user })
    .populate('company', ['name', 'logo']);

  const companies = recruiters.map(r => r.comapny);

  res.json({ companies });
};

export const update = async (req, res) => {
  const userId = assert(req.params.id, BadRequest('wrong_recruiter_id'),
    val => mongoose.Types.ObjectId.isValid(val));
  const recruiter = assert(req.body.recruiter, BadRequest('invalid_request'));
  const email = assert(recruiter.email, BadRequest('invalid_request'), isEmail);
  const password = assert(recruiter.password, BadRequest('invalid_request'));

  const user = assert(
    await User.findOne({ _id: userId }).populate('account'),
    NotFound('user_not_found')
  );

  let account = await Account.findOne({ email });

  if (account && user.account._id.toString() !== account._id.toString()) {
    throw Conflict('already_exists');
  }

  if (!account) {
    const old = await Account.findOne({ _id: user.account._id });

    account = await Account.from({
      email,
      password,
      type: Account.TYPE_RECRUITER,
    });

    await old.remove();
  } else {
    Object.assign(account, {
      email,
      password,
    });
  }

  Object.assign(user, {
    ...omit(recruiter, ['email', 'password']),
    account,
  });

  await account.save();
  await user.save();

  res.json({ user });
};

export const remove = async (req, res) => {
  const userId = assert(req.params.id, BadRequest('wrong_recruiter_id'),
    val => mongoose.Types.ObjectId.isValid(val));

  const user = assert(
    await User.findOne({ _id: userId }).populate('account'),
    NotFound('user_not_found')
  );

  const account = assert(
    await Account.findOne({ _id: user.account._id }),
    NotFound('accounts_not_found')
  );

  const recruiters = await Recruiter
    .find({ user })
    .populate({
      path: 'company',
      select: ['name', 'account'],
      populate: {
        path: 'account',
        select: ['email', 'type'],
      },
    });

  if (recruiters) {
    for (const recruiter of recruiters) {
      const companyEmail = recruiter.company.account.email;

      const jobAnnouncements = await JobAnnouncement.find({
        recruiter,
        deleted: false,
      });

      const jobAnnInfos = jobAnnouncements.map(async ann => {
        ann.deleted = true;
        ann.recruiter = undefined;
        await ann.save();

        return { _id: ann._id, name: ann.name };
      });

      req.app.get('Sendgrid').send({
        from: 'tyler.escolano@ynov.com',
        to: companyEmail,
        subject: 'Recruiter break his link',
        body: `<p>We are sorry but recruiter ${user.first_name} break ` +
          'his link with you</p>',
      });

      await recruiter.remove();
    }
  }

  await user.remove();
  await account.remove();

  res.json({ deleted: true });
};
