import React from 'react'
import { RESTMethods } from 'msw'
import Handler from '../../core/Handler'

// @ts-ignore
import styles from './List.scss'

function toStyle(method: RESTMethods) {
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
interface Props {
  handlers: Handler[]
  onSelectHandler: (handler: Handler) => void
}

export default function List({ handlers, onSelectHandler }: Props) {
  const onHandleChange = (handler: Handler) => {
    handler.isActive ? handler.disable() : handler.enable()
  }

  return (
    <table className={styles.handlerList}>
      <thead>
        <tr>
          <th>Enabled?</th>
          <th>Method</th>
          <th>Url</th>
          <th>#calls</th>
        </tr>
      </thead>
      <tbody>
        {handlers.map((handler) => (
          <tr key={handler.url} onClick={() => onSelectHandler(handler)}>
            <td className={styles.centered}>
              <input
                type='checkbox'
                checked={handler.isActive}
                onChange={() => onHandleChange(handler)}
              />
            </td>
            <td className={styles.centered}>
              <span className={`${styles.method} ${toStyle(handler.method)}`}>
                {handler.method}
              </span>
            </td>
            <td className={styles.url}>{handler.url}</td>
            <td>{handler.requests.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
