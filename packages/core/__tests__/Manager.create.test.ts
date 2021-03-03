import { RESTMethods } from 'msw'
import { Handler, HandlerDTO, subscribe } from '../src'
import { InvalidDTOError } from '../src/errors/InvalidDTOError'
import { MockedResponse } from '../src/Handler'
import { handlers, create } from '../src/Manager'
import { testUpdates } from './utils/testUpdates'

describe('create', () => {
  beforeEach(() => {
    handlers.splice(0, handlers.length)
  })
  afterEach(() => {
    handlers.splice(0, handlers.length)
  })

  it('adds first handler', () => {
    const subscriber = jest.fn()
    subscribe(subscriber)

    const dto: HandlerDTO = {
      enabled: false,
      method: RESTMethods.GET,
      url: 'http://test.com',
      body: '{"some": "body"}',
      statusCode: 201
    }

    const handler = create(dto)

    expect(handlers).toHaveLength(1)

    const actual = handlers[0]
    testUpdates(dto, actual)
    expect(actual.requests).toStrictEqual([])
    expect(actual.isActive).toBeFalsy()

    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenCalledWith([handler])
  })

  it('adds second handler (differs by URL)', () => {
    expect(handlers).toHaveLength(0)
    const firstHandler = new Handler(RESTMethods.GET, 'http://test.com')
    handlers.push(firstHandler)

    const subscriber = jest.fn()
    subscribe(subscriber)

    const dto: HandlerDTO = {
      enabled: false,
      method: RESTMethods.GET,
      url: 'http://second.com',
      body: '{ "mocked": true }',
      statusCode: 201
    }
    const secondHandler = create(dto)
    const actual = handlers[1]
    testUpdates(dto, actual)

    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenCalledWith([firstHandler, secondHandler])
  })

  it('adds second handler (differs by Method)', () => {
    const firstHandler = new Handler(RESTMethods.GET, 'http://test.com')
    handlers.push(firstHandler)
    const subscriber = jest.fn()
    subscribe(subscriber)

    const dto: HandlerDTO = {
      enabled: false,
      method: RESTMethods.POST,
      url: 'http://test.com',
      body: '{ "mocked": true }',
      statusCode: 201,
      headers: { some: 'headers' }
    }
    const secondHandler = create(dto)

    const actual = handlers[1]
    testUpdates(dto, actual)
    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenCalledWith([firstHandler, secondHandler])
  })

  it('enables created handler', () => {
    const dto: HandlerDTO = {
      enabled: true,
      method: RESTMethods.GET,
      url: 'http://test.com',
      body: '{ "mocked": true }',
      statusCode: 201
    }

    const handler = create(dto)
    testUpdates(dto, handler)
  })

  it('refuses to add the same handler twice', () => {
    handlers.push(new Handler(RESTMethods.GET, 'http://test.com'))

    const subscriber = jest.fn()
    subscribe(subscriber)

    const dto: HandlerDTO = {
      enabled: false,
      method: RESTMethods.GET,
      url: 'http://test.com',
      body: '{ "mocked": true }',
      statusCode: 201
    }

    expect(() => create(dto)).toThrow(InvalidDTOError)
    expect(handlers).toHaveLength(1)
    expect(subscriber).not.toHaveBeenCalled()
  })
})
