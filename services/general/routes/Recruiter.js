import {
  AuthInterceptor,
  IdentityInterceptor,
} from '@job-guetter/api-core/interceptors';

import * as Recruiter from '../Recruiter';

export default {

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
      AuthInterceptor('TYPE_RECRUITER'),
      IdentityInterceptor,
    ],
    handle: Recruiter.get,
  },

  'GET /general/recruiter/:id/companies': {
    interceptors: [
      AuthInterceptor('TYPE_RECRUITER'),
      IdentityInterceptor,
    ],
    handle: Recruiter.getAllCompanies,
  },

  'PUT /general/recruiter/:id': {
    interceptors: [
      AuthInterceptor('TYPE_RECRUITER'),
      IdentityInterceptor,
    ],
    handle: Recruiter.update,
  },

  'DELETE /general/recruiter/:id': {
    interceptors: [
      // AuthInterceptor(types),
    ],
    handle: Recruiter.remove,
  },
};
