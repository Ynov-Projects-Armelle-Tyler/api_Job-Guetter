import General from '@job-guetter/api-general';
import {
  Recruiter,
  Announcement,
  Applyment,
} from '@job-guetter/api-core/models';

import {
  get,
  post,
  remove,
  getAuthorizationHeaders,
} from '../../utils/request';
import {
  mockServer,
  mockToken,
  mockAccount,
} from '../../utils/mocks';

jest.mock('node-fetch', () => jest.fn());

describe('@job-guetter/api-general/Recruiter', () => {
  let service, server, user, tokenRec, company, recruiter, jobber, tokenJob;

  beforeAll(async () => {
    service = await mockServer(General, { returnOnlyServer: false });
    server = service.server;
    user = await mockAccount('TYPE_RECRUITER');
    tokenRec = await mockToken(user);
    company = await mockAccount('TYPE_COMPANY');
    recruiter = await Recruiter.from({
      user: user.user._id,
      company: company.company._id,
      status: true,
    }).save();
    jobber = await mockAccount('TYPE_JOBBER');
    tokenJob = await mockToken(jobber);

  });

  describe('POST /general/applyment', () => {

    test('should create an applyment', async () => {
      const ann = await Announcement.from({
        name: 'test',
        contract_type: 'CDI',
        recruiter,
        company: company.company,
      }).save();

      const res = await post(server, {
        url: '/api/v1/general/applyment',
        body: {
          applyment: {
            description: 'test',
          },
          announcementId: ann._id,
        },
        headers: {
          ...getAuthorizationHeaders(tokenJob.access_token),
        },
      });

      expect(res.created).toBe(true);

      await ann.remove();
    });

  });

  describe('GET /general/applyment', () => {

    test('should get all applyment of jobber', async () => {
      const ann = await Announcement.from({
        name: 'test',
        contract_type: 'CDI',
        recruiter,
        company: company.company,
      }).save();
      const app = await Applyment.from({
        description: 'test',
        jobber: jobber.jobber,
        announcement: ann,
      }).save();

      const res = await get(server, {
        url: '/api/v1/general/applyment',
        headers: {
          ...getAuthorizationHeaders(tokenJob.access_token),
        },
      });

      expect(res.applyments).toBeDefined();
      expect(res.applyments[0].description).toBe('test');

      await ann.remove();
      await app.remove();
    });

  });

  describe('GET /general/applyment/:id', () => {

    test('should get applyment by id', async () => {
      const ann = await Announcement.from({
        name: 'test',
        contract_type: 'CDI',
        recruiter,
        company: company.company,
      }).save();
      const app = await Applyment.from({
        description: 'test',
        jobber: jobber.jobber,
        announcement: ann,
      }).save();

      const res = await get(server, {
        url: `/api/v1/general/applyment/${app._id}`,
        headers: {
          ...getAuthorizationHeaders(tokenJob.access_token),
        },
      });

      expect(res.applyment).toBeDefined();

      await ann.remove();
      await app.remove();
    });

    test('should get applyment by id as recruiter', async () => {
      const ann = await Announcement.from({
        name: 'test',
        contract_type: 'CDI',
        recruiter,
        company: company.company,
      }).save();
      const app = await Applyment.from({
        description: 'test',
        jobber: jobber.jobber,
        announcement: ann,
      }).save();

      const res = await get(server, {
        url: `/api/v1/general/applyment/${app._id}`,
        headers: {
          ...getAuthorizationHeaders(tokenRec.access_token),
        },
      });

      expect(res.applyment).toBeDefined();

      await ann.remove();
      await app.remove();
    });

    test('should return access_denied', async () => {
      const ann = await Announcement.from({
        name: 'test',
        contract_type: 'CDI',
        recruiter,
        company: company.company,
      }).save();
      const app = await Applyment.from({
        description: 'test',
        jobber: jobber.jobber,
        announcement: ann,
      }).save();
      const jobb = await mockAccount('TYPE_JOBBER');
      const tok = await mockToken(jobb);

      let err;

      try {
        await get(server, {
          url: `/api/v1/general/applyment/${app._id}`,
          headers: {
            ...getAuthorizationHeaders(tok.access_token),
          },
        });
      } catch (e) {
        err = e;
      }

      expect(err.statusCode).toBe(401);
      expect(err.error.error).toBe('access_denied');

      await ann.remove();
      await app.remove();
      await jobb.clean();
    });

  });

  describe('DELETE /general/applyment/:id', () => {

    test('should create an applyment', async () => {
      const ann = await Announcement.from({
        name: 'test',
        contract_type: 'CDI',
        recruiter,
        company: company.company,
      }).save();
      const app = await Applyment.from({
        description: 'test',
        jobber: jobber.jobber,
        announcement: ann,
      }).save();

      const res = await remove(server, {
        url: `/api/v1/general/applyment/${app._id}`,
        headers: {
          ...getAuthorizationHeaders(tokenJob.access_token),
        },
      });

      expect(res.deleted).toBe(true);

      await ann.remove();
      await app?.remove();
    });

  });

  afterAll(async () => {
    await user.clean();
    await company.clean();
    await jobber.clean();
    await recruiter.remove();
    await server.stop();
  });

});
