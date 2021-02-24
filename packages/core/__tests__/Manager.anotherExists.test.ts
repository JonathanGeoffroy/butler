import { RESTMethods } from 'msw'
import { anotherExists, Handler, handlers } from '../src'

describe('anotherExists', () => {
  beforeAll(() => {
    handlers.splice(0, handlers.length)
    handlers.push(
      new Handler(RESTMethods.GET, 'http://www.first-url.com'),
      new Handler(RESTMethods.POST, 'http://www.second-url.com'),
      new Handler(RESTMethods.PUT, 'http://www.third-url.com')
    )
  })

  afterAll(() => {
    handlers.splice(0, handlers.length)
  })

  it('distinguish handler by url', () => {
    expect(
      anotherExists(new Handler(RESTMethods.GET, 'http://another-url.fr'))
    ).toBeFalsy()
  })

  it('distinguish handler by method', () => {
    expect(
      anotherExists(new Handler(RESTMethods.POST, 'http://www.first-url.com'))
    ).toBeFalsy()
  })

  it('find handler', () => {
    expect(
      anotherExists(new Handler(RESTMethods.POST, 'http://www.second-url.com'))
    ).toBeTruthy()
  })
})
