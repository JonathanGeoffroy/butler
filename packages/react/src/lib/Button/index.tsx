import React from 'react'
import classnames from 'classnames'

import styles from './index.module.scss'

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  primary?: boolean
  small?: boolean
}

const Button: React.FC<Props> = ({
  primary = false,
  small = false,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={classnames(
        styles.button,
        className,
        primary && styles.primary,
        small && styles.small
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
