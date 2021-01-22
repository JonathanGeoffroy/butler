import { MockedRequest, setupWorker } from 'msw'
import { useEffect, useState } from 'react'

export const worker = setupWorker()

export interface Request extends MockedRequest {
  mocked: boolean
}

export default function useServiceWorker(): Request[] {
  const [requests, setRequests] = useState<Request[]>([])

  useEffect(() => {
    worker.on('request:match', (req) => {
      setRequests((requests) => [
        ...requests,
        {
          ...req,
          mocked: true
        }
      ])
    })

    worker.on('request:unhandled', (req) => {
      setRequests((requests) => [
        ...requests,
        {
          ...req,
          mocked: false
        }
      ])
    })

    worker.start()
    return () => worker && worker.stop()
  }, [])

  return requests
}
