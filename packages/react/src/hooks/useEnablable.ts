import { rest, RestContext } from 'msw'
import { useEffect, useState } from 'react'
import { worker } from './useServiceWorker'

const mockHandler = (_: any, res: any, ctx: RestContext) => {
  return res(
    ctx.status(200),

    ctx.json({
      username: 'admin'
    })
  )
}

export default function useEnablable(initialEnabled = false) {
  const state = useState<boolean>(initialEnabled)
  const [enabled] = state
  useEffect(() => {
    if (enabled) {
      worker.resetHandlers(
        rest.get('https://jsonplaceholder.typicode.com/todos/*', mockHandler)
      )
    } else {
      worker.resetHandlers()
    }
  }, [enabled])

  return state
}
