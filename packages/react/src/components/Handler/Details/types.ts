import { RESTMethods } from 'msw'

export interface Errors {
  url?: string
  statusCode?: string
  body?: string
  anotherExists?: string
}

export interface Header {
  key: string
  name: string
  value: string
}

export interface HandlerForm {
  id: string
  method: RESTMethods
  url: string
  enabled: boolean
  statusCode: number
  body: any
  headers: Header[]
}
export interface FormPartProps {
  form: HandlerForm
  onValueChange: (property: keyof HandlerForm) => (value: any) => void
  errors: Errors
}
