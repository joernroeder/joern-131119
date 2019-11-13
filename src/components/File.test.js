import React from 'react'
import { renderWithApiAndFileProviders, fireEvent, act, wait } from 'test-utils'

import File from './File'
import mockAxios from 'jest-mock-axios'

test('files without/with invalid id should be treated as invalid', () => {
  const props = {
    id: '',
    name: 'my-file-name.txt',
    size: 42,
  }

  const { container } = renderWithApiAndFileProviders(<File {...props} />)

  expect(container).toBeEmpty()
})

test('it should correctly show the file name', () => {
  const props = {
    id: 'someId',
    name: 'my-file-name.txt',
    size: 0,
  }

  const { queryByText } = renderWithApiAndFileProviders(<File {...props} />)

  expect(queryByText('my-file-name.txt')).toBeInTheDocument()
})

test('it should correctly escape', () => {
  const props = {
    id: 'someId',
    name: '<p>my-file-name.txt</p>',
    size: 0,
  }

  const { queryByText } = renderWithApiAndFileProviders(<File {...props} />)

  expect(queryByText('<p>my-file-name.txt</p>')).toBeInTheDocument()
})

test('delete button should exist', () => {
  const props = {
    id: 'someId',
    name: 'fileName',
    size: 0,
  }

  const { queryByText } = renderWithApiAndFileProviders(<File {...props} />)

  expect(queryByText('delete')).toBeInTheDocument()
})

test('hitting the delete button should correctly send the api request and encode the id', async () => {
  const props = {
    id: "someId?='id!=0",
    name: 'fileName',
    size: 42,
  }

  const { queryByText } = renderWithApiAndFileProviders(<File {...props} />)

  const button = queryByText('delete')

  act(() => {
    fireEvent.click(button)
  })

  await wait(() => {
    expect(mockAxios.delete).toHaveBeenCalled()
    expect(mockAxios.delete.mock.calls[0][0]).toBe(
      "/files/someId%3F%3D'id!%3D0"
    )

    mockAxios.mockResponse({ status: 200, statusText: 'OK' })
  })
})
