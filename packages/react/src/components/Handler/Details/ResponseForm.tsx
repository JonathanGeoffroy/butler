import React from 'react'
import classnames from 'classnames'

import Input from '../../../lib/Input'
import Textarea from '../../../lib/Textarea'
import { FormPartProps } from './types'

// @ts-ignore
import styles from './index.scss'

export default function ResponseForm({
  form,
  onValueChange,
  errors
}: FormPartProps) {
  return (
    <div>
      <div className={classnames(styles.row, styles.horizontal)}>
        <label>Status</label>
        <Input
          type='number'
          value={form.statusCode}
          onValueChange={onValueChange('statusCode')}
        />
      </div>

      <div className={styles.row}>
        <label>Response</label>
        <Textarea
          style={{ width: '100%' }}
          rows={8}
          value={form.body}
          onValueChange={onValueChange('body')}
          error={errors.body}
        />
      </div>
    </div>
  )
}
