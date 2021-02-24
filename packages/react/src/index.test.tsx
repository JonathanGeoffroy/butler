import { render } from '@testing-library/react'
import React from 'react'
import { Butler } from './Butler'

test('Butler starts up', () => {
  const screen = render(<Butler />)

  expect(
    screen.getAllByRole('columnheader').map((t) => t.textContent)
  ).toStrictEqual(['Enabled?', 'Method', 'Url', '#calls'])
})
