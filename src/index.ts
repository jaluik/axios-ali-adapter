import { AxiosAdapter, AxiosError } from 'axios';
import { methodProcessor, dataProcessor, urlProcessor } from './utils';

const AliAdapter: AxiosAdapter = (config) => {
  return new Promise((resolve, reject) => {
    const request = () =>
      my.request({
        url: urlProcessor(
          config.baseURL,
          config.url,
          config.params,
          config.paramsSerializer
        ),
        data: dataProcessor(config.data),
        method: methodProcessor(config.method),
        timeout: 1000,
        success: (res) => {
          const response = {
            data: res.data,
            status: res.status,
            statusText: 'request ok',
            headers: res.headers,
            config: config,
            request,
          };
          resolve(response);
        },
        fail: (res) => {
          const error = new Error(res.errMsg) as AxiosError;
          error.config = config;
          error.request = request;
          error.isAxiosError = true;
          reject(error);
        },
      });
    request();
  });
};

export default AliAdapter;
