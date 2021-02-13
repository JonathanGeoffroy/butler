import { useEffect, useState } from 'react'
import setupWorker, { subscribe, Worker, Handler } from '@butler/core'

export const worker: Worker = setupWorker()

export interface ServiceWorker {
  handlers: Handler[]
  enableHandler: (handler: Handler) => void
  disableHandler: (handler: Handler) => void
}

export default function useServiceWorker(): ServiceWorker {
  const [handlers, setHandlers] = useState<Handler[]>([])

  useEffect(() => {
    subscribe((handlers) => setHandlers([...handlers]))
    worker.start()
    return worker.stop
  }, [])

  return {
    handlers,
    enableHandler: worker.enable,
    disableHandler: worker.disable
  }
}
