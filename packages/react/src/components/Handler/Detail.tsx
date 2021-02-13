import React, { useEffect, useState } from 'react'
import { RESTMethods } from 'msw'
import { Handler, UpdateValues, update } from '@butler/core'

// @ts-ignore
import styles from './Detail.scss'

interface Props {
  handler: Handler
  onClose: () => void
}

const toForm = (handler: Handler) => {
  return {
    url: handler.url,
    method: handler.method,
    response: '{}',
    enabled: handler.isActive
  }
}

export default function Detail({ handler, onClose }: Props) {
  const [form, setForm] = useState<UpdateValues>(toForm(handler))

  useEffect(() => {
    setForm(toForm(handler))
  }, [handler])

  const onSubmit = () => {
    update(Object.assign(handler, form))
  }

  const onHandleChange = (property: keyof UpdateValues) => (
    e: React.FormEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [property]: e.currentTarget.value
    })
  }

  return (
    <div className={styles.handlerDetail}>
      <form onSubmit={onSubmit}>
        <div className={styles.horizontal}>
          <label>Enabled</label>
          <input
            type='checkbox'
            checked={form?.enabled}
            onChange={onHandleChange('enabled')}
          />
        </div>
        <div className={styles.horizontal}>
          <label>Method</label>
          <select value={form?.method} onChange={onHandleChange('method')}>
            {Object.entries(RESTMethods).map(([key, value]) => (
              <option value={key}>{value}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Url</label>
          <input
            type='text'
            value={form?.url}
            onChange={onHandleChange('url')}
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
