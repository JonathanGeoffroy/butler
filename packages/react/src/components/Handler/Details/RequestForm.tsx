import { RESTMethods } from 'msw'
import React from 'react'
import { FormPartProps } from './types'
import Input from '../../../lib/Input'
import Panel from '../../../lib/Panel'

import styles from './index.module.scss'

export default function RequestForm({
  form,
  onValueChange,
  errors
}: FormPartProps) {
  return (
    <Panel kind='vertical'>
      <div className={styles.horizontal}>
        <label>Enabled</label>
        <input
          aria-label='Enabled'
          type='checkbox'
          checked={form.enabled}
          onChange={() => onValueChange('enabled')(!form.enabled)}
        />
      </div>
      <div className={styles.horizontal}>
        <label>Method</label>
        <select
          aria-label='Method'
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

      <div className={styles.horizontal}>
        <label>Url</label>
        <Input
          type='text'
          aria-label='url'
          value={form.url}
          onValueChange={onValueChange('url')}
          error={errors.url || errors.anotherExists}
        />
      </div>
    </Panel>
  )
}
