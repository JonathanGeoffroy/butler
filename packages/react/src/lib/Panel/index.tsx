import React from 'react'
import classnames from 'classnames'
import styles from './index.module.scss'

type Kind = 'horizontal' | 'vertical'

interface Props {
  kind?: Kind
}
const Panel: React.FC<Props> = ({ kind, children }) => {
  return (
    <div className={classnames(styles.panel, kind && styles[kind])}>
      {children}
    </div>
  )
}

export default Panel
