import { compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

import isEmail from '@job-guetter/api-core/utils/validate';
import { Account, Company, User, Jobber } from '@job-guetter/api-core/models';
import { assert } from '@job-guetter/api-core/utils/assert';
import {
  BadRequest,
  Unauthorized,
  NotFound,
} from '@job-guetter/api-core/utils/errors';
import {
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  TOKEN_NORMAL_EXPIRY,
  TOKEN_EXTENDED_EXPIRY,
} from '@job-guetter/api-core/utils/env';

const grantWithPassword = async (req, res) => {
  const email = assert(req.body.email, BadRequest('invalid_request'), isEmail);
  const password = assert(req.body.password, BadRequest('invalid_request'));

  const account = assert(
    await Account.findOne({ email }),
    NotFound('account_not_found')
  );
  const cmp = await compare(password, account.password);

  if (!cmp) {
    throw Unauthorized('access_denied');
  }

  let user = account.type === 'TYPE_COMPANY'
    ? assert(
      await Company.findOne({ account }),
      NotFound('company_not_found')
    )
    : assert(
      await User.findOne({ account }),
      NotFound('account_not_found')
    );

  if (account.type === 'TYPE_JOBBER') {
    user = assert(
      await Jobber.findOne({ user }),
      NotFound('account_not_found')
    );
  }

  const accessToken = await sign(
    {
      user_id: user._id,
      type: account.type,
      email,
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

  res.json({
    accessToken: accessToken,
    refreshToken: refreshToken,
    tokenType: 'bearer',
  });
};

export const login = async (req, res, next) => {
  return req.app.get('Brute').prevent(req, res, async () => {
    try {
      await grantWithPassword(req, res);
    } catch (e) {
      next(e, req, res, next);
    }
  });
};

export const refresh = async (req, res) => {
  const accessToken = assert(req.body.access_token,
    BadRequest('invalid_request'));
  const refreshToken = assert(req.body.refresh_token,
    BadRequest('invalid_request'));

  const user = assert(await Account.findOne({
    access_token: accessToken,
    refresh_token: refreshToken,
  }), NotFound('refresh_token_not_found'));

  let decoded;

  try {
    decoded = await verify(refreshToken, REFRESH_TOKEN_KEY, {
      expiresIn: TOKEN_EXTENDED_EXPIRY,
    });
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      const salt = await user.genSalt();

      const newRefreshToken = await sign({ salt: salt }, REFRESH_TOKEN_KEY,
        { expiresIn: TOKEN_EXTENDED_EXPIRY });

      user.refresh_token = newRefreshToken;
      user.refresh_token_salt = salt;
      await user.save();

      refresh(req, res);
    }
  }

  if (decoded?.salt !== user.refresh_token_salt) {
    Unauthorized('invalid_refresh_token');
  }

  const newAccessToken = await sign({ user_id: user._id, email: user.email },
    TOKEN_KEY, { expiresIn: TOKEN_NORMAL_EXPIRY });

  user.access_token = newAccessToken;
  await user.save();

  res.json({
    accessToken: newAccessToken,
    refreshToken: refreshToken,
    tokenType: 'bearer',
  });
};
