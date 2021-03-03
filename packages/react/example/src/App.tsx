import React, { useState } from 'react'

import Butler from '@butler/react'
import '@butler/react/dist/index.css'

const App = () => {
  const [body, setBody] = useState<any>()
  const runTest = () => {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then((res) => res.json())
      .then(setBody)
  }

  return (
    <div>
      <button onClick={runTest}>Test</button>
      {body && (
        <pre>
          <code>{JSON.stringify(body, undefined, 4)}</code>
        </pre>
      )}
      <Butler />
    </div>
  )
}

export default App
