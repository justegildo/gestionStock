import axios from "axios";
import { url as apiUrl } from '../baseUrls/functions';

export class AuthenticationService {

    token() {
        return window.localStorage.getItem('token');
    }
    
    getAndReturn() {
        return axios.get('assets/demo/data/countries.json')
            .then(res => res.data.data);
    }

    get(id) {
        //${id} send for path params
        return axios.get(apiUrl(`/test1/${id}`), {
            //query params(?ID=12345)
            params : {
                ID: 12345
            },
            // headears
            headers : {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.token(),
            },
            responseType: 'json',
        })
        .then(response => {
            // handle success
            console.log(response);
            console.log(response.data);
            console.log(response.status);
            console.log(response.statusText);
            console.log(response.headers);
            console.log(response.config);
        })
        .catch(error => {
            // handle error
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
            console.log(error.toJSON());
        })
        .then(()=> {
            // always executed
        });

        /* Using the validateStatus config option, you can define HTTP code(s) that should throw an error.

        axios.get('/user/12345', {
            validateStatus: function (status) {
              return status < 500; // Resolve only if the status code is less than 500
            }
        })
        */
    }

    post(data) {
        // data is a json object that will be the post request body
        return axios.post(apiUrl('/test2'), data, {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.token(),
        }).then(response => {
            console.log(response);
        })
    }

