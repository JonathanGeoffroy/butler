import React, { useState } from 'react'
import useServiceWorker from './hooks/useServiceWorker'
import HandlerList from './components/Handler/List'
import HandlerDetail from './components/Handler/Detail'

// @ts-ignore
import styles from './styles.module.scss'
import { Handler, enable, disable } from '@butler/core'

export const Butler = () => {
  const handlers = useServiceWorker()
  const [selectedHandler, setSelectedHandler] = useState<Handler | null>(null)

  return (
    <div className={styles.butler}>
      <HandlerList
        handlers={handlers}
        selectedHandler={selectedHandler}
        onSelectHandler={setSelectedHandler}
        onEnableChange={(handler: Handler, checked: boolean) =>
          checked ? enable(handler) : disable(handler)
        }
      />
      {selectedHandler && (
        <HandlerDetail
          handler={selectedHandler}
          onClose={() => setSelectedHandler(null)}
        />
      )}
    </div>
  )
}
