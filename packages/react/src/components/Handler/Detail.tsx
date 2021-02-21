import React, { useEffect, useState } from 'react'
import { RESTMethods } from 'msw'
import { Handler, update, UpdateHandlerDTO } from '@butler/core'

// @ts-ignore
import styles from './Detail.scss'

interface Props {
  handler: Handler
  onClose: () => void
}

const toForm = (handler: Handler): UpdateHandlerDTO => {
  return {
    id: handler.id,
    url: handler.url,
    method: handler.method,
    statusCode: handler.response?.statusCode || 200,
    body: handler.response ? JSON.stringify(handler.response.body) : '',
    enabled: handler.isActive
  }
}

export default function Detail({ handler, onClose }: Props) {
  const [form, setForm] = useState<UpdateHandlerDTO>(() => toForm(handler))

  useEffect(() => {
    setForm(toForm(handler))
  }, [handler])

  const onSubmit = () => {
    update({
      ...form,
      body: JSON.parse(form.body)
    })
  }

  const onHandleChange = (property: keyof UpdateHandlerDTO) => (value: any) => {
    setForm({
      ...form,
      [property]: value
    })
  }

  return (
    <div className={styles.handlerDetail}>
      <form onSubmit={onSubmit}>
        <div className={styles.horizontal}>
          <label>Enabled</label>
          <input
            type='checkbox'
            checked={form.enabled}
            onChange={() => onHandleChange('enabled')(!form.enabled)}
          />
        </div>
        <div className={styles.horizontal}>
          <label>Method</label>
          <select
            value={form.method}
            onChange={(e) => onHandleChange('method')(e.currentTarget.value)}
          >
            {Object.entries(RESTMethods).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Url</label>
          <input
            type='text'
            value={form.url}
            onChange={(e) => onHandleChange('url')(e.currentTarget.value)}
          />
        </div>

        <div>
          <label>Status</label>
          <input
            type='number'
            value={form.statusCode}
            onChange={(e) =>
              onHandleChange('statusCode')(e.currentTarget.value)
            }
          />
        </div>

        <div>
          <label>Response</label>
          <textarea
            style={{ width: '100%' }}
            rows={8}
            value={form.body}
            onChange={(e) => onHandleChange('body')(e.currentTarget.value)}
          />
        </div>
      </form>

      <button type='submit' onClick={onSubmit}>
        Update
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  )
}