    formUrlEncoding() {
        // 1
        const params = new URLSearchParams();
        params.append('param1', 'value1');
        params.append('param2', 'value2');
        axios.post('/foo', params);
        // 2
        const qs = require('qs');
        axios.post('/foo', qs.stringify({ 'bar': 123 }));
        // 3
        //import qs from 'qs';
        const data = { 'bar': 123 };
        const options = {
        method: 'POST',
        headers: { 
            'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
            url,
        };
        axios(options);
        // 4. nodejs
        const querystring = require('querystring');
        axios.post('http://something.com/', querystring.stringify({ foo: 'bar' }));
        // 5. nodejs
        const url = require('url');
        const params2 = new url.URLSearchParams({ foo: 'bar' });
        axios.post('http://something.com/', params2.toString());
    }
    
    formData() {
        const FormData = require('form-data');
        
        const form = new FormData();
        form.append('my_field', 'my value');
        form.append('my_buffer', new Buffer(10));
        form.append('my_file', fs.createReadStream('/foo/bar.jpg'));

        axios.post('https://example.com', form, { headers: form.getHeaders() })
    }

    formDataUsingInterceptor() {
        axios.interceptors.request.use(config => {
            if (config.data instanceof FormData) {
              Object.assign(config.headers, config.data.getHeaders());
            }
            return config;
          });
    }
    
    response = {
        // `data` is the response that was provided by the server
        data: {},
      
        // `status` is the HTTP status code from the server response
        status: 200,
      
        // `statusText` is the HTTP status message from the server response
        // As of HTTP/2 status text is blank or unsupported.
        // (HTTP/2 RFC: https://www.rfc-editor.org/rfc/rfc7540#section-8.1.2.4)
        statusText: 'OK',
      
        // `headers` the HTTP headers that the server responded with
        // All header names are lower cased and can be accessed using the bracket notation.
        // Example: `response.headers['content-type']`
        headers: {},
      
        // `config` is the config that was provided to `axios` for the request
        config: {},
      
        // `request` is the request that generated this response
        // It is the last ClientRequest instance in node.js (in redirects)
        // and an XMLHttpRequest instance in the browser
        request: {}
    }

    requestConfig = {
        // `url` is the server URL that will be used for the request
        url: '/user',
      
        // `method` is the request method to be used when making the request
        method: 'get', // default
      
        // `baseURL` will be prepended to `url` unless `url` is absolute.
        // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
        // to methods of that instance.
        baseURL: 'https://some-domain.com/api',
      
        // `transformRequest` allows changes to the request data before it is sent to the server
        // This is only applicable for request methods 'PUT', 'POST', 'PATCH' and 'DELETE'
        // The last function in the array must return a string or an instance of Buffer, ArrayBuffer,
        // FormData or Stream
        // You may modify the headers object.
        transformRequest: [function (data, headers) {
          // Do whatever you want to transform the data
      
          return data;
        }],
      
        // `transformResponse` allows changes to the response data to be made before
        // it is passed to then/catch
        transformResponse: [function (data) {
          // Do whatever you want to transform the data
      
          return data;
        }],
      
        // `headers` are custom headers to be sent
        headers: {'X-Requested-With': 'XMLHttpRequest'},
      
        // `params` are the URL parameters to be sent with the request
        // Must be a plain object or a URLSearchParams object
        // NOTE: params that are null or undefined are not rendered in the URL.
        params: {
          ID: 12345
        },
      
        // `paramsSerializer` is an optional function in charge of serializing `params`
        // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
        paramsSerializer: function (params) {
          return Qs.stringify(params, {arrayFormat: 'brackets'})
        },
      
        // `data` is the data to be sent as the request body
        // Only applicable for request methods 'PUT', 'POST', 'DELETE', and 'PATCH'
        // When no `transformRequest` is set, must be of one of the following types:
        // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
        // - Browser only: FormData, File, Blob
        // - Node only: Stream, Buffer
        data: {
          firstName: 'Fred'
        },
        
        // syntax alternative to send data into the body
        // method post
        // only the value is sent, not the key
        data: 'Country=Brasil&City=Belo Horizonte',
      
        // `timeout` specifies the number of milliseconds before the request times out.
        // If the request takes longer than `timeout`, the request will be aborted.
        timeout: 1000, // default is `0` (no timeout)
      
        // `withCredentials` indicates whether or not cross-site Access-Control requests
        // should be made using credentials
        withCredentials: false, // default
      
        // `adapter` allows custom handling of requests which makes testing easier.
        // Return a promise and supply a valid response (see lib/adapters/README.md).
        adapter: function (config) {
          /* ... */
        },
      
        // `auth` indicates that HTTP Basic auth should be used, and supplies credentials.
        // This will set an `Authorization` header, overwriting any existing
        // `Authorization` custom headers you have set using `headers`.
        // Please note that only HTTP Basic auth is configurable through this parameter.
        // For Bearer tokens and such, use `Authorization` custom headers instead.
        auth: {
          username: 'janedoe',
          password: 's00pers3cret'
        },
      
        // `responseType` indicates the type of data that the server will respond with
        // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
        //   browser only: 'blob'
        responseType: 'json', // default
      
        // `responseEncoding` indicates encoding to use for decoding responses (Node.js only)
        // Note: Ignored for `responseType` of 'stream' or client-side requests
        responseEncoding: 'utf8', // default
      
        // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
        xsrfCookieName: 'XSRF-TOKEN', // default
      
        // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
        xsrfHeaderName: 'X-XSRF-TOKEN', // default
      
        // `onUploadProgress` allows handling of progress events for uploads
        // browser only
        onUploadProgress: function (progressEvent) {
          // Do whatever you want with the native progress event
        },
      
        // `onDownloadProgress` allows handling of progress events for downloads
        // browser only
        onDownloadProgress: function (progressEvent) {
          // Do whatever you want with the native progress event
        },
      
        // `maxContentLength` defines the max size of the http response content in bytes allowed in node.js
        maxContentLength: 2000,
      
        // `maxBodyLength` (Node only option) defines the max size of the http request content in bytes allowed
        maxBodyLength: 2000,
      
        // `validateStatus` defines whether to resolve or reject the promise for a given
        // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
        // or `undefined`), the promise will be resolved; otherwise, the promise will be
        // rejected.
        validateStatus: function (status) {
          return status >= 200 && status < 300; // default
        },
      
        // `maxRedirects` defines the maximum number of redirects to follow in node.js.
        // If set to 0, no redirects will be followed.
        maxRedirects: 5, // default
      
        // `socketPath` defines a UNIX Socket to be used in node.js.
        // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
        // Only either `socketPath` or `proxy` can be specified.
        // If both are specified, `socketPath` is used.
        socketPath: null, // default
      
        // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
        // and https requests, respectively, in node.js. This allows options to be added like
        // `keepAlive` that are not enabled by default.
        httpAgent: new http.Agent({ keepAlive: true }),
        httpsAgent: new https.Agent({ keepAlive: true }),
      
        // `proxy` defines the hostname, port, and protocol of the proxy server.
        // You can also define your proxy using the conventional `http_proxy` and
        // `https_proxy` environment variables. If you are using environment variables
        // for your proxy configuration, you can also define a `no_proxy` environment
        // variable as a comma-separated list of domains that should not be proxied.
        // Use `false` to disable proxies, ignoring environment variables.
        // `auth` indicates that HTTP Basic auth should be used to connect to the proxy, and
        // supplies credentials.
        // This will set an `Proxy-Authorization` header, overwriting any existing
        // `Proxy-Authorization` custom headers you have set using `headers`.
        // If the proxy server uses HTTPS, then you must set the protocol to `https`. 
        proxy: {
          protocol: 'https',
          host: '127.0.0.1',
          port: 9000,
          auth: {
            username: 'mikeymike',
            password: 'rapunz3l'
          }
        },
      
        // `cancelToken` specifies a cancel token that can be used to cancel the request
        // (see Cancellation section below for details)
        cancelToken: new CancelToken(function (cancel) {
        }),
      
        // `decompress` indicates whether or not the response body should be decompressed 
        // automatically. If set to `true` will also remove the 'content-encoding' header 
        // from the responses objects of all decompressed responses
        // - Node only (XHR cannot turn off decompression)
        decompress: true // default
      
    }

    intercept() {
        // Add a request interceptor
        axios.interceptors.request.use(function (config) {
            // Do something before request is sent
            return config;
        }, function (error) {
            // Do something with request error
            return Promise.reject(error);
        });

        // Add a response interceptor
        axios.interceptors.response.use(function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            return response;
        }, function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            return Promise.reject(error);
        });

        // If you need to remove an interceptor later you can.
        const myInterceptor = axios.interceptors.request.use(function () {/*...*/});
        axios.interceptors.request.eject(myInterceptor);

        // You can add interceptors to a custom instance of axios.
        const instance = axios.create();
        instance.interceptors.request.use(function () {/*...*/});

    }
    

    retryRequest() {
        function retryWrapper(axios, options) {
            const max_time = options.retry_time;
            const retry_status_code = options.retry_status_code;
            let counter = 0;
            axios.interceptors.response.use(null, (error) => {
                /** @type {import("axios").AxiosRequestConfig} */
                const config = error.config
                // you could defined status you want to retry, such as 503
                // if (counter < max_time && error.response.status === retry_status_code) {
                if (counter < max_time) {
                    counter++
                    return new Promise((resolve) => {
                        resolve(axios(config))
                    })
                }
                return Promise.reject(error)
            })
        }

        async function main () {
            retryWrapper(axios, {retry_time: 3})
            const result = await axios.get("https://api.ipify.org?format=json")
            console.log(result.data);
        }
    }

    abortRequest() {
        const controller = new AbortController();

        axios.get('/foo/bar', {
            signal: controller.signal
        })
        .then(function(response) {
        //...
        });
        // cancel the request
        controller.abort()
    }
    
}