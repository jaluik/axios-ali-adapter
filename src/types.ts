export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

declare namespace my {
  interface IHttpRequestSuccessResult {
    /**
     * 响应数据，格式取决于请求时的 dataType 参数
     */
    readonly data?: any;

    /**
     * 响应码
     *
     * - 1：{error: 1, message: "not implemented!"} 请求没有结束，就跳转到了另一个页面。
     * - 2：参数错误。
     * - 11：无权跨域
     * - 12：网络出错
     * - 13：超时
     * - 14：解码失败
     * - 15：小程序页面传参如果做urlencode需要把整体参数进行编码。
     * - 19：HTTP错误。
     * - 20：请求已被停止/服务端限流
     * - 23：代理请求失败。
     */
    readonly status?: 1 | 2 | 11 | 12 | 13 | 14 | 15 | 19 | 20 | 23;

    /**
     * 响应头
     */
    readonly headers?: Readonly<Record<string, string>>;
  }

  /**
   * 返回 RequestTask，可以调用 abort 方法取消请求
   */
  interface IRequestTask extends Promise<IHttpRequestSuccessResult> {
    abort: () => void;
  }

  interface IHttpRequestOptions {
    /**
     * 目标服务器url
     */
    url: string;

    /**
     * 设置请求的 HTTP 头，默认 {'content-type': 'application/json'}
     */
    headers?: Record<string, string>;

    /**
     * 默认GET，目前支持GET/POST
     */
    method?: RequestMethod;

    /**
     * 请求参数。
     *
     * 传给服务器的数据最终会是 String 类型，如果 data 不是 String 类型，会被转换成 String 。转换规则如下：
     * - 若方法为GET，会将数据转换成 query string： encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...
     * - 若方法为 POST 且 headers['content-type'] 为 application/json ，会对数据进行 JSON 序列化
     * - 若方法为 POST 且 headers['content-type'] 为 application/x-www-form-urlencoded ，会将数据转换成 query string： encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...
     */
    data?: Record<string, any>;

    /**
     * 超时时间，单位ms，默认30000
     */
    timeout?: number;

    /**
     * 期望返回的数据格式，默认json，支持json，text，base64
     */
    dataType?: 'json' | 'text' | 'base64';

    /**
     * 调用成功的回调函数
     */
    success?(res: IHttpRequestSuccessResult): void;

    /**
     * 调用失败的回调函数
     */
    fail?(res: any): void;

    /**
     * 调用结束的回调函数（调用成功、失败都会执行）
     */
    complete?(res: any): void;
  }
}

declare global {
  const my: {
    request: (options: my.IHttpRequestOptions) => my.IRequestTask;
  };
}
