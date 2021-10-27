import { verify } from 'jsonwebtoken';

import { Account } from '../models';
import { Forbidden, Unauthorized } from '../utils/errors';
import { TOKEN_KEY, TOKEN_NORMAL_EXPIRY } from '../utils/env';

export default async function AuthInterceptor (req, res, next) {
  const [authMode, authValue] = (req.get('authorization') || '').split(' ');

  if (!authMode && !authValue) {
    throw Forbidden('access_token_mandatory');
  }

  try {
    const user = await Account.findOne({
      access_token: authValue,
    });

    if (!user) {
      throw Forbidden('authorization_error');
    }

    const decoded = await verify(authValue, TOKEN_KEY, {
      expiresIn: TOKEN_NORMAL_EXPIRY,
    });

    if (!user.email === decoded.email) {
      throw Unauthorized('invalid_token');
    }

    req.decoded = decoded;

    next();
  } catch (error) {
    console.error(error);

    if (error.name === 'TokenExpiredError') {
      throw Forbidden('token_expired');
    }
  }

  next();
}
