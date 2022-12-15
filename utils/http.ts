import { storage } from './storage';

interface HttpOptions {
  method?: string;
  headers?: any;
  body?: any;
  [x: string]: any;
}

const apiBaseUrl = 'https://www.referralmaker.com/services/mobileapi';

export async function httpBase(endpoint: string, { body, ...customConfig }: HttpOptions = {}) {
  const sessionToken = await storage.getItem('sessionToken');
  // console.log(sessionToken);
  const larryToken = '56B6DEC45D864875820ECB094377E191';

  const headers = {
    'content-type': 'application/json',
    Authorization: 'YWNzOmh0dHBzOi8vcmVmZXJyYWxtYWtlci1jYWNoZS5hY2Nlc3Njb250cm9sLndpbmRvd',
    SessionToken: sessionToken,
    Cookie: 'ASP.NET_SessionId=m4eeiuwkwetxz2uzcjqj2x1a',
  };
  const config: HttpOptions = {
    method: customConfig.method,
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };
  if (body) {
    config.body = JSON.stringify(body);
    console.log('CONFIGBODY: ' + config.body);
  }
  return fetch(`${apiBaseUrl}/${endpoint}`, config).then(async (response) => {
    if (response.ok) {
      console.log('response is ok');
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        return await response.json();
      } else {
        return await response.text();
      }
    } else {
      //const errorResponse = await response;
      return Promise.reject('Status code: ' + response.status);
    }
  });
}

function httpGet(endpoint: string, { ...config }: HttpOptions = {}) {
  return httpBase(endpoint, { method: 'GET', ...config });
}

function httpPut(endpoint: string, { ...config }: HttpOptions = {}) {
  return httpBase(endpoint, { method: 'PUT', ...config });
}

function httpDelete(endpoint: string, { ...config }: HttpOptions = {}) {
  return httpBase(endpoint, { method: 'DELETE', ...config });
}

function httpPost(endpoint: string, { ...config }: HttpOptions = {}) {
  return httpBase(endpoint, { method: 'POST', ...config });
}

export const http = {
  get: httpGet,
  put: httpPut,
  delete: httpDelete,
  post: httpPost,
};
