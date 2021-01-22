import { useEffect, useState } from 'react'
import setupWorker, { Worker } from '../core'
import Handler from '../core/Handler'

export const worker: Worker = setupWorker()

export default function useServiceWorker(): Handler[] {
  const [requests, setRequests] = useState<Handler[]>([])

  useEffect(() => {
    worker.onChange((handlers) => setRequests([...handlers]))
    worker.start()
    return worker.stop
  }, [])

  return requests
}
