import { RESTMethods } from 'msw'
import { notify } from './Dispatcher'
import { AnotherExistsHandlerError } from './errors/AnotherExistsHandlerError'
import Handler, { MockedResponse, Request, UpdateValues } from './Handler'

export const handlers: Handler[] = []

export interface UpdateHandlerDTO extends UpdateValues {
  id: string
}

export function create(handler: Handler) {
  if (anotherExists(handler)) {
    throw new AnotherExistsHandlerError()
  }
  handlers.push(handler)
  notify(handlers)
  return handler
}

export function update(values: UpdateHandlerDTO) {
  const index = findIndexById(values.id)

  if (index >= 0) {
    const handler = handlers[index]
    const dryHandler = Object.assign({}, handler, {
      id: values.id,
      url: values.url,
      method: values.method
    })
    if (anotherExists(dryHandler)) {
      throw new AnotherExistsHandlerError()
    }

    handler.update(values)
    notify(handlers)
  }

  return handlers[index]
}

export function remove(id: string) {
  const index = findIndexById(id)
  if (index >= 0) {
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
    const handler = create(
      new Handler(
        //@ts-ignore
        RESTMethods[request.method],
        request.url.href
      )
    )
    handler.onRequestReceived(request)
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
    handler.response = {
      statusCode: response.statusCode,
      body: response.body
    }
  }

  notify(handlers)
}

function findIndexById(id: string) {
  return handlers.findIndex((item) => item.id === id)
}
