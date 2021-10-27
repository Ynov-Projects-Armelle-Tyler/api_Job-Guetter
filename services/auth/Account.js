import isEmail from '@job-guetter/api-core/utils/validate';
import { Account } from '@job-guetter/api-core/models';
import { assert } from '@job-guetter/api-core/utils/assert';
import { BadRequest, Conflict } from '@job-guetter/api-core/utils/errors';

export const register = async (req, res) => {
  const email = assert(req.body.email, BadRequest('invalid_request'), isEmail);
  const password = assert(req.body.password, BadRequest('invalid_request'));
  const type = assert(req.body.type, BadRequest('invalid_request'),
    val => Account.AVAILABLE_TYPES.includes(val));

  const exist = await Account.findOne({ email });

  if (exist) {
    throw Conflict('user_already_exists');
  }

  const user = await Account.from({ email, password, type }).save();

  res.json({ registered: true, user });
};
