import { AuthInterceptor } from '@job-guetter/api-core/interceptors';

import * as Applyment from '../Applyment';

export default {

  'POST /general/applyment': {
    interceptors: [
      AuthInterceptor('TYPE_JOBBER'),
    ],
    handle: Applyment.create,
  },

  'GET /general/applyment': {
    interceptors: [
      AuthInterceptor('TYPE_JOBBER'),
    ],
    handle: Applyment.getAll,
  },

  'GET /general/applyment/:id': {
    interceptors: [
      AuthInterceptor(['TYPE_JOBBER', 'TYPE_RECRUITER']),
    ],
    handle: Applyment.get,
  },

  'DELETE /general/applyment/:id': {
    interceptors: [
      AuthInterceptor('TYPE_JOBBER'),
    ],
    handle: Applyment.remove,
  },
};
