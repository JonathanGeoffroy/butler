import {
  MockedRequest,
  ResponseResolver,
  setupWorker as setupMswWorker
} from 'msw'
import { SetupWorkerApi } from 'msw'
import {
  RequestHandlersList,
  StartOptions
} from 'msw/lib/types/setupWorker/glossary'
import { notify } from './Dispatcher'
import Handler from './Handler'
import { handleRequest, handlers } from './Manager'

export interface Request extends MockedRequest {
  mocked: boolean
}

export interface Worker {
  worker: SetupWorkerApi
  start: (options?: StartOptions) => void
  enable: (handler: Handler, resolver?: ResponseResolver) => void
  disable: (handler: Handler) => void
  stop: () => void
}

export default function setupWorker(
  ...requestHandlers: RequestHandlersList
): Worker {
  const worker = setupMswWorker(...requestHandlers)

  worker.on('request:match', (req: MockedRequest) =>
    handleRequest({ ...req, mocked: true })
  )

  worker.on('request:unhandled', (req) =>
    handleRequest({ ...req, mocked: false })
  )

  function enable(handler: Handler, resolver?: ResponseResolver) {
    handler.enable(resolver) // FIXME call Manager instead ? (update notification)
    resetHandlers()
    notify(handlers)
  }

  function disable(handler: Handler) {
    handler.disable() // FIXME call Manager instead ? (update notification)
    resetHandlers()
    notify(handlers)
  }

  function resetHandlers() {
    worker.resetHandlers(
      ...handlers
        .filter((item) => item.isActive)
        .map((item) => item.asRequestHandler())
    )
  }

  return {
    start: () => worker.start(),
    stop: () => worker.stop(),
    enable,
    disable,
    worker
  }
}
