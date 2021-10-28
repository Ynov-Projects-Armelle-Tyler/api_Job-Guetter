import { Server } from '@job-guetter/api-core';

import {
  MongoDB,
  Sendgrid,
} from '@job-guetter/api-core/connectors';
import { AuthInterceptor } from '@job-guetter/api-core/interceptors';
import { Account } from '@job-guetter/api-core/models';

import * as Demo from './Demo';
import * as Recruiter from './Recruiter';

const types = Account.AVAILABLE_TYPES;

export default async ({ port } = {}) => {
  const app = await Server({
    serviceName: 'general',
    basePath: '/api/v1',
    connectors: [
      MongoDB,
      Sendgrid,
    ],
    routes: {

      // Demo
      'GET /general/test': {
        interceptors: [
          // AuthInterceptor(types),
        ],
        handle: Demo.get,
      },

      // Recruiter
      'POST /general/recruiter': {
        interceptors: [
          // AuthInterceptor(types),
        ],
        handle: Recruiter.create,
      },

      'POST /general/recruiter/:id/company/:companyId': {
        interceptors: [
          // AuthInterceptor(types),
        ],
        handle: Recruiter.ask,
      },

      'GET /general/recruiter/:id': {
        interceptors: [
          // AuthInterceptor(types),
        ],
        handle: Recruiter.get,
      },

      'GET /general/recruiter/:id/companies': {
        interceptors: [
          // AuthInterceptor(types),
        ],
        handle: Recruiter.getAllCompanies,
      },

      'PUT /general/recruiter/:id': {
        interceptors: [
          // AuthInterceptor(types),
        ],
        handle: Recruiter.update,
      },

      'DELETE /general/recruiter/:id': {
        interceptors: [
          // AuthInterceptor(types),
        ],
        handle: Recruiter.remove,
      },

    },
  });

  port = __DEV__ ? 8001 : port;

  return app.start({ port });
};
