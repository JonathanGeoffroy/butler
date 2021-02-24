import React, { Children, isValidElement, ReactElement } from 'react'
import { Props as TabProps, RealTab } from './Tab'

import styles from './Tabs.module.scss'

interface Props<V> {
  value: V
  onValueChange: (value: V) => void
  right?: React.ReactNode
  children: React.ReactElement<TabProps<V>>[]
}

export default function Tabs<V>({
  value,
  onValueChange,
  right,
  children
}: Props<V>) {
  const selectedTab = Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.props.value === value
  )
  return (
    <div className={styles.tabs}>
      <div className={styles.tabsHeader}>
        <div className={styles.tabsItems}>
          {Children.map(children, (child: ReactElement<TabProps<V>>) =>
            isValidElement(child) ? (
              <RealTab
                selected={child.props.value === value}
                label={child.props.label}
                onSelect={() => onValueChange(child.props.value)}
              />
            ) : (
              child
            )
          )}
        </div>
        {right && <div className={styles.tabsRight}>{right}</div>}
      </div>

      <div className={styles.selectedContent}>
        {React.isValidElement(selectedTab) ? selectedTab.props.children : null}
      </div>
    </div>
  )
}
