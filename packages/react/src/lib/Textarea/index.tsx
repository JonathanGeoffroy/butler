import React from 'react'
import classnames from 'classnames'

// @ts-ignore
import styles from './index.scss'

interface Props
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  value: string | number
  onValueChange?: (value: string) => void
  error?: string
  className?: string
}

export default function Textarea({
  value,
  onChange,
  onValueChange,
  error,
  className,
  ...props
}: Props) {
  return (
    <textarea
      {...props}
      value={value}
      onChange={
        onChange
          ? onChange
          : (e) =>
              onValueChange ? onValueChange(e.currentTarget.value) : undefined
      }
      title={error}
      className={classnames(
        styles.textarea,
        className,
        error && styles.errored
      )}
    />
  )
}
