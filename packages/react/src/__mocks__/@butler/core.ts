const setupWorker = jest.fn().mockImplementation(() => {
  return {
    start: jest.fn(),
    stop: jest.fn()
  }
})

const subscribe = jest.fn().mockImplementation((cb) => {
  const index = subscribers.push(cb)
  return () => {
    subscribers.splice(index, 1)
  }
})

export const subscribers: Function[] = []
export function notify(handlers: any[]) {
  subscribers.map((cb) => cb(handlers))
}

const { Handler, validate } = jest.requireActual('@butler/core')
export { Handler }
export const enable = jest.fn()
export const disable = jest.fn()
export const anotherExists = jest.fn().mockReturnValue(false)
export const update = jest.fn()

export default setupWorker
export { subscribe, validate }
