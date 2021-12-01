import {
  AuthInterceptor,
  IdentityInterceptor,
} from '@job-guetter/api-core/interceptors';

import * as Jobber from '../Jobber';

export default {

  'POST /general/jobber': {
    interceptors: [],
    handle: Jobber.create,
  },

  'GET /general/jobber': {
    interceptors: [],
    handle: Jobber.getAll,
  },

  'GET /general/jobber/:id': {
    interceptors: [
      AuthInterceptor('TYPE_JOBBER'),
      IdentityInterceptor,
    ],
    handle: Jobber.get,
  },

  'PUT /general/jobber/:id': {
    interceptors: [
      AuthInterceptor('TYPE_JOBBER'),
      IdentityInterceptor,
    ],
    handle: Jobber.update,
  },

  'DELETE /general/jobber/:id': {
    interceptors: [
      AuthInterceptor('TYPE_JOBBER'),
      IdentityInterceptor,
    ],
    handle: Jobber.remove,
  },
};
