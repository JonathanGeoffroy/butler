import React from 'react'
import useServiceWorker from './hooks/useServiceWorker'
import RequestList from './components/Handler/List/List'

export const Butler = () => {
  const handlers = useServiceWorker()

  const runTest = () => {
    fetch('https://jsonplaceholder.typicode.com/todos/1').then((res) =>
      res.json()
    )
  }
  return (
    <div>
      <div>
        <button onClick={runTest}>Test</button>
      </div>
      <RequestList handlers={handlers} />
    </div>
  )
}
