import { MockedRequest, RESTMethods, setupWorker as setupMswWorker } from 'msw'
import {
  RequestHandlersList,
  SetupWorkerApi,
  StartOptions
} from 'msw/lib/types/setupWorker/glossary'
import Handler from './Handler'

export interface Request extends MockedRequest {
  mocked: boolean
}

export type RequestListener = (handlers: Handler[]) => void

export interface Worker {
  worker: SetupWorkerApi
  start: (options?: StartOptions) => void
  stop: () => void
  enable: (handler: Handler) => void
  disable: (handler: Handler) => void
  onChange: (lister: RequestListener) => void
}

export default function setupWorker(
  ...requestHandlers: RequestHandlersList
): Worker {
  const handlers: Handler[] = []

  const worker = setupMswWorker(...requestHandlers)

  const listeners: RequestListener[] = []

  const onChange = (listener: RequestListener) => {
    listeners.push(listener)

    return () => {
      const index = listeners.indexOf(listener)
      if (index >= 0) {
        listeners.splice(index, 1)
      }
    }
  }

  const onRequest = () => {
    for (const listener of listeners) {
      listener(handlers)
    }
  }

  const enable = (handler: Handler) => {
    handler.enable()
    if (handler.wrapper) {
      worker.use(...[handler.wrapper])
    }

    onRequest()
  }

  const disable = (handler: Handler) => {
    handler.disable()
    if (!handler.wrapper) {
      // @ts-ignore
      const enabledHandlers: RequestHandlersList = handlers
        .filter((h) => !!h.wrapper)
        .map((h) => h.wrapper)

      worker.resetHandlers(...enabledHandlers)
    }
    onRequest()
  }

  const findMatchingHandler = (req: MockedRequest): Handler | null => {
    return handlers.find((handler) => handler.canHandle(req)) || null
  }

  worker.on('request:match', (req: MockedRequest) => {
    const handler = findMatchingHandler(req)
    if (handler) {
      handler.requests.push({ ...req, mocked: true })
    }
    debugger
    onRequest()
  })

  worker.on('request:unhandled', (req) => {
    let handler = findMatchingHandler(req)
    if (!handler) {
      handler = new Handler(RESTMethods[req.method], req.url.href)
      handlers.push(handler)
    }

    handler.requests.push({ ...req, mocked: false })
    onRequest()
  })

  return {
    start: () => worker.start(),
    stop: () => worker.stop(),
    enable,
    disable,
    onChange,
    worker
  }
}
