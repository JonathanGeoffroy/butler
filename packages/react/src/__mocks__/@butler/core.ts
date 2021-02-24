function setupWorker() {
  return {
    start: jest.fn(),
    stop: jest.fn()
  }
}

const subscribe = jest.fn()

export default setupWorker
export { subscribe }
