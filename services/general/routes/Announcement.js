//import { AuthInterceptor } from '@job-guetter/api-core/interceptors';

import * as Announcement from '../Announcement';

export default {

  'POST /general/announcement': {
    interceptors: [
      // AuthInterceptor(types),
    ],
    handle: Announcement.create,
  },

  'GET /general/announcement': {
    interceptors: [
      // AuthInterceptor(types),
    ],
    handle: Announcement.getAll,
  },

  'GET /general/announcement/:id': {
    interceptors: [
      // AuthInterceptor(types),
    ],
    handle: Announcement.get,
  },

  'PUT /general/announcement/:id': {
    interceptors: [
      // AuthInterceptor(types),
    ],
    handle: Announcement.update,
  },

  'PATCH /general/announcement/:id': {
    interceptors: [
      // AuthInterceptor(types),
    ],
    handle: Announcement.archive,
  },

  'DELETE /general/announcement/:id': {
    interceptors: [
      // AuthInterceptor(types),
    ],
    handle: Announcement.remove,
  },
};
