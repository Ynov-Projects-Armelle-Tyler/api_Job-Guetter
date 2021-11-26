import {
  Account,
  Jobber,
  User,
} from '@job-guetter/api-core/models';
import General from '@job-guetter/api-general';
import { generateEmail, generateId } from '../../utils/defaults';
import {
  mockAccount,
  mockServer,
  mockToken,
} from '../../utils/mocks';
import {
  get,
  post,
  remove,
  getAuthorizationHeaders,
} from '../../utils/request';

jest.mock('node-fetch', () => jest.fn());

describe('@job-guetter/api-general/Jobber', () => {
  let service, server;

  beforeAll(async () => {
    service = await mockServer(General, { returnOnlyServer: false });
    server = service.server;
  });

  describe('POST /general/jobber', () => {

    test('should create a jobber account', async () => {
      const email = generateEmail();

      const res = await post(server, {
        url: '/api/v1/general/jobber',
        body: {
          user: {
            first_name: 'Patt updated',
            last_name: 'Rik update',
          },
          jobber: {
            description: 'some desc',
          },
          password: generateId(),
          email,
        },
      });

      expect(res.created).toBe(true);

      const account = await Account.findOne({ email });
      const user = await User.findOne({ account });
      const jobber = await Jobber.findOne({ user });
      await account.remove();
      await user.remove();
      await jobber.remove();
    });

    test('should return already_exists err', async () => {
      const data = await mockAccount('TYPE_JOBBER');

      let err;

      try {
        await post(server, {
          url: '/api/v1/general/jobber',
          body: {
            user: {
              first_name: 'Patt updated',
              last_name: 'Rik update',
            },
            jobber: {
              description: 'some desc',
            },
            password: generateId(),
            email: data.account.email,
          },
        });
      } catch (e) {
        err = e;
      }

      expect(err.statusCode).toBe(409);
      expect(err.error.error).toBe('already_exists');

      await data.clean();
    });

  });

  describe('GET /general/jobber/:id', () => {

    test('should get jobber account', async () => {
      const data = await mockAccount('TYPE_JOBBER');
      const token = await mockToken(data);

      const res = await get(server, {
        url: `/api/v1/general/jobber/${data.jobber._id}`,
        headers: {
          ...getAuthorizationHeaders(token.access_token),
        },
      });

      expect(res.jobber).toBeDefined();
      expect(res.jobber.user.account.email).toBe(data.account.email);

      await data.clean();
    });

    test('should return wrong_account_id err', async () => {
      const data = await mockAccount('TYPE_JOBBER');
      const token = await mockToken(data);

      let err;

      try {
        await get(server, {
          url: '/api/v1/general/jobber/123',
          headers: {
            ...getAuthorizationHeaders(token.access_token),
          },
        });
      } catch (e) {
        err = e;
      }

      expect(err.statusCode).toBe(400);
      expect(err.error.error).toBe('wrong_account_id');

      await data.clean();
    });

  });

  describe('GET /general/jobber', () => {

    test('should get all jobber', async () => {
      const jobber1 = await mockAccount('TYPE_JOBBER');
      const jobber2 = await mockAccount('TYPE_JOBBER');

      const res = await get(server, {
        url: '/api/v1/general/jobber',
      });

      expect(res.jobbers).toBeDefined();
      expect(res.jobbers.length).toBe(2);

      await jobber1.clean();
      await jobber2.clean();
    });

  });

  describe('DELETE /general/jobber/:id', () => {

    test('should remove jobber', async () => {
      const data = await mockAccount('TYPE_JOBBER');
      const token = await mockToken(data);

      const res = await remove(server, {
        url: `/api/v1/general/jobber/${data.jobber._id}`,
        headers: {
          ...getAuthorizationHeaders(token.access_token),
        },
      });

      const accounts = await Account.find({});
      const users = await User.find({});

      expect(res.deleted).toBe(true);
      expect(accounts.length).toBe(0);
      expect(users.length).toBe(0);

      await data.clean();
    });

  });

  afterAll(async () => {
    await server.stop();
  });

});
