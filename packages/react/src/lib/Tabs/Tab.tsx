import React, { ReactNode } from 'react'
import classnames from 'classnames'

import styles from './Tab.module.scss'

export interface Valuable<V> {
  value: V
}

export interface Selectable {
  selected: boolean
}

export interface Props<V> extends Valuable<V> {
  label: string
  children: ReactNode
}
export default function Tab<V>(_: Props<V>) {
  return null
}

export interface RealProps extends Selectable {
  label: string
  onSelect: () => void
}

export function RealTab({ label, selected, onSelect }: RealProps) {
  return (
    <div
      className={classnames(styles.tab, selected && styles.selected)}
      onClick={onSelect}
    >
      <span>{label}</span>
    </div>
  )
}
