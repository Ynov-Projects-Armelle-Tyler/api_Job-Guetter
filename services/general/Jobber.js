import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';

import {
  Account,
  User,
  Jobber,
} from '@job-guetter/api-core/models';
import { assert } from '@job-guetter/api-core/utils/assert';
import {
  BadRequest,
  Conflict,
  NotFound,
} from '@job-guetter/api-core/utils/errors';

export const create = async (req, res) => {
  const userInfo = assert(req.body.user, BadRequest('invalid_request'));
  const jobberInfo = assert(req.body.jobber, BadRequest('invalid_request'));
  const email = assert(req.body.email, BadRequest('email_format'), isEmail);
  const password = assert(req.body.password, BadRequest('invalid_request'));

  const exists = await Account.findOne({ email });

  if (exists) {
    throw Conflict('already_exists');
  }

  const account = await Account.from({
    email,
    password,
    type: Account.TYPE_JOBBER,
  });

  const user = await User.from({
    ...userInfo,
    account,
  });

  const jobber = await Jobber.from({ ...jobberInfo, user });

  await account.save();
  await user.save();
  await jobber.save();

  res.json({ created: true });
};

export const get = async (req, res) => {
  const jobberId = assert(req.params.id, BadRequest('wrong_jobber_id'),
    val => mongoose.Types.ObjectId.isValid(val));

  const jobber = assert(
    await Jobber.findOne({ _id: jobberId })
      .populate({ path: 'user', populate: { path: 'account' } }),
    NotFound('user_not_found')
  );

  res.json({ jobber });
};

export const getAll = async (req, res) => {
  const jobbers = assert(
    await Jobber.find({})
      .populate({ path: 'user', populate: { path: 'account' } }),
    NotFound('user_not_found')
  );

  res.json({ jobbers });
};

export const update = async (req, res) => {
  const jobberId = assert(req.params.id, BadRequest('wrong_jobber_id'),
    val => mongoose.Types.ObjectId.isValid(val));
  const jobberInfo = assert(req.body.jobber, BadRequest('invalid_request'));
  const userInfo = assert(req.body.user, BadRequest('invalid_request'));
  const email = assert(req.body.email, BadRequest('invalid_request'), isEmail);
  const password = assert(req.body.password, BadRequest('invalid_request'));

  const jobber = assert(
    await Jobber.findOne({ _id: jobberId })
      .populate({ path: 'user' }),
    NotFound('jobber_not_found')
  );

  const user = assert(
    await User.findOne({ _id: jobber.user._id })
      .populate({ path: 'account' }),
    NotFound('user_not_found')
  );

  let account = await Account.findOne({ email });

  if (
    account && user.account._id.toString() !== account._id.toString()
  ) {
    throw Conflict('already_exists');
  }

  if (!account) {
    const old = await Account.findOne({ _id: user.account._id });

    account = await Account.from({
      email,
      password,
      type: Account.TYPE_JOBBER,
    });

    await old?.remove();
  } else {
    Object.assign(account, {
      email,
      password,
    });
  }

  Object.assign(user, {
    ...userInfo,
    account,
  });
  Object.assign(jobber, {
    ...jobberInfo,
    user,
  });

  await account.save();
  await user.save();
  await jobber.save();

  res.json({ jobber });
};

export const remove = async (req, res) => {
  const jobberId = assert(req.params.id, BadRequest('wrong_jobber_id'),
    val => mongoose.Types.ObjectId.isValid(val));

  const jobber = assert(
    await Jobber.findOne({ _id: jobberId }).populate({ path: 'user' }),
    NotFound('user_not_found')
  );

  const user = assert(
    await User.findOne({ _id: jobber.user._id }).populate({ path: 'account' }),
    NotFound('accounts_not_found')
  );

  const account = assert(
    await Account.findOne({ _id: user.account._id }),
    NotFound('accounts_not_found')
  );

  await jobber.remove();
  await user.remove();
  await account.remove();

  res.json({ deleted: true });
};
