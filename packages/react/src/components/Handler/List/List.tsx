import React from 'react'
import Handler from '../../../core/Handler'
import { worker } from '../../../hooks/useServiceWorker'

interface Props {
  handlers: Handler[]
}

const RequestList: React.FC<Props> = ({ handlers }) => {
  const onHandleChange = (handler: Handler) => {
    handler.isActive ? worker.disable(handler) : worker.enable(handler)
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Enabled ?</th>
          <th>Method</th>
          <th>Url</th>
        </tr>
      </thead>
      <tbody>
        {handlers.map((handler) => (
          <tr key={handler.url}>
            <td>
              <input
                type='checkbox'
                checked={handler.isActive}
                onChange={() => onHandleChange(handler)}
              />
            </td>
            <td>{handler.method}</td>
            <td>{handler.url}</td>
            <td>{handler.requests?.length || '(none)'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default RequestList
