import { Server } from '@job-guetter/api-core';

import {
  MongoDB,
  Sendgrid,
  SireneAPI,
} from '@job-guetter/api-core/connectors';

import routes from './routes';

export default async ({ port } = {}) => {
  const app = await Server({
    serviceName: 'general',
    basePath: '/api/v1',
    connectors: [
      MongoDB,
      Sendgrid,
      SireneAPI,
    ],
    routes: { ...routes },
  });

  port = __DEV__ ? 8001 : port;

  return app.start({ port });
};
