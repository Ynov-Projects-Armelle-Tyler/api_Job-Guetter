import redis from 'redis';

import { REDIS_URL, REDIS_PORT } from '../utils/env';

export default app => {
  let client;

  /* istanbul ignore next: don't want to test redis */
  if (REDIS_URL && REDIS_PORT) {
    client = redis.createClient({
      host: REDIS_URL,
      port: REDIS_PORT,
      enable_offline_queue: false,
    });
  }

  app.set('Redis', client);
};
