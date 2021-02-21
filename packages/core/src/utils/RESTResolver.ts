import { rest, RESTMethods } from 'msw'

export function findRequestHandlerFactory(method: RESTMethods) {
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
