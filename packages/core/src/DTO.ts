import { RESTMethods } from 'msw/lib/types'
import Handler from './Handler'
import { anotherExists } from './Manager'
import { InvalidDTOError } from './errors/InvalidDTOError'
import isValidHttpUrl from './validators/httpUrl'
import isValidJSON from './validators/json'
import { ContentType, findContentType } from './utils/headers'

type Headers = Record<string, string>
export interface HandlerDTO {
  method: RESTMethods
  url: string
  enabled: boolean
  statusCode: number
  body: any
  headers?: Headers
}

export interface UpdateHandlerDTO extends HandlerDTO {
  id: string
}

export interface Errors {
  url?: string
  statusCode?: string
  body?: string
  anotherExists?: string
}

export function validate(dto: HandlerDTO): Errors | null {
  const errors: Errors = {}
  if (!isValidHttpUrl(dto.url)) errors.url = 'Please enter a valid URL'

  if (dto.statusCode <= 0) {
    errors.statusCode = 'Please enter a valid status code'
  }

  if (dto.headers) {
    switch (findContentType(dto.headers)) {
      case ContentType.JSON:
        if (!isValidJSON(dto.body)) {
          errors.body = 'Please enter a valid JSON'
        }
        break
      default:
        break
    }
  }

  if (anotherExists(Object.assign({}, new Handler(dto.method, dto.url), dto)))
    errors.anotherExists = 'Another handler for this request already exists'

  return Object.values(errors).find((v) => !!v) ? errors : null
}

export function validateOrThrow(dto: HandlerDTO) {
  const errors = validate(dto)
  if (!!errors) {
    throw new InvalidDTOError(errors)
  }
}
