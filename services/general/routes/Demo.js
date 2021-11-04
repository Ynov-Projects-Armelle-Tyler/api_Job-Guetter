import * as Demo from '../Demo';

export default {
  'POST /general/feed': {
    interceptors: [
      // AuthInterceptor(types),
    ],
    handle: Demo.feed,
  },
};
