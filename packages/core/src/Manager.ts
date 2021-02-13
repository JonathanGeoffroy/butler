import { RESTMethods } from 'msw'
import { notify } from './Dispatcher'
import { AnotherExistsHandlerError } from './errors/AnotherExistsHandlerError'
import Handler, { Request } from './Handler'

export const handlers: Handler[] = []

export function create(handler: Handler) {
  if (anotherExists(handler)) {
    throw new AnotherExistsHandlerError()
  }
  handlers.push(handler)
  notify(handlers)
  return handler
}

export function update(handler: Handler) {
  if (anotherExists(handler)) {
    throw new AnotherExistsHandlerError()
  }
  const index = findIndexById(handler.id)
  if (index >= 0) {
    handlers[index] = handler
    notify(handlers)
  }

  return handler
}

export function remove(id: string) {
  const index = findIndexById(id)
  if (index >= 0) {
    handlers.splice(index, 1)
    notify(handlers)
  }
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

function findIndexById(id: string) {
  return handlers.findIndex((item) => item.id === id)
}
