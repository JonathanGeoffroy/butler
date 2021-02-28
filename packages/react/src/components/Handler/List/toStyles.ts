import { RESTMethods } from 'msw'
import styles from './index.module.scss'

export default function toStyle(method: RESTMethods) {
  switch (method) {
    case RESTMethods.DELETE:
      return styles.delete
    case RESTMethods.GET:
      return styles.get
    case RESTMethods.HEAD:
      return styles.head
    case RESTMethods.OPTIONS:
      return styles.options
    case RESTMethods.PATCH:
      return styles.patch
    case RESTMethods.POST:
      return styles.post
    case RESTMethods.PUT:
      return styles.put
    default:
      throw Error(`Unable to find style for ${method}`)
  }
}
