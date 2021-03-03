import React, { FormEvent, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import {
  Errors,
  Handler,
  update,
  UpdateHandlerDTO,
  validate
} from '@butler/core'
import Tabs, { Tab } from '../../../lib/Tabs'
import Button from '../../../lib/Button'
import useForm from '../../../hooks/useForm'
import { HandlerForm } from './types'
import RequestForm from './RequestForm'
import ResponseForm from './ResponseForm'

import styles from './index.module.scss'

export interface Props {
  handler: Handler
  onClose: () => void
}

const toForm = (handler: Handler): HandlerForm => {
  return {
    id: handler.id,
    url: handler.url,
    method: handler.method,
    statusCode: handler.response?.statusCode || 200,
    body: handler.response ? JSON.stringify(handler.response.body) : '',
    enabled: handler.isActive,
    headers: handler.response?.headers
      ? Object.entries(handler.response.headers).map(([name, value]) => {
          return {
            key: uuid(),
            name,
            value
          }
        })
      : []
  }
}

const submit = (form: HandlerForm) => {
  return Promise.resolve(
    update({
      ...form,
      statusCode: parseInt(form.statusCode.toString()),
      headers: form.headers.reduce((acc, header) => {
        if (header.name.trim().length > 0) {
          acc[header.name] = header.value
        }

        return acc
      }, {}),
      body: JSON.parse(form.body)
    })
  )
}

enum TABS {
  REQUEST,
  RESPONSE
}

const checkForm = (form: HandlerForm): Errors | null => {
  const value: UpdateHandlerDTO = {
    ...form,
    statusCode: parseInt(form.statusCode.toString()),
    headers: form.headers.reduce((acc, header) => {
      if (header.name.trim().length > 0) {
        acc[header.name] = header.value
      }

      return acc
    }, {})
  }

  return validate(value)
}
export default function Detail({ handler, onClose }: Props) {
  const [tab, setTab] = useState<TABS>(TABS.REQUEST)
  const {
    values: form,
    onValueChange,
    onSubmit,
    errors,
    hasErrors,
    resetForm
  } = useForm(() => toForm(handler), checkForm, submit)

  useEffect(() => {
    resetForm(toForm(handler))
  }, [handler])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit().then(onClose)
  }

  return (
    <div className={styles.handlerDetail}>
      <Tabs
        value={tab}
        onValueChange={setTab}
        right={
          <div>
            <Button primary small disabled={hasErrors} onClick={handleSubmit}>
              Update
            </Button>
            <Button className={styles.closeButton} onClick={onClose}>
              ×
            </Button>
          </div>
        }
      >
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
    </div>
  )
}
