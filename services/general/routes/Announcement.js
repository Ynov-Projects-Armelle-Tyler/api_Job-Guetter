import { AuthInterceptor } from '@job-guetter/api-core/interceptors';

import * as Announcement from '../Announcement';

export default {

  'POST /general/announcement': {
    interceptors: [
      AuthInterceptor('TYPE_RECRUITER'),
    ],
    handle: Announcement.create,
  },

  'GET /general/announcement': {
    interceptors: [],
    handle: Announcement.getAll,
  },

  'GET /general/announcement/:id': {
    interceptors: [],
    handle: Announcement.get,
  },

  'GET /general/announcement/:id/applyment': {
    interceptors: [
      AuthInterceptor(['TYPE_RECRUITER', 'TYPE_COMPANY']),
    ],
    handle: Announcement.getAllApplyment,
  },

  'PUT /general/announcement/:id': {
    interceptors: [
      AuthInterceptor('TYPE_RECRUITER'),
    ],
    handle: Announcement.update,
  },

  'PATCH /general/announcement/:id': {
    interceptors: [
      AuthInterceptor('TYPE_RECRUITER'),
    ],
    handle: Announcement.archive,
  },
};
