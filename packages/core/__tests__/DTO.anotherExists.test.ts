import { RESTMethods } from 'msw'
import { HandlerDTO, validate } from '../src'

jest.mock('../src/Manager', () => {
  return {
    anotherExists: jest.fn().mockReturnValue(true)
  }
})

it('find another exists handler', () => {
  const dto: HandlerDTO = {
    body: '{"some": "json"}',
    enabled: true,
    method: RESTMethods.PATCH,
    statusCode: 303,
    url: 'https://www/hello-world.com',
    headers: {
      'x-butler': 'test'
    }
  }

  expect(validate(dto)).toStrictEqual({
    anotherExists: 'Another handler for this request already exists'
  })
})
