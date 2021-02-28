import React from 'react'

import Input from '../../../lib/Input'
import Textarea from '../../../lib/Textarea'
import Accordeon from '../../../lib/Accordeon'

import HeadersForm from './HeadersForm'
import { FormPartProps } from './types'

import styles from './index.module.scss'

export default function ResponseForm({
  form,
  onValueChange,
  errors
}: FormPartProps) {
  return (
    <div className={styles.responseForm}>
      <Accordeon label='Headers'>
        <HeadersForm
          headers={form.headers || {}}
          onChange={onValueChange('headers')}
        />
      </Accordeon>

      <Accordeon label='Body'>
        <div className={styles.horizontal}>
          <label>Status</label>
          <Input
            aria-label='Status'
            type='number'
            value={form.statusCode}
            onValueChange={onValueChange('statusCode')}
            error={errors.statusCode}
          />
        </div>

        <div>
          <label>Response</label>
          <Textarea
            aria-label='Response Body'
            style={{ width: '100%' }}
            rows={8}
            value={form.body}
            onValueChange={onValueChange('body')}
            error={errors.body}
          />
        </div>
      </Accordeon>
    </div>
  )
}
