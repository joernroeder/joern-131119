import React from 'react'
import mockAxios from 'jest-mock-axios'

import { renderWithApiAndFileProviders, fireEvent, wait } from 'test-utils'

import FileSearch from './FileSearch'

afterEach(() => {
  // cleaning up the mess left behind the previous test
  mockAxios.reset()
})

test('file search should render correctly', () => {
  const { container } = renderWithApiAndFileProviders(<FileSearch />)

  expect(container).toMatchSnapshot()
})

test('file search should trigger a search on value change', async () => {
  const { queryByPlaceholderText } = renderWithApiAndFileProviders(
    <FileSearch />
  )

  const search = queryByPlaceholderText(/Search documents/)

  expect(search.value).toBe('')
  fireEvent.change(search, { target: { value: 'someInp' } })

  await wait(() => {
    expect(mockAxios.get).toHaveBeenCalled()
    const [
      url,
      {
        params: { q },
      },
    ] = mockAxios.get.mock.calls[0]

    expect(url).toBe('/files')
    expect(q).toBe('someInp')

    mockAxios.mockResponse({
      data: [
        {
          type: 'file',
          id:
            '4c1700116bfc788eca30ab1561a5f7821c686c6302b78e17f107e2c96a59d51c',
          attributes: {
            name: '1552892759_00cd432e47_o',
            size: 1193928,
            mime: 'image/jpeg',
          },
        },
      ],
    })
  })
})

test('file search should send the query parameter encoded', async () => {
  const injectedScript = '<script>alert("here i am!")</script>'

  const { queryByPlaceholderText } = renderWithApiAndFileProviders(
    <FileSearch />
  )

  const search = queryByPlaceholderText(/Search documents/)

  fireEvent.change(search, {
    target: { value: injectedScript },
  })

  await wait(() => {
    const [
      url,
      {
        params: { q },
      },
    ] = mockAxios.get.mock.calls[0]

    expect(q).toBe('%3Cscript%3Ealert(%22here%20i%20am!%22)%3C%2Fscript%3E')
  })
})
