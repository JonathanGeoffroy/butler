import setupWorker from '../src'
import { handleRequest, handleResponse } from '../src/Manager'
import { createRequest, createResponse } from './utils/createRequest'

let eventsMap: Record<string, Function> = {}
const sendEvent = (event: string, ...args: any[]) => {
  eventsMap[event](...args)
}

jest.mock('msw', () => {
  return {
    setupWorker: jest.fn().mockImplementation(() => {
      return {
        on: (event: string, cb: Function) => {
          eventsMap[event] = cb
        }
      }
    })
  }
})

jest.mock('../src/Manager')

afterEach(() => {
  jest.clearAllMocks()
  eventsMap = {}
})

afterAll(() => {
  jest.resetAllMocks()
})

it('Listen to unhandled request', () => {
  setupWorker()
  const request = createRequest('DELETE', 'https://some-url.lu')

  sendEvent('request:unhandled', request)

  expect(handleRequest).toHaveBeenCalledTimes(1)
  expect(handleRequest).toHaveBeenCalledWith({
    ...request,
    mocked: false
  })
})

it('Listen to handle request', () => {
  setupWorker()
  const request = createRequest('DELETE', 'https://some-url.lu')

  sendEvent('request:match', request)

  expect(handleRequest).toHaveBeenCalledTimes(1)
  expect(handleRequest).toHaveBeenCalledWith({
    ...request,
    mocked: true
  })
})

it('Listen to bypassed response', async () => {
  setupWorker()
  const body = `{"mocked": "testing"}`
  const headers = {
    some: 'headers'
  }
  const response = createResponse(201, body, headers)

  const requestId = 'requestId'
  await sendEvent('response:bypass', response, requestId)

  expect(handleResponse).toHaveBeenCalledTimes(1)
  expect(handleResponse).toHaveBeenCalledWith(
    {
      body: {
        mocked: 'testing'
      },
      statusCode: 201,
      headers: {
        some: 'headers'
      }
    },
    requestId
  )
})

it('Listen to mocked response', async () => {
  setupWorker()
  const body = `{"mocked": "testing"}`
  const headers = {
    some: 'headers'
  }
  const response = createResponse(201, body, headers)

  const requestId = 'requestId'
  await sendEvent('response:mocked', response, requestId)

  expect(handleResponse).toHaveBeenCalledTimes(1)
  expect(handleResponse).toHaveBeenCalledWith(
    {
      body: {
        mocked: 'testing'
      },
      statusCode: 201,
      headers: {
        some: 'headers'
      }
    },
    requestId
  )
})
