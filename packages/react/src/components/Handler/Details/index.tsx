import React, { FormEvent, useState } from 'react'
import { anotherExists, Handler, update, UpdateHandlerDTO } from '@butler/core'
import Tabs, { Tab } from '../../../lib/Tabs'
import isValidHttpUrl from '../../../validators/httpUrl'
import isValidJSON from '../../../validators/json'
import useForm from '../../../hooks/useForm'
import { Errors } from './types'
import RequestForm from './RequestForm'
import ResponseForm from './ResponseForm'

// @ts-ignore
import styles from './index.scss'

export interface Props {
  handler: Handler
  onClose: () => void
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

const submit = (form: UpdateHandlerDTO) => {
  return Promise.resolve(
    update({
      ...form,
      body: JSON.parse(form.body)
    })
  )
}

enum TABS {
  REQUEST,
  RESPONSE
}

export default function Detail({ handler, onClose }: Props) {
  const [tab, setTab] = useState<TABS>(TABS.REQUEST)
  const { values: form, onValueChange, onSubmit, errors, hasErrors } = useForm<
    UpdateHandlerDTO,
    Errors
  >(() => toForm(handler), checkForm, submit)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit().then(onClose)
  }

  return (
    <div className={styles.handlerDetail}>
      <form onSubmit={handleSubmit}>
        <Tabs value={tab} onValueChange={setTab}>
          <Tab label='Request' value={TABS.REQUEST}>
            <RequestForm
              form={form}
              errors={errors}
              onValueChange={onValueChange}
            />
          </Tab>
          <Tab label='Response' value={TABS.RESPONSE}>
            <ResponseForm
              form={form}
              errors={errors}
              onValueChange={onValueChange}
            />
          </Tab>
        </Tabs>

        <button disabled={hasErrors} type='submit'>
          Update
        </button>
        <button onClick={onClose}>Close</button>
      </form>
    </div>
  )
}
