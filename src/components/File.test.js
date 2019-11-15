import React from 'react'
import { renderWithApiAndFileProviders, fireEvent, act } from 'test-utils'

import File from './File'

test('files without/with invalid id should be treated as invalid', () => {
  const props = {
    id: '',
    name: 'my-file-name.txt',
    size: 42,
    onDelete: () => {},
  }

  const { container } = renderWithApiAndFileProviders(<File {...props} />)

  expect(container).toBeEmpty()
})

test('it should correctly show the file name', () => {
  const props = {
    id: 'someId',
    name: 'my-file-name.txt',
    size: 0,
    onDelete: () => {},
  }

  const { queryByText } = renderWithApiAndFileProviders(<File {...props} />)

  expect(queryByText('my-file-name.txt')).toBeInTheDocument()
})

test('it should correctly escape', () => {
  const props = {
    id: 'someId',
    name: '<p>my-file-name.txt</p>',
    size: 0,
    onDelete: () => {},
  }

  const { queryByText } = renderWithApiAndFileProviders(<File {...props} />)

  expect(queryByText('<p>my-file-name.txt</p>')).toBeInTheDocument()
})

test('delete button should exist', () => {
  const props = {
    id: 'someId',
    name: 'fileName',
    size: 0,
    onDelete: () => {},
  }

  const { queryByText } = renderWithApiAndFileProviders(<File {...props} />)

  expect(queryByText('delete')).toBeInTheDocument()
})

test('hitting the delete button should correctly call the passed in onDelete prop', async () => {
  const props = {
    id: 'someId',
    name: 'fileName',
    size: 42,
    onDelete: jest.fn(),
  }

  const { queryByText } = renderWithApiAndFileProviders(<File {...props} />)

  const button = queryByText('delete')

  act(() => {
    fireEvent.click(button)
  })

  expect(props.onDelete).toBeCalledTimes(1)
  expect(props.onDelete.mock.calls[0][0]).toEqual('someId')
})
