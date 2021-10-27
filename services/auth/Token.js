import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import isEmail from '@job-guetter/api-core/utils/validate';
import { Account } from '@job-guetter/api-core/models';
import { assert } from '@job-guetter/api-core/utils/assert';
import { BadRequest, Unauthorized } from '@job-guetter/api-core/utils/errors';
import {
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  TOKEN_NORMAL_EXPIRY,
  TOKEN_EXTENDED_EXPIRY,
} from '@job-guetter/api-core/utils/env';

export const generate = async (req, res) => {
  const email = assert(req.body.email, BadRequest('invalid_request'), isEmail);
  const password = assert(req.body.password, BadRequest('invalid_request'));

  const user = await await Account.findOne({ email });
  const cmp = await compare(password, user.password);

  if (!cmp) {
    throw Unauthorized('access_denied');
  }

  const accessToken = await sign({ user_id: user._id, email }, TOKEN_KEY,
    { expiresIn: TOKEN_NORMAL_EXPIRY });

  const salt = await user.genSalt();

  const refreshToken = await sign({ salt: salt }, REFRESH_TOKEN_KEY,
    { expiresIn: TOKEN_EXTENDED_EXPIRY });

  user.access_token = accessToken;
  user.refresh_token = refreshToken;
  user.refresh_token_salt = salt;
  await user.save();

  res.json({
    accessToken: accessToken,
    refreshToken: refreshToken,
    tokenType: 'bearer',
  });
};

// export const refresh = async (req, res) => {
//   const email = assert(req.body.email, BadRequest('invalid_request'), isEmail);
//   const password = assert(req.body.password, BadRequest('invalid_request'));
//
//   const user = await await Account.findOne({ email });
//   const cmp = await compare(password, user.password);
//
//   if (!cmp) {
//     throw Unauthorized('access_denied');
//   }
//
//   const accessToken = await sign({ user_id: user._id, email }, TOKEN_KEY,
//     { expiresIn: TOKEN_NORMAL_EXPIRY });
//
//   const salt = await user.genSalt();
//
//   const refreshToken = await sign({ salt: salt }, REFRESH_TOKEN_KEY,
//     { expiresIn: TOKEN_EXTENDED_EXPIRY });
//
//   user.access_token = accessToken;
//   user.refresh_token = refreshToken;
//   user.refresh_token_salt = salt;
//   await user.save();
//
//   res.json({
//     accessToken: accessToken,
//     refreshToken: refreshToken,
//     tokenType: 'bearer',
//   });
// };
