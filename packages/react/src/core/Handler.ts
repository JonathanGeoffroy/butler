import {
  MockedRequest,
  RequestHandler,
  ResponseComposition,
  ResponseResolver,
  rest,
  RestContext,
  RESTMethods
} from 'msw'

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

  constructor(private _method: RESTMethods, private _url: string) {
    this.requests = []
  }

  private static findResolver(method: RESTMethods): any {
    switch (method) {
      case RESTMethods.DELETE:
        return rest.delete
      case RESTMethods.GET:
        return rest.get
      case RESTMethods.HEAD:
        return rest.head
      case RESTMethods.OPTIONS:
        return rest.options
      case RESTMethods.PATCH:
        return rest.patch
      case RESTMethods.POST:
        return rest.post
      case RESTMethods.PUT:
        return rest.put
      default:
        throw Error(`No handler found for method: ${method}`)
    }
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

    this.wrapper = Handler.findResolver(this._method)(
      this._url,
      resolver || DEFAULT_RESOLVER
    )
  }

  disable() {
    if (!this.isActive) {
      return
    }

    this.wrapper = null
  }

  canHandle(req: MockedRequest): boolean {
    return this._method.toString() === req.method && this._url === req.url.href
  }
}
