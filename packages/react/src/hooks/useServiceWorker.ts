import { useEffect, useState } from 'react'
import setupWorker, { subscribe, Worker, Handler } from '@butler/core'

export const worker: Worker = setupWorker()

export default function useServiceWorker(): Handler[] {
  const [handlers, setHandlers] = useState<Handler[]>([])

  useEffect(() => {
    const unsubscribe = subscribe((handlers) => setHandlers([...handlers]))
    worker.start()
    return () => {
      unsubscribe()
      worker.stop()
    }
  }, [])

  return handlers
}
