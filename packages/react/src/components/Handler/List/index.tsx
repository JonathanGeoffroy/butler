import React from 'react'
import toStyle from './toStyles'
import { Handler } from '@butler/core'

import styles from './index.module.scss'

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
                  onClick={(e) => e.stopPropagation()}
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
