import React, { Children, isValidElement, ReactElement } from 'react'
import { Props as TabProps, RealTab } from './Tab'

// @ts-ignore
import styles from './Tabs.scss'

interface Props<V> {
  value: V
  onValueChange: (value: V) => void
  children: React.ReactElement<TabProps<V>>[]
}

export default function Tabs<V>({ value, onValueChange, children }: Props<V>) {
  const selectedTab = Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.props.value === value
  )
  return (
    <div className={styles.tabs}>
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

      <div className={styles.selectedContent}>
        {React.isValidElement(selectedTab) ? selectedTab.props.children : null}
      </div>
    </div>
  )
}
