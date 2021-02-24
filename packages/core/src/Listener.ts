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
import Handler, { Headers } from './Handler'
import { handleRequest, handleResponse } from './Manager'
import { subscribe } from './Dispatcher'

export interface Request extends MockedRequest {
  mocked: boolean
}

export interface Worker {
  worker: SetupWorkerApi
  start: (options?: StartOptions) => void
  stop: () => void
}

async function handleWorkerResponse(response: Response, requestId: string) {
  const body = await response.json()

  const headers: Headers = {}
  response.headers.forEach((value, key) => {
    headers[key] = value
  })

  handleResponse(
    {
      statusCode: response.status,
      body,
      headers
    },

    requestId
  )
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

  worker.on('response:mocked', handleWorkerResponse)
  worker.on('response:bypass', handleWorkerResponse)

  subscribe(resetHandlers)

  function resetHandlers(handlers: Handler[]) {
    worker.resetHandlers(
      ...handlers
        .filter((item) => item.isActive)
        .map((item) => item.asRequestHandler())
    )
  }

  return {
    start: () => worker.start(),
    stop: () => worker.stop(),
    worker
  }
}
