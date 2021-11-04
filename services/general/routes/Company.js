import {
  AuthInterceptor,
  IdentityInterceptor,
} from '@job-guetter/api-core/interceptors';

import * as Company from '../Company';

export default {

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
      AuthInterceptor(['TYPE_COMPANY']),
      IdentityInterceptor,
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
};
