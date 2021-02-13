import Handler from './Handler'

export type Subscriber = (handlers: Handler[]) => void
export type Unsubscribe = () => void

const subscribers: Subscriber[] = []

export function subscribe(subscriber: Subscriber): Unsubscribe {
  subscribers.push(subscriber)
  return () => subscribers.splice(subscribers.indexOf(subscriber))
}

export function notify(handlers: Handler[]) {
  subscribers.forEach((subscriber) => subscriber(handlers))
}
