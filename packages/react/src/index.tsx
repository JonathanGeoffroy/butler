import React from 'react'
import useServiceWorker from './hooks/useServiceWorker'
import HandlerList from './components/Handler/List'

// @ts-ignore
import styles from './styles.module.scss'

export const Butler = () => {
  const handlers = useServiceWorker()

  const runTest = () => {
    fetch('https://jsonplaceholder.typicode.com/todos/1').then((res) =>
      res.json()
    )
  }
  return (
    <div className={styles.butler}>
      <div>
        <button onClick={runTest}>Test</button>
      </div>
      <HandlerList handlers={handlers} onSelectHandler={() => {}} />
    </div>
  )
}
