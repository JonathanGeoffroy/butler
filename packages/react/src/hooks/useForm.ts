import { useEffect, useState } from 'react'

type Submit<V> = (values: V) => Promise<any>

type Checker<V, E> = (values: V) => E

interface Response<V, E> {
  submitting: boolean
  values: V
  errors: E
  hasErrors: boolean
  onValueChange: (property: keyof V) => (value: any) => void
  resetForm: (values: V | (() => V)) => void
  onSubmit: () => Promise<any>
}

export default function useForm<V, E>(
  defaultValues: V | (() => V),
  checker: Checker<V, E>,
  submit: Submit<V>
): Response<V, E> {
  const [values, setValues] = useState<V>(defaultValues)
  const [errors, setErrors] = useState<E>(() => checker(values))
  const [submitting, setSubmitting] = useState<boolean>(false)

  const hasErrors = !!Object.values(errors).find((v) => !!v)

  useEffect(() => {
    setErrors(checker(values))
  }, [checker, values])

  const onValueChange = (property: keyof V) => (value: typeof property) => {
    setValues((values) => ({
      ...values,
      [property]: value
    }))
  }

  const onSubmit = () => {
    if (!hasErrors) {
      setSubmitting(true)
      return submit(values) //.finally(() => setSubmitting(false))
    }
    return Promise.reject(errors)
  }

  return {
    values,
    errors,
    hasErrors,
    onValueChange,
    resetForm: setValues,
    onSubmit,
    submitting
  }
}
