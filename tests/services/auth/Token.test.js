import Auth from '@job-guetter/api-auth';

import { post } from '../../utils/request';
import {
  mockServer,
  mockAccount,
  mockToken,
} from '../../utils/mocks';

jest.mock('node-fetch', () => jest.fn());

describe('@job-guetter/api-auth/Token', () => {
  let service, server, user, jobber, company;

  beforeAll(async () => {
    service = await mockServer(Auth, { returnOnlyServer: false });
    server = service.server;
    user = await mockAccount('TYPE_RECRUITER');
    jobber = await mockAccount('TYPE_JOBBER');
    company = await mockAccount('TYPE_COMPANY');
  });

  describe('POST /auth/login', () => {

    test('should login with recruiter account', async () => {

      const res = await post(server, {
        url: '/api/v1/auth/login',
        body: {
          email: user.email,
          password: user.password,
        },
      });

      expect(res.accessToken).toBeDefined();

    });

    test('should login with jobber account', async () => {

      const res = await post(server, {
        url: '/api/v1/auth/login',
        body: {
          email: jobber.email,
          password: jobber.password,
        },
      });

      expect(res.accessToken).toBeDefined();

    });

    test('should login with company account', async () => {

      const res = await post(server, {
        url: '/api/v1/auth/login',
        body: {
          email: company.email,
          password: company.password,
        },
      });

      expect(res.accessToken).toBeDefined();

    });

    test('should return access_denied because sent wrong passwd', async () => {
      let err;

      try {
        await post(server, {
          url: '/api/v1/auth/login',
          body: {
            email: company.email,
            password: jobber.password,
          },
        });
      } catch (e) {
        err = e;
      }

      expect(err.statusCode).toBe(401);
      expect(err.error.error).toBe('access_denied');

    });

  });

  describe('POST /auth/refresh', () => {

    test('should refresh token', async () => {
      const comp = await mockAccount('TYPE_COMPANY');
      const tok = await mockToken(comp);

      const res = await post(server, {
        url: '/api/v1/auth/refresh',
        body: {
          access_token: tok.access_token,
          refresh_token: tok.refresh_token,
        },
      });

      expect(res.accessToken).toBeDefined();

      await comp.clean();
    });

  });

  afterAll(async () => {
    await user.clean();
    await jobber.clean();
    await company.clean();
    await server.stop();
  });

});
