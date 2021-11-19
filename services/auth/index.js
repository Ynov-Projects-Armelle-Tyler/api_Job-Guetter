import { Server } from '@job-guetter/api-core';

import { MongoDB, Brute, Redis } from '@job-guetter/api-core/connectors';

import * as Token from './Token';

export default async ({ port } = {}) => {
  const app = await Server({
    serviceName: 'auth',
    basePath: '/api/v1',
    connectors: [
      MongoDB,
      Redis,
      Brute,
    ],
    routes: {

      // Token
      'POST /auth/login': {
        interceptors: [],
        handle: Token.login,
      },

      // Token
      'POST /auth/refresh': {
        interceptors: [],
        handle: Token.refresh,
      },

    },
  });

  port = __DEV__ ? 8002 : port;

  return app.start({ port });
};
