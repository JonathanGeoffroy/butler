import React, { useEffect, useState } from 'react'
import { RESTMethods } from 'msw'
import classnames from 'classnames'
import { anotherExists, Handler, update, UpdateHandlerDTO } from '@butler/core'
import Tabs, { Tab } from '../../lib/Tabs'
import Input from '../../lib/Input'
import isValidHttpUrl from '../../validators/httpUrl'
import isValidJSON from '../../validators/json'

// @ts-ignore
import styles from './Detail.scss'
import Textarea from '../../lib/Textarea'

interface Props {
  handler: Handler
  onClose: () => void
}

interface Errors {
  url?: string
  statusCode?: string
  body?: string
  anotherExists?: string
}
const checkForm = (form: UpdateHandlerDTO): Errors => {
  return {
    url: !isValidHttpUrl(form.url) ? 'Please enter a valid URL' : undefined,
    statusCode:
      form.statusCode <= 0 ? 'Please enter a valid status code' : undefined,
    body: !isValidJSON(form.body) ? 'Please enter a valid JSON' : undefined,
    anotherExists: anotherExists(
      Object.assign({}, new Handler(form.method, form.url), form)
    )
      ? 'Another handler for this request already exists'
      : undefined
  }
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

enum TABS {
  REQUEST,
  RESPONSE
}

export default function Detail({ handler, onClose }: Props) {
  const [tab, setTab] = useState<TABS>(TABS.REQUEST)
  const [form, setForm] = useState<UpdateHandlerDTO>(() => toForm(handler))
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (!Object.values(errors).find((v) => !!v)) {
      setForm(toForm(handler))
    }
  }, [handler])

  useEffect(() => {
    setErrors(checkForm(form))
  }, [form])

  const onSubmit = () => {
    debugger
    if (!Object.values(errors).find((v) => !!v)) {
      update({
        ...form,
        body: JSON.parse(form.body)
      })
    }
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
        <Tabs value={tab} onValueChange={setTab}>
          <Tab label='Request' value={TABS.REQUEST}>
            <div className={classnames(styles.row, styles.horizontal)}>
              <label>Enabled</label>
              <input
                type='checkbox'
                checked={form.enabled}
                onChange={() => onHandleChange('enabled')(!form.enabled)}
              />
            </div>
            <div className={classnames(styles.row, styles.horizontal)}>
              <label>Method</label>
              <select
                value={form.method}
                onChange={(e) =>
                  onHandleChange('method')(e.currentTarget.value)
                }
              >
                {Object.entries(RESTMethods).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className={classnames(styles.row, styles.horizontal)}>
              <label>Url</label>
              <Input
                type='text'
                value={form.url}
                onValueChange={onHandleChange('url')}
                error={errors.url || errors.anotherExists}
              />
            </div>
          </Tab>
          <Tab label='Response' value={TABS.RESPONSE}>
            <div className={classnames(styles.row, styles.horizontal)}>
              <label>Status</label>
              <Input
                type='number'
                value={form.statusCode}
                onValueChange={onHandleChange('statusCode')}
              />
            </div>

            <div className={styles.row}>
              <label>Response</label>
              <Textarea
                style={{ width: '100%' }}
                rows={8}
                value={form.body}
                onValueChange={onHandleChange('body')}
                error={errors.body}
              />
            </div>
          </Tab>
        </Tabs>
      </form>

      <button type='submit' onClick={onSubmit}>
        Update
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  )
}
