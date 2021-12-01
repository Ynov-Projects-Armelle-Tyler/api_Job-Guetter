import mongoose from 'mongoose';

import { Forbidden, BadRequest } from '../utils/errors';
import { assert } from '../utils/assert';

export default async function IdentityInterceptor (req, res, next) {
  assert(req.params.id, BadRequest('wrong_account_id'),
    val => mongoose.Types.ObjectId.isValid(val));

  if (req.params?.id !== req.decoded.user_id) {
    throw Forbidden('authorization_error');
  }

  next();
}
