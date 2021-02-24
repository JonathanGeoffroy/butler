import { RESTMethods } from 'msw'

import { Handler } from '../src'
import { MockedResponse } from '../src/Handler'
import { handlers, handleRequest, handleResponse } from '../src/Manager'
import { createMockedRequest } from './utils/createRequest'

describe('handleRequest', () => {
  beforeEach(() => {
    handlers.splice(0, handlers.length)
    handlers.push(
      new Handler(RESTMethods.GET, 'http://www.first-url.com/'),
      new Handler(RESTMethods.POST, 'http://www.second-url.com/'),
      new Handler(RESTMethods.PUT, 'http://www.third-url.com/')
    )
  })
  afterEach(() => {
    handlers.splice(0, handlers.length)
  })

  it('handles request and response for handler', () => {
    const request = createMockedRequest(
      RESTMethods.GET,
      'http://www.first-url.com',
      false
    )
    handleRequest(request)

    expect(handlers).toHaveLength(3)
    expect(handlers[0].requests).toStrictEqual([request])
    expect(handlers[1].requests).toHaveLength(0)
    expect(handlers[2].requests).toHaveLength(0)

    const response: MockedResponse = {
      statusCode: 201,
      body: '{"some": "body"}'
    }

    handleResponse(response, request.id)
    expect(handlers).toHaveLength(3)
    expect(handlers[0].requests).toStrictEqual([
      {
        ...request,
        response
      }
    ])
    expect(handlers[1].requests).toHaveLength(0)
    expect(handlers[2].requests).toHaveLength(0)
  })

  it('creates new Handler for unhandled request', () => {
    const request = createMockedRequest(
      RESTMethods.GET,
      'http://www.unknown.com/',
      false
    )
    handleRequest(request)

    expect(handlers).toHaveLength(4)
    expect(handlers[0].requests).toHaveLength(0)
    expect(handlers[1].requests).toHaveLength(0)
    expect(handlers[2].requests).toHaveLength(0)
    expect(handlers[3]).toMatchObject({
      url: 'http://www.unknown.com/',
      method: RESTMethods.GET,
      isActive: false,
      requests: [request]
    })

    const response: MockedResponse = {
      statusCode: 201,
      body: '{"some": "body"}'
    }

    handleResponse(response, request.id)
    expect(handlers).toHaveLength(4)

    expect(handlers[0].requests).toHaveLength(0)
    expect(handlers[1].requests).toHaveLength(0)
    expect(handlers[2].requests).toHaveLength(0)
    expect(handlers[3].requests).toStrictEqual([
      {
        ...request,
        response
      }
    ])
    expect(handlers[1].requests).toHaveLength(0)
    expect(handlers[2].requests).toHaveLength(0)
  })
})
