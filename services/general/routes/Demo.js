import { AuthInterceptor } from '@job-guetter/api-core/interceptors';
import { Account } from '@job-guetter/api-core/models';

import * as Demo from '../Demo';

const types = Account.AVAILABLE_TYPES;

export default {
  'GET /general/test': {
    interceptors: [
      AuthInterceptor(types),
    ],
    handle: Demo.get,
  },
};
