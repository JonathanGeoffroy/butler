import { RESTMethods } from 'msw'
import { Handler, subscribe } from '../src'
import { handlers, UpdateHandlerDTO, update } from '../src'
import { InvalidDTOError } from '../src/errors/InvalidDTOError'
import { testUpdates } from './utils/testUpdates'

describe('update', () => {
  beforeEach(() => {
    handlers.splice(0, handlers.length)
  })
  afterEach(() => {
    handlers.splice(0, handlers.length)
  })

  it('updates handler (unique handler)', () => {
    const created = new Handler(RESTMethods.GET, 'http://test.com')
    handlers.push(created)

    const subscriber = jest.fn()
    subscribe(subscriber)

    const updates: UpdateHandlerDTO = {
      url: 'http://update.com',
      method: RESTMethods.POST,
      body: '{"mocked": "yeah"}',
      enabled: true,
      id: created.id,
      statusCode: 201,
      headers: {
        some: 'header'
      }
    }

    const actual = update(updates)
    expect(handlers).toHaveLength(1)
    expect(handlers[0]).toBe(actual)

    testUpdates(updates, actual)

    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenCalledWith([actual])
  })

  it('updates handler (multiple handlers)', () => {
    const first = new Handler(RESTMethods.GET, 'http://first.com')
    const second = new Handler(RESTMethods.POST, 'http://second.com')
    const third = new Handler(RESTMethods.GET, 'http://third.com')
    handlers.push(first, second, third)

    const subscriber = jest.fn()
    subscribe(subscriber)

    const updates: UpdateHandlerDTO = {
      id: second.id,
      url: 'http://update.com',
      method: RESTMethods.POST,
      body: '{"mocked": "yeah"}',
      enabled: true,
      statusCode: 404,
      headers: {
        'x-header-test': 'butler'
      }
    }

    const actual = update(updates)
    expect(handlers).toHaveLength(3)
    expect(handlers[1]).toBe(actual)

    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenCalledWith([first, actual, third])
  })

  it("doesn't update handler that doesn't exist", () => {
    const created = new Handler(RESTMethods.GET, 'http://test.com')
    handlers.push(created)

    const subscriber = jest.fn()
    subscribe(subscriber)

    const updates: UpdateHandlerDTO = {
      url: 'http://update.com',
      method: RESTMethods.POST,
      body: '{}',
      enabled: true,
      id: 'unknown-id',
      statusCode: 201
    }

    const actual = update(updates)
    expect(actual).toBeUndefined()
    expect(handlers).toHaveLength(1)
    expect(handlers[0]).toBe(created)

    expect(subscriber).not.toHaveBeenCalled()
  })

  it('updates a handler event without changing request', () => {
    const handler = new Handler(RESTMethods.PUT, 'http://already-exists.com')
    handlers.push(handler)

    const subscriber = jest.fn()
    subscribe(subscriber)

    const updates: UpdateHandlerDTO = {
      id: handler.id,
      url: 'http://already-exists.com',
      method: RESTMethods.PUT,
      body: '{}',
      enabled: false,
      statusCode: 201
    }

    const actual = update(updates)
    testUpdates(updates, actual)
    expect(handlers).toStrictEqual([handler])

    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenCalledWith([handler])
  })

  it('refuses to update a handler if another already exists', () => {
    const first = new Handler(RESTMethods.PUT, 'http://already-exists.com')
    handlers.push(first)
    const second = new Handler(RESTMethods.GET, 'http://another.com')
    handlers.push(second)

    const subscriber = jest.fn()
    subscribe(subscriber)

    const updates: UpdateHandlerDTO = {
      url: 'http://already-exists.com',
      method: RESTMethods.PUT,
      body: {},
      enabled: true,
      id: second.id,
      statusCode: 201
    }

    expect(() => update(updates)).toThrowError(InvalidDTOError)
    expect(handlers).toStrictEqual([first, second])

    expect(subscriber).not.toHaveBeenCalled()
  })
})
