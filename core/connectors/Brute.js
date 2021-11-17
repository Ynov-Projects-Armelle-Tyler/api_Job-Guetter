import ExpressBrute from 'express-brute';
import RedisStore from 'express-brute-redis';

import { MAX_REQUEST_RETRIES, REDIS_URL } from '../utils/env';
import { TooManyRequests } from '../utils/errors';

export default app => {
  let store;

  /* istanbul ignore next: cannot test redis in test mode */
  if (REDIS_URL && app.get && app.get('Redis')) {
    store = new RedisStore({ client: app.get('Redis') });
  } else {
    store = new ExpressBrute.MemoryStore();
  }

  /* istanbul ignore next: cannot test brute force in test mode anyways */
  app.set('Brute', new ExpressBrute(store, {
    freeRetries: MAX_REQUEST_RETRIES,
    minWait: 5000,
    failCallback: (req, res, next, nextValidRequestDate) =>
      TooManyRequests('too_many_requests', 'Too many requests', {
        nextValidRequestDate: nextValidRequestDate,
      }).send(res),
  }));
};
