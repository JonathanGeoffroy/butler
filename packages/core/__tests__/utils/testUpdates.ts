import { Handler, HandlerDTO } from '../../src'

export function testUpdates(updates: HandlerDTO, handler: Handler) {
  expect(handler.url).toStrictEqual(updates.url)
  expect(handler.method).toStrictEqual(updates.method)
  expect(handler.response).toStrictEqual({
    body: updates.body,
    statusCode: updates.statusCode,
    headers: updates.headers
  })
  expect(handler.isActive).toBe(!!updates.enabled)
}
