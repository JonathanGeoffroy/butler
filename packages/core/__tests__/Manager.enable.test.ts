import { RESTMethods } from 'msw'
import { disable, enable, Handler, handlers, subscribe } from '../src'

describe('enable', () => {
  beforeEach(() => {
    handlers.splice(0, handlers.length)
  })
  afterEach(() => {
    handlers.splice(0, handlers.length)
  })

  it('enables handler', () => {
    const subscriber = jest.fn()
    subscribe(subscriber)

    const handlerEnable = jest.fn()
    const handler = new Handler(RESTMethods.DELETE, 'some-url')
    handler.enable = handlerEnable
    handlers.push(handler)

    enable(handler)
    expect(handlerEnable).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenCalledWith([handler])
  })

  it('disables handler', () => {
    const subscriber = jest.fn()
    subscribe(subscriber)

    const handlerDisable = jest.fn()
    const handler = new Handler(RESTMethods.DELETE, 'some-url')
    handler.disable = handlerDisable
    handlers.push(handler)

    disable(handler)
    expect(handlerDisable).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenCalledWith([handler])
  })
})
