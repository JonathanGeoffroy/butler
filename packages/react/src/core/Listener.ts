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
  onChange: (lister: RequestListener) => void
}

export default function setupWorker(
  ...requestHandlers: RequestHandlersList
): Worker {
  const handlers: Handler[] = []

  const worker = setupMswWorker(...requestHandlers)

  const listeners: RequestListener[] = []

  const subsribe = (listener: RequestListener) => {
    listeners.push(listener)

    return () => {
      const index = listeners.indexOf(listener)
      if (index >= 0) {
        listeners.splice(index, 1)
      }
    }
  }

  const onChange = () => {
    for (const listener of listeners) {
      listener(handlers)
    }
  }

  const onHandlerChange = () => {
    // @ts-ignore
    const enabledHandlers: RequestHandlersList = handlers
      .filter((h) => !!h.wrapper)
      .map((h) => h.wrapper)

    worker.resetHandlers(...enabledHandlers)

    onChange()
  }

  const handleRequest = (req: Request) => {
    const someoneCatchReq = !!handlers.find((h) => h.onRequestReceived(req))

    if (!someoneCatchReq) {
      const handler = new Handler(
        onHandlerChange,
        RESTMethods[req.method],
        req.url.href
      )
      handlers.push(handler)
      handler.onRequestReceived(req)
    }

    onChange()
  }

  worker.on('request:match', (req: MockedRequest) =>
    handleRequest({ ...req, mocked: true })
  )

  worker.on('request:unhandled', (req) =>
    handleRequest({ ...req, mocked: false })
  )

  return {
    start: () => worker.start(),
    stop: () => worker.stop(),
    onChange: subsribe,
    worker
  }
}
