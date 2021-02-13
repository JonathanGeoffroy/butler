import React, { useState } from 'react'
import useServiceWorker from './hooks/useServiceWorker'
import HandlerList from './components/Handler/List'
import HandlerDetail from './components/Handler/Detail'

// @ts-ignore
import styles from './styles.module.scss'
import { Handler } from '@butler/core'

export const Butler = () => {
  const { handlers, enableHandler, disableHandler } = useServiceWorker()
  const [selectedHandler, setSelectedHandler] = useState<Handler | null>(null)

  return (
    <div className={styles.butler}>
      <HandlerList
        handlers={handlers}
        selectedHandler={selectedHandler}
        onSelectHandler={setSelectedHandler}
        onEnableChange={(handler: Handler, enable: boolean) =>
          enable ? enableHandler(handler) : disableHandler(handler)
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
