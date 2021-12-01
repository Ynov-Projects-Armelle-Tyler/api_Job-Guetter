import {
  Account,
  Company,
  Recruiter,
} from '@job-guetter/api-core/models';
import General from '@job-guetter/api-general';
import { generateEmail, generateId } from '../../utils/defaults';
import {
  mockAccount,
  mockData,
  mockServer,
  mockToken,
} from '../../utils/mocks';
import {
  get,
  getAuthorizationHeaders,
  post,
  put,
  remove,
  patch,
} from '../../utils/request';

jest.mock('node-fetch', () => jest.fn());

describe('@job-guetter/api-general/Company', () => {
  let service, server, app;

  beforeAll(async () => {
    service = await mockServer(General, { returnOnlyServer: false });
    server = service.server;
    app = service.app;
  });

  describe('POST /general/company', () => {

    test('should create a company account', async () => {
      const name = generateId();
      const email = generateEmail();

      const res = await post(server, {
        url: '/api/v1/general/company',
        body: {
          company: {
            name,
            activity_area: 'agriculture',
          },
          password: 'company1',
          email,
        },
      });

      expect(res.created).toBe(true);

      const account = await Account.findOne({ email });
      const company = await Company.findOne({ account });
      await account.remove();
      await company.remove();
    });

    test('should not create a account because already exists', async () => {
      const account = await mockAccount('TYPE_COMPANY');

      let err;

      try {
        await post(server, {
          url: '/api/v1/general/company',
          body: {
            company: {
              name: generateId(),
              activity_area: 'agriculture',
            },
            email: account.email,
            password: 'test',
          },
        });
      } catch (e) {
        err = e;
      }

      expect(err.statusCode).toBe(409);
      expect(err.error.error).toBe('already_exists');

      await account.clean();
    });

  });

  describe('GET /general/company/siren/:sirene', () => {

    test('should patch to true recruiter status', async () => {
      app.set('Sirene_API', { get: () => ({ content: {} }) });

      const spy = jest.spyOn(app.get('Sirene_API'), 'get');

      const res = await get(server, {
        url: '/api/v1/general/company/sirene/123',
      });

      expect(spy).toBeCalled();
      expect(res.content).toBeDefined();

      spy.mockRestore();
    });

    test('should return company_not_found_by_siren', async () => {
      app.set('Sirene_API', { get: () => {} });
      const spy = jest.spyOn(app.get('Sirene_API'), 'get');

      let err;

      try {
        await get(server, {
          url: '/api/v1/general/company/sirene/123',
        });
      } catch (e) {
        err = e;
      }

      expect(spy).toBeCalled();
      expect(err.error.error).toBe('company_not_found_by_siren');

      spy.mockRestore();
    });

  });

  describe('GET /general/company/:id', () => {

    test('should get company infos', async () => {
      const data = await mockAccount('TYPE_COMPANY');
      const token = await mockToken(data);

      const res = await get(server, {
        url: `/api/v1/general/company/${data.company._id}`,
        headers: {
          ...getAuthorizationHeaders(token.access_token),
        },
      });

      expect(res.company).toBeDefined();
      expect(res.company.account.email).toBe(data.email);

      await data.clean();
    });

    test('should return authorization error', async () => {
      let err;

      const data = await mockAccount('TYPE_COMPANY');
      const token = await mockToken(data);

      try {
        await get(server, {
          url: '/api/v1/general/company/618123a4ee0ccc859ac25800',
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

    test('should return wrong company id', async () => {
      let err;

      const data = await mockAccount('TYPE_COMPANY');
      const token = await mockToken(data);

      const test = await mockData('TYPE_COMPANY');
      await test.clean();

      try {
        await get(server, {
          url: '/api/v1/general/company/123',
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

  describe('GET /general/company', () => {

    test('should get all company', async () => {
      const c1 = await mockAccount('TYPE_COMPANY');
      const c2 = await mockAccount('TYPE_COMPANY');

      const res = await get(server, {
        url: '/api/v1/general/company',
      });

      expect(res.companies).toBeDefined();
      // expect(res.companies.length).toBe(2);

      await c1.clean();
      await c2.clean();
    });

  });

  describe('GET /general/company/:id/recruiters', () => {

    test('should get all recruiter linked with company', async () => {
      const c1 = await mockAccount('TYPE_COMPANY');
      const token = await mockToken(c1);
      const r1 = await mockAccount('TYPE_RECRUITER');
      const rec = await Recruiter.from({
        user: r1.user,
        company: c1.company,
        status: true,
      }).save();

      const res = await get(server, {
        url: `/api/v1/general/company/${c1.company._id}/recruiters`,
        headers: {
          ...getAuthorizationHeaders(token.access_token),
        },
      });

      expect(res.recruiters).toBeDefined();
      expect(res.recruiters.length).toBe(1);

      await c1.clean();
      await r1.clean();
      await Recruiter.findOne({ _id: rec._id }).remove();
    });

  });

  describe('PUT /general/company/:id', () => {

    test('should update company', async () => {
      const data = await mockAccount('TYPE_COMPANY');
      const token = await mockToken(data);
      const email = generateEmail();

      const res = await put(server, {
        url: `/api/v1/general/company/${data.company._id}/`,
        body: {
          company: {
            name: generateId(),
          },
          email,
          password: generateId(),
        },
        headers: {
          ...getAuthorizationHeaders(token.access_token),
        },
      });

      expect(res.company).toBeDefined();
      expect(res.company.account.email).toBe(email);

      await data.clean();
    });

    test('should udpate company with same email', async () => {
      const data = await mockAccount('TYPE_COMPANY');
      const token = await mockToken(data);
      const email = data.account.email;

      const res = await put(server, {
        url: `/api/v1/general/company/${data.company._id}/`,
        body: {
          company: {
            name: generateId(),
          },
          email,
          password: generateId(),
        },
        headers: {
          ...getAuthorizationHeaders(token.access_token),
        },
      });

      expect(res.company).toBeDefined();
      expect(res.company.account.email).toBe(email);

      await data.clean();
    });

    test('should return already_exists', async () => {
      const c1 = await mockAccount('TYPE_COMPANY');
      const c2 = await mockAccount('TYPE_COMPANY');
      const token = await mockToken(c1);
      const email = c2.account.email;

      let err;

      try {
        await put(server, {
          url: `/api/v1/general/company/${c1.company._id}/`,
          body: {
            company: {
              name: generateId(),
            },
            email,
            password: generateId(),
          },
          headers: {
            ...getAuthorizationHeaders(token.access_token),
          },
        });
      } catch (e) {
        err = e;
      }

      expect(err.statusCode).toBe(409);
      expect(err.error.error).toBe('already_exists');

      await c1.clean();
      await c2.clean();
    });

  });

  describe('DELETE /general/company/:id', () => {

    test('should remove company account', async () => {
      const comp = await mockAccount('TYPE_COMPANY');
      const token = await mockToken(comp);
      const user = await mockAccount('TYPE_RECRUITER');
      const rec = await Recruiter.from({
        user: user.user,
        company: comp.company,
        status: true,
      }).save();

      const spy = jest.spyOn(app.get('Sendgrid'), 'send');

      const res = await remove(server, {
        url: `/api/v1/general/company/${comp.company._id}`,
        headers: {
          ...getAuthorizationHeaders(token.access_token),
        },
      });

      const _rec = await Recruiter.findOne({ _id: rec._id });

      expect(spy).toBeCalled();
      expect(res.deleted).toBe(true);
      expect(_rec).toBe(null);

      spy.mockRestore();
      await comp.clean();
      await user.clean();
      await _rec?.remove();
    });

  });

  describe('PATCH /general/company/:id/recruiter/:recruiter_id', () => {

    test('should patch to false recruiter status', async () => {
      const comp = await mockAccount('TYPE_COMPANY');
      const token = await mockToken(comp);
      const user = await mockAccount('TYPE_RECRUITER');
      const rec = await Recruiter.from({
        user: user.user,
        company: comp.company,
        status: true,
      }).save();

      // const spy = jest.spyOn(app.get('Sendgrid'), 'send');

      const res = await patch(server, {
        url: `/api/v1/general/company/${comp.company._id}/recruiter/${rec._id}`,
        body: {
          accept: false,
        },
        headers: {
          ...getAuthorizationHeaders(token.access_token),
        },
      });

      const _rec = await Recruiter.findOne({ _id: rec._id });

      // expect(spy).toBeCalled();
      expect(res.deleted).toBe(true);
      expect(_rec).toBe(null);

      // spy.mockRestore();
      await comp.clean();
      await user.clean();
      await _rec?.remove();
    });

    test('should patch to true recruiter status', async () => {
      const comp = await mockAccount('TYPE_COMPANY');
      const token = await mockToken(comp);
      const user = await mockAccount('TYPE_RECRUITER');
      const rec = await Recruiter.from({
        user: user.user,
        company: comp.company,
        status: false,
      }).save();

      // const spy = jest.spyOn(app.get('Sendgrid'), 'sned');

      const res = await patch(server, {
        url: `/api/v1/general/company/${comp.company._id}/recruiter/${rec._id}`,
        body: {
          accept: true,
        },
        headers: {
          ...getAuthorizationHeaders(token.access_token),
        },
      });

      const _rec = await Recruiter.findOne({ _id: rec._id });

      // expect(spy).toBeCalled();
      expect(res.accepted).toBe(true);

      // spy.mockRestore();
      await comp.clean();
      await user.clean();
      await _rec?.remove();
    });

  });

  afterAll(async () => {
    await server.stop();
  });

});
