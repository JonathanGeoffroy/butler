import React from 'react'
import { Handler, update, UpdateHandlerDTO } from '@butler/core'
import { fireEvent, render } from '@testing-library/react'
import { RESTMethods } from 'msw'
import Form from './index'

const DEFAULT_HEADERS = {
  'x-butler-test': 'butler'
}

function createHandler(
  headers: Record<string, string> = DEFAULT_HEADERS
): Handler {
  const handler = new Handler(RESTMethods.DELETE, 'https://www.url.com')
  handler.enable()
  handler.response = {
    body: '{"some": "body"}',
    statusCode: 419,
    headers
  }

  return handler
}

test('sends form', () => {
  const handler = createHandler()
  const screen = render(<Form handler={handler} onClose={jest.fn()} />)

  fireEvent.change(screen.getByLabelText(/Enabled/))
  fireEvent.change(screen.getByLabelText(/url/), {
    target: { value: 'https://www.another-url.com' }
  })
  fireEvent.change(screen.getByLabelText(/Method/), {
    target: { value: RESTMethods.HEAD }
  })

  fireEvent.click(screen.getByText('Response'))
  fireEvent.change(screen.getByLabelText(/Response Body/), {
    target: { value: '{"another": "JSON"}' }
  })
  fireEvent.change(screen.getByLabelText(/Status/), {
    target: { value: '201' }
  })

  const updateButton = screen.getByText(/Update/)
  expect(updateButton).toBeEnabled()
  fireEvent.click(updateButton)

  expect(update).toHaveBeenCalledTimes(1)
  const expected: UpdateHandlerDTO = {
    id: handler.id,
    body: '{"another": "JSON"}',
    headers: {
      'x-butler-test': 'butler'
    },
    enabled: true,
    method: RESTMethods.HEAD,
    statusCode: 201,
    url: 'https://www.another-url.com'
  }
  expect(update).toHaveBeenCalledWith(expected)
})

describe('checker', () => {
  test('checks URL', () => {
    const screen = render(
      <Form handler={createHandler()} onClose={jest.fn()} />
    )

    expect(screen.getByText(/Update/)).toBeEnabled()

    fireEvent.change(screen.getByLabelText(/url/), {
      target: { value: 'BadUrl' }
    })
    expect(screen.getByText(/Update/)).toBeDisabled()
    expect(screen.getByLabelText(/url/)).toHaveAttribute(
      'title',
      'Please enter a valid URL'
    )
    expect(screen.getByText(/Update/)).toBeDisabled()
  })

  test('checks JSON body', () => {
    const handler = createHandler({ ' CONTENT-TYPE ': 'APPLICATION/JSON ' })
    const screen = render(<Form handler={handler} onClose={jest.fn()} />)

    expect(screen.getByText(/Update/)).toBeEnabled()

    fireEvent.click(screen.getByText('Response'))
    fireEvent.change(screen.getByLabelText(/Response Body/), {
      target: { value: 'BadJSON' }
    })

    expect(screen.getByText(/Update/)).toBeDisabled()
    expect(screen.getByLabelText(/Response Body/)).toHaveAttribute(
      'title',
      'Please enter a valid JSON'
    )
  })

  test('checks text body', () => {
    const handler = createHandler({ 'content-type': 'text/plain' })
    const screen = render(<Form handler={handler} onClose={jest.fn()} />)

    expect(screen.getByText(/Update/)).toBeEnabled()

    fireEvent.click(screen.getByText('Response'))
    fireEvent.change(screen.getByLabelText(/Response Body/), {
      target: { value: 'BadJSON' }
    })

    expect(screen.getByText(/Update/)).toBeEnabled()
    expect(screen.getByLabelText(/Response Body/)).not.toHaveAttribute('title')
  })

  test('checks status code', () => {
    const screen = render(
      <Form handler={createHandler()} onClose={jest.fn()} />
    )

    expect(screen.getByText(/Update/)).toBeEnabled()

    fireEvent.click(screen.getByText('Response'))
    fireEvent.change(screen.getByLabelText(/Status/), {
      target: { value: 0 }
    })

    expect(screen.getByText(/Update/)).toBeDisabled()
    expect(screen.getByLabelText(/Status/)).toHaveAttribute(
      'title',
      'Please enter a valid status code'
    )
  })
})
