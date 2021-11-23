import General from '@job-guetter/api-general';
import { Account, User, Recruiter } from '@job-guetter/api-core/models';

import {
  get,
  post,
  put,
  patch,
  remove,
  getAuthorizationHeaders,
} from '../../utils/request';
import {
  mockServer,
  mockToken,
  mockAccount,
  mockData,
} from '../../utils/mocks';

jest.mock('node-fetch', () => jest.fn());

describe('@job-guetter/api-general/Recruiter', () => {
  let service, server, app, datas, ctx;

  beforeAll(async () => {
    service = await mockServer(General, { returnOnlyServer: false });
    server = service.server;
    app = service.app;
    datas = await mockData('TYPE_RECRUITER');

    ctx = {
      recruiter: await Recruiter.from({
        user: datas.currentUser.user,
        company: datas.companies[0],
        status: true,
      }).save(),
    };
  });

  describe('POST /general/recruiter', () => {

    test('should create a recruiter account', async () => {

      const res = await post(server, {
        url: '/api/v1/general/recruiter',
        body: {
          recruiter: {
            email: 'test-r1@gmail.com',
            password: 'recruiter1',
            first_name: 'Patt updated',
            last_name: 'Rik update',
          },
        },
      });

      expect(res.created).toBe(true);

      const account = await Account.findOne({ email: 'test-r1@gmail.com' });
      const user = await User.findOne({ account });
      await account.remove();
      await user.remove();
    });

    test('should not create a account because already exists', async () => {
      const account = await mockAccount('TYPE_RECRUITER');

      let err;

      try {
        await post(server, {
          url: '/api/v1/general/recruiter',
          body: {
            recruiter: {
              email: account.email,
              password: 'test',
              first_name: 'Patt updated',
              last_name: 'Rik update',
            },
          },
        });
      } catch (e) {
        err = e;
      }

      expect(err.statusCode).toBe(409);
      expect(err.error.error).toBe('already_exists');

      await account.clean();
    });

    test('should not create a account because email invalid', async () => {
      let err;

      try {
        await post(server, {
          url: '/api/v1/general/recruiter',
          body: {
            recruiter: {
              email: 'invalidEmail',
              password: 'test',
              first_name: 'Patt updated',
              last_name: 'Rik update',
            },
          },
        });
      } catch (e) {
        err = e;
      }

      expect(err.statusCode).toBe(400);
      expect(err.error.error).toBe('email_format');
    });

  });

  describe('GET /general/recruiter/:id', () => {

    test('should get recruiter infos', async () => {
      const data = await mockAccount('TYPE_RECRUITER');
      const token = await mockToken(data);

      const res = await get(server, {
        url: `/api/v1/general/recruiter/${data.user._id}`,
        headers: {
          ...getAuthorizationHeaders(token.access_token),
        },
      });

      expect(res.user).toBeDefined();
      expect(res.user.account.email).toBe(data.email);

      await data.clean();
    });

    test('should return authorization error', async () => {
      let err;

      const data = await mockAccount('TYPE_RECRUITER');
      const token = await mockToken(data);

      try {
        await get(server, {
          url: '/api/v1/general/recruiter/618123a4ee0ccc859ac25800',
          headers: {
            ...getAuthorizationHeaders(token.access_token),
          },
        });
      } catch (e) {
        err = e;
      }

      expect(err.statusCode).toBe(403);
      expect(err.error.error).toBe('authorization_error');

      await data.clean();
    });

    test('should return wrong recruiter id', async () => {
      let err;

      const data = await mockAccount('TYPE_RECRUITER');
      const token = await mockToken(data);

      const test = await mockData('TYPE_RECRUITER');
      await test.clean();

      try {
        await get(server, {
          url: '/api/v1/general/recruiter/123',
          headers: {
            ...getAuthorizationHeaders(token.access_token),
          },
        });
      } catch (e) {
        err = e;
      }

      expect(err.statusCode).toBe(400);
      expect(err.error.error).toBe('wrong_recruiter_id');

      await data.clean();
    });

  });

  describe('GET /general/recruiter/:id/companies', () => {

    test('should get all companies with recruiter link', async () => {
      const id = datas.currentUser.user._id;

      const res = await get(server, {
        url: `/api/v1/general/recruiter/${id}/companies`,
        headers: {
          ...getAuthorizationHeaders(datas.currentToken.access_token),
        },
      });

      expect(res.companies).toBeDefined();
      expect(res.companies.length).toBe(1);
    });

    test('should return authorization error', async () => {
      let err;

      try {
        await get(server, {
          url: '/api/v1/general/recruiter/618123a4ee0ccc859ac25800',
          headers: {
            ...getAuthorizationHeaders(datas.currentToken.access_token),
          },
        });
      } catch (e) {
        err = e;
      }

      expect(err.statusCode).toBe(403);
      expect(err.error.error).toBe('authorization_error');
    });

    test('should return wrong recruiter id', async () => {
      let err;

      const test = await mockData('TYPE_RECRUITER');
      await test.clean();

      try {
        await get(server, {
          url: '/api/v1/general/recruiter/123',
          headers: {
            ...getAuthorizationHeaders(datas.currentToken.access_token),
          },
        });
      } catch (e) {
        err = e;
      }

      expect(err.statusCode).toBe(400);
      expect(err.error.error).toBe('wrong_recruiter_id');
    });

  });

  afterAll(async () => {
    await server.stop();
    await datas.clean();
  });

});
