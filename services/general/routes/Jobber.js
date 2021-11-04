import { AuthInterceptor } from '@job-guetter/api-core/interceptors';

import * as Jobber from '../Jobber';

export default {

  'POST /general/jobber': {
    interceptors: [
      // AuthInterceptor(types),
    ],
    handle: Jobber.create,
  },

  'GET /general/jobber': {
    interceptors: [
      // AuthInterceptor(types),
    ],
    handle: Jobber.getAll,
  },

  'GET /general/jobber/:id': {
    interceptors: [
      // AuthInterceptor(types),
    ],
    handle: Jobber.get,
  },

  'PUT /general/jobber/:id': {
    interceptors: [
      // AuthInterceptor(types),
    ],
    handle: Jobber.update,
  },

  'DELETE /general/jobber/:id': {
    interceptors: [
      // AuthInterceptor(types),
    ],
    handle: Jobber.remove,
  },
};
