import General from '@job-guetter/api-general';
import { Account, User } from '@job-guetter/api-core/models';

import { post } from '../../utils/request';
import { mockServer } from '../../utils/mocks';

jest.mock('node-fetch', () => jest.fn());

describe('@job-guetter/api-general/Recruiter', () => {
  let service, server, app;

  beforeAll(async () => {
    service = await mockServer(General, { returnOnlyServer: false });
    server = service.server;
    app = service.app;
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
        // headers: {
        //   ...getAuthorizationHeaders(data.authCode.access_token),
        // },
      });

      expect(res.created).toBe(true);

      const account = await Account.findOne({ email: 'test-r1@gmail.com' });
      const user = await User.findOne({ account });
      await account.remove();
      await user.remove();
    });

    test('should not create a account because already exists', async () => {
      const account = await Account
        .from({
          email: 't1@gmail.com',
          password: 'test',
          type: 'TYPE_RECRUITER',
        }).save();

      let err;

      try {
        await post(server, {
          url: '/api/v1/general/recruiter',
          body: {
            recruiter: {
              email: 't1@gmail.com',
              password: 'test',
              first_name: 'Patt updated',
              last_name: 'Rik update',
            },
          },
          // headers: {
          //   ...getAuthorizationHeaders(data.authCode.access_token),
          // },
        });
      } catch (e) {
        err = e;
      }

      expect(err.statusCode).toBe(409);
      expect(err.error.error).toBe('already_exists');

      await account.remove();
    });

  });

  afterAll(async () => {
    await server.stop();
  });

});
