import { AuthInterceptor } from '@job-guetter/api-core/interceptors';

import * as Applyment from '../Applyment';

export default {

  'POST /general/applyment': {
    interceptors: [
      // AuthInterceptor(types),
    ],
    handle: Applyment.create,
  },

  'GET /general/applyment': {
    interceptors: [
      // AuthInterceptor(types),
    ],
    handle: Applyment.getAll,
  },

  'GET /general/applyment/:id': {
    interceptors: [
      // AuthInterceptor(types),
    ],
    handle: Applyment.get,
  },

  'DELETE /general/applyment/:id': {
    interceptors: [
      // AuthInterceptor(types),
    ],
    handle: Applyment.remove,
  },
};
