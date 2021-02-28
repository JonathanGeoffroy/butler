import React from 'react'
import { act, fireEvent, render } from '@testing-library/react'
import List from './index'
import { RESTMethods } from 'msw'
import { Handler } from '@butler/core'

test('displays empty list', () => {
  const screen = render(
    <List
      handlers={[]}
      selectedHandler={null}
      onSelectHandler={jest.fn()}
      onEnableChange={jest.fn()}
    />
  )

  expect(
    screen.getAllByRole('columnheader').map((t) => t.textContent)
  ).toStrictEqual(['Enabled?', 'Method', 'Url', '#calls'])
})

test('displays handlers', () => {
  const screen = render(
    <List
      handlers={[
        new Handler(RESTMethods.POST, 'https://some-url.com'),
        new Handler(RESTMethods.GET, 'https://another-url.com')
      ]}
      selectedHandler={null}
      onSelectHandler={jest.fn()}
      onEnableChange={jest.fn()}
    />
  )

  expect(
    screen.getAllByRole('columnheader').map((t) => t.textContent)
  ).toStrictEqual(['Enabled?', 'Method', 'Url', '#calls'])

  expect(screen.getByText('https://some-url.com')).toBeInTheDocument()
  expect(screen.getByText('POST')).toBeInTheDocument()
  expect(screen.getByText('https://another-url.com')).toBeInTheDocument()
  expect(screen.getByText('GET')).toBeInTheDocument()
})

test('enables handler', () => {
  const onEnableChange = jest.fn()
  const onSelectHandler = jest.fn()
  const handlers = [
    new Handler(RESTMethods.POST, 'https://some-url.com'),
    new Handler(RESTMethods.GET, 'https://another-url.com')
  ]
  const screen = render(
    <List
      handlers={handlers}
      selectedHandler={null}
      onSelectHandler={onSelectHandler}
      onEnableChange={onEnableChange}
    />
  )

  act(() => {
    fireEvent.click(screen.getAllByRole('checkbox')[1])
  })

  expect(onEnableChange).toHaveBeenCalledTimes(1)
  expect(onEnableChange).toHaveBeenCalledWith(handlers[1], true)
  expect(onSelectHandler).not.toHaveBeenCalled()
})

test('selects handler', () => {
  const onSelectHandler = jest.fn()
  const handlers = [
    new Handler(RESTMethods.POST, 'https://some-url.com'),
    new Handler(RESTMethods.GET, 'https://another-url.com')
  ]
  const screen = render(
    <List
      handlers={handlers}
      selectedHandler={null}
      onSelectHandler={onSelectHandler}
      onEnableChange={jest.fn()}
    />
  )

  act(() => {
    fireEvent.click(screen.getAllByRole('row')[1])
  })

  expect(onSelectHandler).toHaveBeenCalledTimes(1)
  expect(onSelectHandler).toHaveBeenCalledWith(handlers[0])
})
