import { RESTMethods } from 'msw'
import { notify } from './Dispatcher'
import Handler, { MockedResponse, Request } from './Handler'
import { HandlerDTO, UpdateHandlerDTO, validate, validateOrThrow } from './DTO'

export const handlers: Handler[] = []

export function create(dto: HandlerDTO) {
  validateOrThrow(dto)
  const handler = new Handler(
    dto.method,
    dto.url,
    {
      body: dto.body,
      statusCode: dto.statusCode,
      headers: dto.headers
    },
    dto.enabled
  )

  handlers.push(handler)
  notify(handlers)

  return handler
}

export function update(dto: UpdateHandlerDTO) {
  validateOrThrow(dto)
  const index = findIndexById(dto.id)

  if (index >= 0) {
    const handler = handlers[index]
    handler.update(dto)
    notify(handlers)
  }

  return handlers[index]
}

export function remove(id: string) {
  const index = findIndexById(id)
  if (index >= 0) {
    handlers[index].disable()
    handlers.splice(index, 1)
    notify(handlers)
  }
}

export function enable(handler: Handler) {
  handler.enable()
  notify(handlers)
}

export function disable(handler: Handler) {
  handler.disable()
  notify(handlers)
}

export function anotherExists(handler: Handler) {
  return handlers.find((item) => item.id !== handler.id && item.equals(handler))
}

export function handleRequest(request: Request) {
  const someoneCatch = handlers.find((handler) =>
    handler.onRequestReceived(request)
  )

  if (!someoneCatch) {
    const handler = new Handler(
      // @ts-ignore
      RESTMethods[request.method],
      request.url.href
    )
    handler.onRequestReceived(request)
    handlers.push(handler)
  }

  notify(handlers)
}

export function handleResponse(response: MockedResponse, reqId: string) {
  let handler: Handler | null = null
  let request: Request | null = null

  for (let h of handlers) {
    let req = h.requests.find((r) => r.id === reqId)
    if (!!req) {
      request = req
      handler = h
      break
    }
  }

  if (!(handler && request)) {
    throw new Error('Request was not handled')
  }

  request.response = response
  if (!handler.response) {
    handler.response = { ...response }
  }

  notify(handlers)
}

function findIndexById(id: string) {
  return handlers.findIndex((item) => {
    return item.id === id
  })
}
