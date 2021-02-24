import React, { useState } from 'react'
import classnames from 'classnames'

import styles from './index.module.scss'
import Panel from '../Panel'

interface Props {
  label: string
}
const Accordeon: React.FC<Props> = ({ label, children }) => {
  const [open, setOpen] = useState<boolean>(true)

  return (
    <div className={styles.accordeon}>
      <div className={styles.title} onClick={() => setOpen(!open)}>
        <span className={classnames(styles.chevron, open && styles.open)}>
          &#x3e;
        </span>
        <span>{label}</span>
      </div>
      {open && (
        <div className={styles.content}>
          <Panel>{children}</Panel>
        </div>
      )}
    </div>
  )
}
export default Accordeon
