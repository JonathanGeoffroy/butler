import React from 'react'

import Butler from '@butler/react'
import '@butler/react/dist/index.css'

const App = () => {
  const runTest = () => {
    fetch('https://jsonplaceholder.typicode.com/todos/1').then((res) =>
      res.json()
    )
  }

  return (
    <div>
      <button onClick={runTest}>Test</button>
      <Butler />
    </div>
  )
}

export default App
