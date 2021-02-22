import React from 'react'
import classnames from 'classnames'

// @ts-ignore
import styles from './index.scss'

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  value: string | number
  onValueChange?: (value: string | number) => void
  error?: string
  className?: string
}

export default function Input({
  value,
  onChange,
  onValueChange,
  error,
  className,
  ...props
}: Props) {
  return (
    <input
      {...props}
      value={value}
      onChange={
        onChange
          ? onChange
          : (e) =>
              onValueChange ? onValueChange(e.currentTarget.value) : undefined
      }
      title={error}
      className={classnames(styles.input, className, error && styles.errored)}
    />
  )
}
