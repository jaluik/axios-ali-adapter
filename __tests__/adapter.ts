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
});
