import { RESTMethods } from 'msw'
import { isMainThread } from 'worker_threads'
import { HandlerDTO, validate } from '../src'

it('validates all fields', () => {
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
  expect(validate(dto)).toBeNull()
})

it('find url error', () => {
  const dto: HandlerDTO = {
    body: '{"some": "json"}',
    enabled: true,
    method: RESTMethods.HEAD,
    statusCode: 303,
    url: 'wrong-url',
    headers: {
      'x-butler': 'test'
    }
  }
  expect(validate(dto)).toStrictEqual({
    url: 'Please enter a valid URL'
  })
})

it('accepts any string as body when content-type is not set', () => {
  const dto: HandlerDTO = {
    body: 'non-JSON body',
    enabled: true,
    method: RESTMethods.HEAD,
    statusCode: 303,
    url: 'https://www/hello-world.com',
    headers: {
      'x-butler': 'test'
    }
  }

  expect(validate(dto)).toBeNull()
})

it('accepts any string as body when content-type is text', () => {
  const dto: HandlerDTO = {
    body: 'non-JSON body',
    enabled: true,
    method: RESTMethods.HEAD,
    statusCode: 303,
    url: 'https://www/hello-world.com',
    headers: {
      'content-type': 'text/plain'
    }
  }

  expect(validate(dto)).toBeNull()
})

it('finds body error when content-type is JSON', () => {
  const dto: HandlerDTO = {
    body: 'non-JSON body',
    enabled: true,
    method: RESTMethods.HEAD,
    statusCode: 303,
    url: 'https://www/hello-world.com',
    headers: {
      '  ConTent-Type   ': 'application/json ; charset=utf-8',
      'x-butler': 'test'
    }
  }

  expect(validate(dto)).toStrictEqual({
    body: 'Please enter a valid JSON'
  })
})

it('find status code error', () => {
  const dto: HandlerDTO = {
    body: '{"some": "json"}',
    enabled: true,
    method: RESTMethods.PATCH,
    statusCode: 0,
    url: 'https://www/hello-world.com',
    headers: {
      'x-butler': 'test'
    }
  }

  expect(validate(dto)).toStrictEqual({
    statusCode: 'Please enter a valid status code'
  })
})
