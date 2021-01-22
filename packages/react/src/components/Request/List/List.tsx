import React from 'react'
import { Request } from '../../../hooks/useServiceWorker'

interface Props {
  requests: Request[]
}

const RequestList: React.FC<Props> = ({ requests }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Mocked</th>
          <th>Method</th>
          <th>Url</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <tr key={request.id}>
            <td>{request.mocked ? 'Mocked' : 'ByPassed'}</td>
            <td>{request.method}</td>
            <td>{request.url.href}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default RequestList
