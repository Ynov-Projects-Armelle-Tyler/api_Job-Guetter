import { AuthInterceptor } from '@job-guetter/api-core/interceptors';

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
};