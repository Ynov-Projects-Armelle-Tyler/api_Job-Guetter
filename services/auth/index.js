import { Server } from '@job-guetter/api-core';

import { MongoDB } from '@job-guetter/api-core/connectors';

import * as Account from './Account';
import * as Token from './Token';

export default async ({ port } = {}) => {
  const app = await Server({
    serviceName: 'auth',
    basePath: '/api/v1',
    connectors: [
      MongoDB,
    ],
    routes: {

      // Account
      'POST /auth/register': {
        interceptors: [],
        handle: Account.register,
      },

      // Token
      'POST /auth/login': {
        interceptors: [],
        handle: Token.generate,
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
