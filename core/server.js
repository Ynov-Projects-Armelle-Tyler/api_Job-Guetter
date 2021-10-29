import './config';

import http from 'http';
import events from 'events';

import colors from 'colors/safe';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { ErrorsInterceptor, DefaultsInterceptor } from './interceptors';
import { TEST } from './utils/env';
import { catchError } from './utils/errors';

export default async ({
  serviceName,
  basePath = '/api/v1',
  connectors = [],
  corsOptions = {},
  routes = [],
} = {}) => {
  const app = express();
  app.events = new events();

  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use(cors({
    origin: true,
    credentials: true,
    ...corsOptions,
    allowedHeaders: [
      'Content-Type', 'Accept', 'Origin', 'Authorization', 'Cache-Control',
      'Token', 'Signature', 'Additional', 'Bundle-Identifier',
      'True-Referer', 'Platform',
      ...(corsOptions.allowedHeaders || []),
    ],
    exposedHeaders: [
      ...(corsOptions.exposedHeaders || []),
    ],
  }));

  await Promise.all(connectors.map(c => c(app)));

  const router = express.Router();

  Object.entries(routes).map(([route, options]) => {
    options = typeof options === 'function'
      ? { handle: options }
      : options;

    options.interceptors = options.interceptors || [];

    const [method, path] = route.split(' ');
    router.route(path)[method.toLowerCase()](
      [
        DefaultsInterceptor,
        ...options.interceptors.map(interceptor =>
          catchError(interceptor)
        ),
      ],
      catchError(options.handle)
    );

    return null;
  });

  router.route(`/${serviceName}/health`).get((req, res) => {
    res.send('OK');
  });

  router.use(ErrorsInterceptor);
  process.on('unhandledRejection', ErrorsInterceptor);

  app.use(basePath, router);

  app.start = ({ port } = {}) => new Promise(resolve => {
    const server = http.createServer(app);

    server.on('close', () => app.emit('close'));

    server.stop = async () => {
      await Promise.all(connectors.map(c => c?.disconnect?.()));
      await new Promise(resolve => server.close(resolve));
    };

    server.listen(port, () => {
      // eslint-disable-next-line no-console
      !TEST && console.log(colors.cyan(
        `[job-guetter.${serviceName}] Running on http://localhost:${port}`
      ));

      resolve({ app, server, port });
    });
  });

  return app;
};
