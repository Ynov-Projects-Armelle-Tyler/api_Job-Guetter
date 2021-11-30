import General from '@job-guetter/api-general';
import {
  Recruiter,
  Announcement,
  Applyment,
} from '@job-guetter/api-core/models';

import {
  get,
  post,
  put,
  patch,
  getAuthorizationHeaders,
} from '../../utils/request';
import {
  mockServer,
  mockToken,
  mockAccount,
} from '../../utils/mocks';

jest.mock('node-fetch', () => jest.fn());

describe('@job-guetter/api-general/Recruiter', () => {
  let service, server, user, token, company, recruiter;

  beforeAll(async () => {
    service = await mockServer(General, { returnOnlyServer: false });
    server = service.server;
    user = await mockAccount('TYPE_RECRUITER');
    token = await mockToken(user);
    company = await mockAccount('TYPE_COMPANY');
    recruiter = await Recruiter.from({
      user: user.user._id,
      company: company.company._id,
      status: true,
    }).save();

  });

  describe('POST /general/announcement', () => {

    test('should create a announcement', async () => {

      const res = await post(server, {
        url: '/api/v1/general/announcement',
        body: {
          announcement: {
            name: 'test',
            contract_type: 'CDI',
          },
          companyId: company.company._id,
        },
        headers: {
          ...getAuthorizationHeaders(token.access_token),
        },
      });

      expect(res.created).toBe(true);
      await Announcement.find().remove();
    });

    test('should return recruiter_disable', async () => {
      recruiter.status = false;
      await recruiter.save();

      let err;

      try {
        await post(server, {
          url: '/api/v1/general/announcement',
          body: {
            announcement: {
              name: 'test',
              contract_type: 'CDI',
            },
            companyId: company.company._id,
          },
          headers: {
            ...getAuthorizationHeaders(token.access_token),
          },
        });
      } catch (e) {
        err = e;
      }

      expect(err.statusCode).toBe(401);
      expect(err.error.error).toBe('recruiter_disable');

      recruiter.status = true;
      await recruiter.save();
    });

  });

  describe('GET /general/announcement', () => {

    test('should get all announcements', async () => {
      const ann = await Announcement.from({
        name: 'test',
        contract_type: 'CDI',
        recruiter,
        company: company.company,
      }).save();

      const res = await get(server, {
        url: '/api/v1/general/announcement',
      });

      expect(res.announcements).toBeDefined();

      await ann.remove();
    });

  });

  describe('GET /general/announcement/:id', () => {

    test('should get announcement by id', async () => {
      const ann = await Announcement.from({
        name: 'test',
        contract_type: 'CDI',
        recruiter,
        company: company.company,
      }).save();

      const res = await get(server, {
        url: `/api/v1/general/announcement/${ann._id}`,
      });

      expect(res.announcement).toBeDefined();
      expect(res.announcement.name).toBe('test');

      await ann.remove();
    });

  });

  describe('GET /general/announcement/:id/applyment', () => {

    test('should get all applyments by announcement', async () => {
      const ann = await Announcement.from({
        name: 'test',
        contract_type: 'CDI',
        recruiter,
        company: company.company,
      }).save();
      const app = await Applyment.from({
        name: 'test',
        contract_type: 'CDI',
        recruiter,
        company: company.company,
      }).save();

      const res = await get(server, {
        url: `/api/v1/general/announcement/${ann._id}/applyment`,
        headers: {
          ...getAuthorizationHeaders(token.access_token),
        },
      });

      expect(res.applyments).toBeDefined();

      await ann.remove();
      await app.remove();
    });

  });

  describe('PUT /general/announcement/:id', () => {

    test('should create a announcement', async () => {
      const ann = await Announcement.from({
        name: 'test',
        contract_type: 'CDI',
        recruiter,
        company: company.company,
      }).save();

      const res = await put(server, {
        url: `/api/v1/general/announcement/${ann._id}`,
        body: {
          announcement: {
            name: 'updated',
            contract_type: 'CDI',
          },
          companyId: company.company._id,
        },
        headers: {
          ...getAuthorizationHeaders(token.access_token),
        },
      });

      expect(res.announcement).toBeDefined();
      expect(res.announcement.name).toBe('updated');

      await ann.remove();
    });

    test('should return recruiter_disable', async () => {
      const ann = await Announcement.from({
        name: 'test',
        contract_type: 'CDI',
        recruiter,
        company: company.company,
      }).save();
      recruiter.status = false;
      await recruiter.save();

      let err;

      try {
        await put(server, {
          url: `/api/v1/general/announcement/${ann._id}`,
          body: {
            announcement: {
              name: 'updated',
              contract_type: 'CDI',
            },
            companyId: company.company._id,
          },
          headers: {
            ...getAuthorizationHeaders(token.access_token),
          },
        });
      } catch (e) {
        err = e;
      }

      // expect(err.statusCode).toBe(401);
      expect(err.error.error).toBe('recruiter_disable');

      recruiter.status = true;
      await recruiter.save();
      await ann.remove();
    });

  });

  describe('PATCH /general/announcement/:id', () => {

    test('should get all applyments by announcement', async () => {
      const ann = await Announcement.from({
        name: 'test',
        contract_type: 'CDI',
        recruiter,
        company: company.company,
      }).save();

      const res = await patch(server, {
        url: `/api/v1/general/announcement/${ann._id}`,
        headers: {
          ...getAuthorizationHeaders(token.access_token),
        },
      });

      expect(res.deleted).toBe(true);

      await ann.remove();
    });

  });

  afterAll(async () => {
    await user.clean();
    await company.clean();
    await recruiter.remove();
    await server.stop();
  });

});
