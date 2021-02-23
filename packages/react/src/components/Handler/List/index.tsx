import React from 'react'
import { RESTMethods } from 'msw'
import { Handler } from '@butler/core'

// @ts-ignore
import styles from './index.scss'

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
  selectedHandler: Handler | null
  onSelectHandler: (handler: Handler) => void
  onEnableChange: (handler: Handler, enabled: boolean) => void
}

export default function List({
  handlers,
  selectedHandler,
  onSelectHandler,
  onEnableChange
}: Props) {
  return (
    <div className={styles.handlerList}>
      <table>
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
            <tr
              key={handler.url}
              className={handler === selectedHandler ? styles.selected : ''}
              onClick={() => onSelectHandler(handler)}
            >
              <td className={styles.centered}>
                <input
                  type='checkbox'
                  checked={handler.isActive}
                  onChange={() => onEnableChange(handler, !handler.isActive)}
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
    </div>
  )
}
