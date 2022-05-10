import { AxiosAdapter, AxiosError } from 'axios';
import {
  methodProcessor,
  dataProcessor,
  urlProcessor,
  headerProcessor,
  successResProcessor,
  dataTypeProcessor,
  failResProcessor,
} from './utils';

const AliAdapter: AxiosAdapter = (config) => {
  return new Promise((resolve, reject) => {
    const request = () =>
      (my.request || my.httpRequest)({
        url: urlProcessor(
          config.baseURL,
          config.url,
          config.params,
          config.paramsSerializer
        ),
        headers: headerProcessor(config.headers),
        data: dataProcessor(config.data),
        method: methodProcessor(config.method),
        dataType: dataTypeProcessor(config.responseType),
        timeout: config.timeout,
        success: (res) => {
          successResProcessor(resolve, reject, res, config, request);
        },
        fail: (res) => {
          /** error === 19是http错误，为了保持和微信以及web一致， 4XX和5XX不认为是错误
           * 这种请求交由axios的statusValidate处理
           */
          if (res.error === 19) {
            successResProcessor(resolve, reject, res, config, request);
            return;
          }
          failResProcessor(reject, res, config, request);
        },
      });
    request();
  });
};

export default AliAdapter;
