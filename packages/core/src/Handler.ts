import { v4 as uuid } from 'uuid'
import {
  MockedRequest,
  RequestHandler,
  ResponseComposition,
  ResponseResolver,
  RestContext,
  RESTMethods
} from 'msw'
import { findResolver } from './utils/RESTResolver'

const DEFAULT_RESOLVER = (
  _: any,
  res: ResponseComposition<any>,
  ctx: RestContext
) => {
  return res(ctx.status(501, 'Butler: Mock Not Yet Implemented'))
}

export interface UpdateValues {
  method: RESTMethods
  url: string
  enabled: boolean
}

export interface Request extends MockedRequest {
  mocked: boolean
}

export default class Handler {
  wrapper: RequestHandler | null
  requests: Request[]

  public readonly id: string

  constructor(public method: RESTMethods, public url: string) {
    this.requests = []
    this.id = uuid()
    this.wrapper = null
  }

  get isActive() {
    return !!this.wrapper
  }

  asRequestHandler(): RequestHandler {
    if (!this.wrapper) {
      throw new Error()
    }
    return this.wrapper
  }

  enable(resolver?: ResponseResolver) {
    if (this.isActive) {
      return
    }

    const resolverFactory = findResolver(this.method)(
      this.url,
      DEFAULT_RESOLVER
    )
    this.wrapper = (resolverFactory as unknown) as RequestHandler
  }

  disable() {
    if (!this.isActive) {
      return
    }

    this.wrapper = null
  }

  equals(other: Handler) {
    return other.method === this.method && other.url === this.url
  }

  update(values: UpdateValues) {
    this.method = values.method
    this.url = values.url

    values.enabled ? this.enable() : this.disable()
  }

  onRequestReceived(request: Request) {
    if (this.canHandle(request)) {
      this.requests.push(request)
      return true
    }
    return false
  }

  private canHandle(req: MockedRequest): boolean {
    return this.method.toString() === req.method && this.url === req.url.href
  }
}
