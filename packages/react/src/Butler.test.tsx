import { Handler } from '@butler/core'
import { render } from '@testing-library/react'
import { RESTMethods } from 'msw'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Butler } from './Butler'
import { notify } from './__mocks__/@butler/core'

test('starts up', () => {
  const screen = render(<Butler />)

  expect(
    screen.getAllByRole('columnheader').map((t) => t.textContent)
  ).toStrictEqual(['Enabled?', 'Method', 'Url', '#calls'])
})

test('starts Listen requests', async () => {
  const screen = render(<Butler />)

  act(() => {
    notify([new Handler(RESTMethods.GET, 'https://some-url.com')])
  })

  await screen.findByText('https://some-url.com')

  expect(screen.getByText('https://some-url.com')).toBeInTheDocument()
  expect(screen.getByText('GET')).toBeInTheDocument()
  expect(screen.getByRole('checkbox')).toBeInTheDocument()
})
