import { RESTMethods } from 'msw'
import { Handler, handlers, remove, subscribe } from '../src'

describe('remove', () => {
  beforeEach(() => {
    handlers.splice(0, handlers.length)
  })
  afterEach(() => {
    handlers.splice(0, handlers.length)
  })

  it('deletes handler', () => {
    const subscriber = jest.fn()
    subscribe(subscriber)

    handlers.push(
      new Handler(RESTMethods.GET, 'http://www.first-url.com'),
      new Handler(RESTMethods.POST, 'http://www.second-url.com'),
      new Handler(RESTMethods.PUT, 'http://www.third-url.com')
    )

    const toDelete = handlers[1]
    remove(toDelete.id)
    expect(handlers).toHaveLength(2)
    expect(handlers).not.toContain(toDelete)

    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenCalledWith(handlers)
  })

  it('disables deleted handler', () => {
    const subscriber = jest.fn()
    subscribe(subscriber)

    handlers.push(
      new Handler(RESTMethods.GET, 'http://www.first-url.com'),
      new Handler(RESTMethods.POST, 'http://www.second-url.com'),
      new Handler(RESTMethods.PUT, 'http://www.third-url.com')
    )

    const toDelete = handlers[2]
    toDelete.enable()
    expect(toDelete.isActive).toBeTruthy()

    remove(toDelete.id)
    expect(handlers).toHaveLength(2)
    expect(handlers).not.toContain(toDelete)
    expect(toDelete.isActive).toBeFalsy()

    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenCalledWith(handlers)
  })

  it("doesn't do anithing if handler doesn't exist", () => {
    const subscriber = jest.fn()
    subscribe(subscriber)

    handlers.push(
      new Handler(RESTMethods.GET, 'http://www.first-url.com'),
      new Handler(RESTMethods.POST, 'http://www.second-url.com'),
      new Handler(RESTMethods.PUT, 'http://www.third-url.com')
    )

    remove('unknown-id')

    expect(handlers).toHaveLength(3)
    expect(subscriber).not.toHaveBeenCalled()
  })
})
