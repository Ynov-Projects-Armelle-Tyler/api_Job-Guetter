import { sign } from 'jsonwebtoken';

import { Server } from '@job-guetter/api-core';
import { MongoDB } from '@job-guetter/api-core/connectors';
import {
  Account,
  Company,
  User,
  Jobber,
} from '@job-guetter/api-core/models';
import {
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  TOKEN_NORMAL_EXPIRY,
  TOKEN_EXTENDED_EXPIRY,
} from '@job-guetter/api-core/utils/env';

import {
  generateEmail,
  generateId,
} from './defaults';

export const mockServer = async (
  service,
  { serviceName, connectors = [MongoDB], returnOnlyServer = true } = {}
) => {
  service = service || (async () => (
    await Server({ serviceName, connectors })).start()
  );

  const runningService = await service();

  return returnOnlyServer ? runningService.server : runningService;
};

export const mockAccount = async (type = 'TYPE_JOBBER') => {
  const email = generateEmail();
  const password = generateId();

  const account = await Account
    .from({
      email,
      password,
      type,
    }).save();

  if (type === 'TYPE_COMPANY') {
    return {
      account,
      email,
      password,
      clean: async () => {
        await account.remove();
      },
    };
  }

  const firstName = generateId();
  const lastName = generateId();

  const user = await User
    .from({
      account,
      first_name: firstName,
      last_name: lastName,
    }).save();

  if (type === 'TYPE_JOBBER') {
    const jobber = await Jobber.from({
      user,
      description: 'some desc',
    }).save();

    return {
      account,
      email,
      password,
      user,
      firstName,
      lastName,
      jobber,
      clean: async () => {
        await account.remove();
        await user.remove();
        await jobber.remove();
      },
    };
  }

  const clean = async () => {
    await account.remove();
    await user.remove();
  };

  return {
    account,
    email,
    password,
    user,
    firstName,
    lastName,
    clean,
  };

};

export const mockToken = async e => {
  const account = await Account.findOne({ _id: e.account._id });

  let user = account.type === 'TYPE_COMPANY'
    ? await Company.findOne({ account })
    : await User.findOne({ _id: e.user._id });

  if (account.type === 'TYPE_JOBBER') {
    user = e.jobber;
  }

  const accessToken = await sign(
    {
      user_id: user._id,
      type: account.type,
      email: account.email,
    },
    TOKEN_KEY,
    { expiresIn: TOKEN_NORMAL_EXPIRY }
  );

  const salt = await account.genSalt();

  const refreshToken = await sign({ salt: salt }, REFRESH_TOKEN_KEY,
    { expiresIn: TOKEN_EXTENDED_EXPIRY });

  account.access_token = accessToken;
  account.refresh_token = refreshToken;
  account.refresh_token_salt = salt;
  await account.save();

  return {
    access_token: account.access_token,
  };
};

export const mockData = async (type = 'TYPE_JOBBER') => {
  const currentUser = await mockAccount(type);
  const currentToken = await mockToken(currentUser);

  const companiesAccount = await Promise.all([
    mockAccount('TYPE_COMPANY'),
    mockAccount('TYPE_COMPANY'),
  ]);

  const companies = await await Promise.all([
    Company.from({
      account: companiesAccount[0].account,
      name: generateId(),
      activity_area: 'education',
    }).save(),
    Company.from({
      account: companiesAccount[1].account,
      name: generateId(),
      activity_area: 'education',
    }).save(),
  ]);

  const clean = async () => {
    await currentUser.clean();
    await companiesAccount.forEach(e => e.clean());
    await companies.forEach(e => e.remove());
  };

  return {
    currentUser,
    currentToken,
    companies,
    clean,
  };
};
