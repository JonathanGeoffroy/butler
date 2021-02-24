import { RESTMethods } from 'msw/lib/types'
import {
  DefaultRequestBodyType,
  MockedRequest
} from 'msw/lib/types/utils/handlers/requestHandler'
import { URL } from 'url'
import { v4 as uuid } from 'uuid'
import { Request } from '../../src/Handler'

export function createRequest(
  method: RESTMethods | string,
  url: string,
  body?: DefaultRequestBodyType
): MockedRequest {
  return {
    id: uuid(),
    url: new URL(url),
    method: method.toString(),
    // @ts-ignore
    headers: {},
    cookies: {},
    mode: 'same-origin',
    keepalive: false,
    cache: 'default',
    destination: '',
    integrity: 'integrity',
    credentials: 'same-origin',
    redirect: 'manual',
    referrer: 'butler',
    referrerPolicy: '',
    body,
    bodyUsed: !!body
  }
}

export function createMockedRequest(
  method: RESTMethods,
  url: string,
  mocked: boolean,
  body?: DefaultRequestBodyType
): Request {
  return {
    ...createRequest(method, url, body),
    mocked
  }
}

export function createResponse(
  status: number,
  body: any,
  headers?: Record<string, string>
) {
  return {
    json: function () {
      return JSON.parse(body)
    },
    status,
    headers: {
      forEach: function (cb: Function) {
        Object.entries(headers || {}).forEach(([key, value]) => cb(value, key))
      }
    }
  }
}
