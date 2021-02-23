import { RESTMethods } from 'msw'
import React from 'react'
import classnames from 'classnames'
import Input from '../../../lib/Input'
import { FormPartProps } from './types'

// @ts-ignore
import styles from './index.scss'

export default function RequestForm({
  form,
  onValueChange,
  errors
}: FormPartProps) {
  return (
    <div>
      <div className={classnames(styles.row, styles.horizontal)}>
        <label>Enabled</label>
        <input
          type='checkbox'
          checked={form.enabled}
          onChange={() => onValueChange('enabled')(!form.enabled)}
        />
      </div>
      <div className={classnames(styles.row, styles.horizontal)}>
        <label>Method</label>
        <select
          value={form.method}
          onChange={(e) => onValueChange('method')(e.currentTarget.value)}
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
          onValueChange={onValueChange('url')}
          error={errors.url || errors.anotherExists}
        />
      </div>
    </div>
  )
}
