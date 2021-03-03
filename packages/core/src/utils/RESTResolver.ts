import { ParsedRestRequest, rest, RestContext, RESTMethods } from 'msw'
import { Mask } from 'msw/lib/types/setupWorker/glossary'
import {
  DefaultRequestBodyType,
  MockedRequest,
  RequestHandler,
  RequestParams,
  ResponseResolver
} from 'msw/lib/types/utils/handlers/requestHandler'

type ResponseFactory<T> = (
  mask: Mask,
  resolver: ResponseResolver<
    MockedRequest<DefaultRequestBodyType, RequestParams>,
    RestContext,
    T
  >
) => RequestHandler<
  MockedRequest<DefaultRequestBodyType, RequestParams>,
  RestContext,
  ParsedRestRequest,
  MockedRequest<T, RequestParams>,
  T
>

export function findRequestHandlerFactory(
  method: RESTMethods
): // eslint-disable-next-line
ResponseFactory<any> {
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
