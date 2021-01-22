import React from 'react'
import useServiceWorker from './hooks/useServiceWorker'
import RequestList from './components/Request/List/List'
import useEnablable from './hooks/useEnablable'

export const Butler = () => {
  const requests = useServiceWorker()
  const [enabled, setEnabled] = useEnablable(true)

  const runTest = () => {
    fetch('https://jsonplaceholder.typicode.com/todos/1').then((res) =>
      res.json()
    )
  }

  const toggleMock = () => setEnabled(!enabled)

  return (
    <div>
      <div>
        <button onClick={toggleMock}>
          {enabled ? 'disable mock' : 'enable mock'}
        </button>
        <button onClick={runTest}>Test</button>
      </div>
      <RequestList requests={requests} />
    </div>
  )
}
