import { Server } from '@job-guetter/api-core';

import {
  MongoDB,
  Sendgrid,
  SireneAPI,
} from '@job-guetter/api-core/connectors';
import { AuthInterceptor } from '@job-guetter/api-core/interceptors';
import { Account } from '@job-guetter/api-core/models';

import * as Demo from './Demo';
import * as Recruiter from './Recruiter';
import * as Company from './Company';

const types = Account.AVAILABLE_TYPES;

export default async ({ port } = {}) => {
  const app = await Server({
    serviceName: 'general',
    basePath: '/api/v1',
    connectors: [
      MongoDB,
      Sendgrid,
      SireneAPI,
    ],
    routes: {

      // Demo
      'GET /general/test': {
        interceptors: [
          AuthInterceptor(types),
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

      // Company
      'GET /general/company/sirene/:sirene': {
        interceptors: [
          // AuthInterceptor(types),
        ],
        handle: Company.getSirene,
      },

      'POST /general/company': {
        interceptors: [
          // AuthInterceptor(types),
        ],
        handle: Company.create,
      },

      'GET /general/company': {
        interceptors: [
          // AuthInterceptor(types),
        ],
        handle: Company.getAll,
      },

      'GET /general/company/:id': {
        interceptors: [
          // AuthInterceptor(types),
        ],
        handle: Company.get,
      },

      'PUT /general/company/:id': {
        interceptors: [
          // AuthInterceptor(types),
        ],
        handle: Company.update,
      },

      'DELETE /general/company/:id': {
        interceptors: [
          // AuthInterceptor(types),
        ],
        handle: Company.remove,
      },

      'GET /general/company/:id/recruiters': {
        interceptors: [
          // AuthInterceptor(types),
        ],
        handle: Company.getRecruiters,
      },

      'PATCH /general/company/:id/recruiter/:recruiter_id': {
        interceptors: [
          // AuthInterceptor(types),
        ],
        handle: Company.updateRecruiters,
      },

    },
  });

  port = __DEV__ ? 8001 : port;

  return app.start({ port });
};
