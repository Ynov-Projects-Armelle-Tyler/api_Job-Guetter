import { Server } from '@job-guetter/api-core';

import {
  MongoDB,
} from '@job-guetter/api-core/connectors';

import * as Demo from './Demo';

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
        interceptors: [],
        handle: Demo.get,
      },

    },
  });

  port = __DEV__ ? 8001 : port;

  return app.start({ port });
};
