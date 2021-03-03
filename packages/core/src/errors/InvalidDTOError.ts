import { Errors } from '../DTO'

export class InvalidDTOError extends Error {
  constructor(public readonly errors: Errors) {
    super()
  }
}
