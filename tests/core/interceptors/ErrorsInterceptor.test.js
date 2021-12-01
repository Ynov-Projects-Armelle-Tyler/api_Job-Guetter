import colors from 'colors/safe';
import sinon from 'sinon';

import { BadRequest } from '@job-guetter/api-core/utils/errors';
import { ErrorsInterceptor } from '@job-guetter/api-core/interceptors';

import { mockReq, mockRes } from '../../utils/mocks';

/* eslint-disable no-console */
describe('@job-guetter/api-core/interceptors/ErrorsInterceptor', () => {
  const consoleError = console.error;

  beforeAll(() => {
    console.error = () => {};
  });

  test('should generate an ErrorsInterceptor named middleware', () => {
    expect(ErrorsInterceptor.name).toBe('ErrorsInterceptor');
  });

  test('should return an error stack when called with an Error object', () => {
    const res = { ...mockRes(), send: sinon.spy() };
    const error = new Error();

    ErrorsInterceptor(error, mockReq(), res);
    expect(res.send.calledWith(`<pre>${error.stack}</pre>`)).toBe(true);
  });

  test('should return an error message when called with a custom ServerError ' +
    'object', () => {
    const mockedRes = mockRes();
    const res = {
      ...mockedRes,
      json: sinon.spy(mockedRes.json),
      status: sinon.spy(mockedRes.status),
    };
    const error = BadRequest('wrong_user_id');

    ErrorsInterceptor(error, mockReq(), res);
    expect(res.status.calledWith(400)).toBe(true);
    expect(
      res.json.calledWith(sinon.match.has('error', 'wrong_user_id'))
    ).toBe(true);
  });

  test('should handle process errors as well as server errors', () => {
    const error = new Error();
    console.error = sinon.spy();
    ErrorsInterceptor(error);
    expect(console.error.calledWith(colors.red(error))).toBe(true);
  });

  afterAll(() => {
    console.error = consoleError;
  });

});
