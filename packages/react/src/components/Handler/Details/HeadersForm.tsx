import React from 'react'
import { v4 as uuid } from 'uuid'
import { Header } from './types'

import Input from '../../../lib/Input'

import styles from './HeadersForm.module.scss'
import Button from '../../../lib/Button'

interface Props {
  headers: Header[]
  onChange: (headers: Header[]) => void
}
export default function HeaderForm({ headers, onChange }: Props) {
  const onHeaderNameChange = (key: string, name: string) => {
    onChange(
      headers.map((header) => {
        if (header.key === key) {
          header.name = name
        }
        return header
      })
    )
  }

  const onHeaderValueChange = (key: string, value: string) => {
    onChange(
      headers.map((header) => {
        if (header.key === key) {
          header.value = value
        }
        return header
      })
    )
  }

  const onAddHeader = () => {
    onChange([
      ...headers,
      {
        key: uuid(),
        name: '',
        value: ''
      }
    ])
  }
  const onDelete = (key: string) => {
    onChange(headers.filter((header) => header.key !== key))
  }

  return (
    <div className={styles.headerForm}>
      {headers.map(({ key, name, value }) => (
        <div className={styles.header} key={key}>
          <Input
            value={name}
            onValueChange={(name) => onHeaderNameChange(key, name.toString())}
          />
          <span className={styles.split}>:</span>
          <Input
            value={value}
            onValueChange={(value) =>
              onHeaderValueChange(key, value.toString())
            }
          />
          <Button small onClick={() => onDelete(key)}>
            &#x1F5D1;
          </Button>
        </div>
      ))}

      <Button onClick={onAddHeader}>Add header</Button>
    </div>
  )
}
