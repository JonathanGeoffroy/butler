import { v4 as uuid } from 'uuid'
import {
  MockedRequest,
  RequestHandler,
  ResponseComposition,
  RestContext,
  RESTMethods
} from 'msw'
import { findRequestHandlerFactory } from './utils/RESTResolver'
import { HandlerDTO } from './DTO'

const DEFAULT_RESOLVER = (
  _: any,
  res: ResponseComposition<any>,
  ctx: RestContext
) => {
  return res(ctx.status(501, 'Butler: Mock Not Yet Implemented'))
}

export interface Request extends MockedRequest {
  mocked: boolean
  response?: MockedResponse
}

export type Headers = Record<string, string>

export interface MockedResponse {
  statusCode: number
  body: any
  headers?: Headers
}

export default class Handler {
  wrapper: RequestHandler<MockedRequest, any> | null
  requests: Request[]

  public readonly id: string

  constructor(
    public method: RESTMethods,
    public url: string,
    public response?: MockedResponse,
    enabled: boolean = false
  ) {
    this.requests = []
    this.id = uuid()
    this.wrapper = null

    if (enabled) {
      this.doEnable()
    }
  }

  get isActive() {
    return !!this.wrapper
  }

  asRequestHandler(): RequestHandler<MockedRequest, any> {
    if (!this.wrapper) {
      throw new Error()
    }
    return this.wrapper
  }

  enable() {
    if (this.isActive) {
      return
    }

    this.doEnable()
  }

  private doEnable() {
    const currentResponse = this.response
    const resolver = currentResponse
      ? (_: any, res: ResponseComposition<any>, ctx: RestContext) => {
          return res(
            ctx.status(currentResponse.statusCode),
            ctx.body(currentResponse.body),
            ctx.set(currentResponse.headers || {})
          )
        }
      : DEFAULT_RESOLVER

    this.wrapper = findRequestHandlerFactory(this.method)(this.url, resolver)
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

  update(values: HandlerDTO) {
    this.method = values.method
    this.url = values.url

    this.response = {
      statusCode: values.statusCode,
      body: values.body,
      headers: values.headers
    }

    values.enabled ? this.doEnable() : this.disable()
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
