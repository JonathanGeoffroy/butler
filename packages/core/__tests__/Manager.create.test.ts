import { RESTMethods } from 'msw'
import { Handler, subscribe } from '../src'
import { AnotherExistsHandlerError } from '../src/errors/AnotherExistsHandlerError'
import { MockedResponse } from '../src/Handler'
import { handlers, create } from '../src/Manager'

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

    const handler = new Handler(RESTMethods.GET, 'http://test.com')
    create(handler)

    expect(handlers).toHaveLength(1)

    const actual = handlers[0]
    expect(actual).toEqual({ ...handler })
    expect(actual.response).toBeUndefined()
    expect(actual.isActive).toBeFalsy()

    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenCalledWith([handler])
  })

  it('adds second handler (differs by URL)', () => {
    expect(handlers).toHaveLength(0)
    const first = create(new Handler(RESTMethods.GET, 'http://test.com'))

    const subscriber = jest.fn()
    subscribe(subscriber)

    const response: MockedResponse = {
      body: { mocked: true },
      statusCode: 201
    }

    const second = create(
      new Handler(RESTMethods.GET, 'http://second.com', response)
    )

    const actual = handlers[1]
    expect(actual).toStrictEqual(second)
    expect(actual.isActive).toBeFalsy()

    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenCalledWith([first, second])
  })

  it('adds second handler (differs by Method)', () => {
    const first = create(new Handler(RESTMethods.GET, 'http://test.com'))

    const subscriber = jest.fn()
    subscribe(subscriber)

    const second = create(new Handler(RESTMethods.POST, 'http://test.com'))

    const actual = handlers[1]
    expect(actual).toStrictEqual(second)
    expect(actual.isActive).toBeFalsy()

    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenCalledWith([first, second])
  })

  it('refuses to add the same handler twice', () => {
    create(new Handler(RESTMethods.GET, 'http://test.com'))

    const subscriber = jest.fn()
    subscribe(subscriber)

    expect(() =>
      create(new Handler(RESTMethods.GET, 'http://test.com'))
    ).toThrow(AnotherExistsHandlerError)

    expect(handlers).toHaveLength(1)

    expect(subscriber).not.toHaveBeenCalled()
  })
})
