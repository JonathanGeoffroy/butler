import setupWorker, { Handler } from '../src'
import { notify } from '../src/Dispatcher'

enum RESTMethods {
  HEAD = 'HEAD',
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
  DELETE = 'DELETE'
}

jest.mock('../src/utils/RESTResolver', () => {
  return {
    findRequestHandlerFactory: () => jest.fn
  }
})

jest.mock('msw', () => {
  return {
    setupWorker: jest.fn().mockImplementation(() => {
      return {
        resetHandlers: jest.fn(),
        on: jest.fn()
      }
    })
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  jest.resetAllMocks()
})

it('listen handlers changes', () => {
  const worker = setupWorker()

  const handlers = [
    new Handler(RESTMethods.GET, 'http://www.first-url.com'),
    new Handler(RESTMethods.POST, 'http://www.second-url.com'),
    new Handler(RESTMethods.PUT, 'http://www.third-url.com')
  ]
  handlers[1].enable()
  notify(handlers)
  expect(worker.worker.resetHandlers).toHaveBeenCalledTimes(1)
  expect(worker.worker.resetHandlers).toHaveBeenCalledWith(handlers[1].wrapper)

  handlers[0].enable()
  handlers[1].disable()
  handlers[2].enable()
  notify(handlers)
  expect(worker.worker.resetHandlers).toHaveBeenCalledTimes(2)
  expect(worker.worker.resetHandlers).toHaveBeenCalledWith(
    handlers[0].wrapper,
    handlers[2].wrapper
  )
})
