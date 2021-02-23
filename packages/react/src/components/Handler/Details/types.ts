import { UpdateHandlerDTO } from '@butler/core'

export interface Errors {
  url?: string
  statusCode?: string
  body?: string
  anotherExists?: string
}

export interface FormPartProps {
  form: UpdateHandlerDTO
  onValueChange: (property: keyof UpdateHandlerDTO) => (value: any) => void
  errors: Errors
}
