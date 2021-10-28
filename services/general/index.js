import { Server } from '@job-guetter/api-core';

import {
  MongoDB,
} from '@job-guetter/api-core/connectors';
import { AuthInterceptor } from '@job-guetter/api-core/interceptors';
import { Account } from '@job-guetter/api-core/models';

import * as Demo from './Demo';

const types = Account.AVAILABLE_TYPES;

export default async ({ port } = {}) => {
  const app = await Server({
    serviceName: 'general',
    basePath: '/api/v1',
    connectors: [
      MongoDB,
    ],
    routes: {

      // Demo
      'GET /general/test': {
        interceptors: [
          AuthInterceptor(types),
        ],
        handle: Demo.get,
      },

    },
  });

  port = __DEV__ ? 8001 : port;

  return app.start({ port });
};
