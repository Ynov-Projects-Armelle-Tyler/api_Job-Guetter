import proxy from 'express-http-proxy';
import { Server } from '@job-guetter/api-core';

import { DOMAIN } from '@job-guetter/api-core/utils/env';

const proxyOptions = {
  https: false,
  parseReqBody: false,
  proxyReqPathResolver: req => req.originalUrl,
};

export default async ({ port } = {}) => {
  const app = await Server({
    serviceName: 'proxy',
    basePath: '',
    connectors: [],
    routes: {
      'GET /ns.html': {
        interceptors: [proxy(DOMAIN, {
          ...proxyOptions,
          proxyReqPathResolver: req =>
            '/api/v1/access/no-script?' + req.url.split('?')[1],
        })],
        handle: () => {},
      },
      'GET /robots.txt': {
        handle: (req, res) => {
          res.send('');
        },
      },
      'GET /': {
        handle: (req, res) => {
          res.send('');
        },
      },
    },
  });

  port = __DEV__ ? 8999 : port;

  return app.start({ port });
};
