import aliAdapter from '../src/index';
import axios from 'axios';

axios.defaults.adapter = aliAdapter;
const mockrequest = jest.fn();

describe('test adapter', () => {
  beforeAll(() => {
    (global as any).my = {
      request: mockrequest,
    };
  });

  it('should delete referer in header', (done) => {
    axios.get('www.url.com', {
      headers: {
        Accept: 'application/json, text/plain, */*',
        a: 1,
        referer: 'ali referer',
      },
    });
    mockrequest.mockImplementation(({ headers, success }) => {
      expect(headers).toEqual({
        Accept: 'application/json, text/plain, */*',
        a: 1,
      });
      success({
        data: 1,
        status: 200,
      });
      done();
    });
  });

  it('my.request can return right result', () => {
    const promise = axios.get('www.url.com');
    mockrequest.mockImplementation(({ success }) => {
      success({
        data: 1,
        status: 200,
      });
    });
    return expect(promise).resolves.toMatchObject({
      data: 1,
      status: 200,
    });
  });

  it('my.request can return error result', () => {
    const promise = axios.get('www.url.com');
    mockrequest.mockImplementation(({ fail }) => {
      fail({
        errMsg: '请求失败',
      });
    });
    return expect(promise).rejects.toThrowError('请求失败');
  });

  it('my.request can return resolved result when status can be tested true by axios.validateStatus', () => {
    const promise = axios.get('www.url.com');
    mockrequest.mockImplementation(({ fail }) => {
      fail({
        data: 1,
        error: 19,
        status: 200,
      });
    });
    return expect(promise).resolves.toMatchObject({
      data: 1,
      status: 200,
    });
  });
  it('my.request can return rejected result when status cannot be tested true by axios.validateStatus', () => {
    const promise = axios.get('www.url.com');
    mockrequest.mockImplementation(({ fail }) => {
      fail({
        data: 1,
        error: 19,
        status: 401,
        errorMessage: 'http error',
      });
    });
    return expect(promise).rejects.toThrowError(
      'Request failed with status code 401'
    );
  });
});
