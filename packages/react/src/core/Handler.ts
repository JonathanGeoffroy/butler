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

export interface Request extends MockedRequest {
  mocked: boolean
}

export default class Handler {
  wrapper: RequestHandler | null
  requests: Request[]

  constructor(
    private onChange: () => void,
    private _method: RESTMethods,
    private _url: string
  ) {
    this.requests = []
  }

  get isActive() {
    return !!this.wrapper
  }

  get url() {
    return this._url
  }

  get method() {
    return this._method
  }

  enable(resolver?: ResponseResolver) {
    if (this.isActive) {
      return
    }

    this.wrapper = findResolver(this._method)(
      this._url,
      resolver || DEFAULT_RESOLVER
    )

    this.onChange()
  }

  disable() {
    if (!this.isActive) {
      return
    }

    this.wrapper = null
    this.onChange()
  }

  onRequestReceived(request: Request) {
    if (this.canHandle(request)) {
      this.requests.push(request)
      return true
    }
    return false
  }

  private canHandle(req: MockedRequest): boolean {
    return this._method.toString() === req.method && this._url === req.url.href
  }
}
