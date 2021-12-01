import {
  AuthInterceptor,
  IdentityInterceptor,
} from '@job-guetter/api-core/interceptors';

import * as Company from '../Company';

export default {

  'GET /general/company/sirene/:sirene': {
    interceptors: [],
    handle: Company.getSirene,
  },

  'POST /general/company': {
    interceptors: [],
    handle: Company.create,
  },

  'GET /general/company': {
    interceptors: [],
    handle: Company.getAll,
  },

  'GET /general/company/:id': {
    interceptors: [
      AuthInterceptor('TYPE_COMPANY'),
      IdentityInterceptor,
    ],
    handle: Company.get,
  },

  'PUT /general/company/:id': {
    interceptors: [
      AuthInterceptor('TYPE_COMPANY'),
      IdentityInterceptor,
    ],
    handle: Company.update,
  },

  'DELETE /general/company/:id': {
    interceptors: [
      AuthInterceptor('TYPE_COMPANY'),
      IdentityInterceptor,
    ],
    handle: Company.remove,
  },

  'GET /general/company/:id/recruiters': {
    interceptors: [
      AuthInterceptor('TYPE_COMPANY'),
      IdentityInterceptor,
    ],
    handle: Company.getRecruiters,
  },

  'PATCH /general/company/:id/recruiter/:recruiter_id': {
    interceptors: [
      AuthInterceptor('TYPE_COMPANY'),
      IdentityInterceptor,
    ],
    handle: Company.updateRecruiters,
  },
};
