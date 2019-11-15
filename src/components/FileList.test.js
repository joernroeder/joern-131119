import React from 'react'
import {
  renderWithApiAndFileProviders,
  fireEvent,
  act,
  wait,
  waitForElement,
} from 'test-utils'

import FilesList from './FilesList'

afterEach(() => {
  // cleaning up the mess left behind the previous test
  fetch.resetMocks()
})

test('it should correctly render the loading indicator', async () => {
  const { queryByText, container } = renderWithApiAndFileProviders(
    <FilesList />
  )

  const loadingIndicator = await waitForElement(() => queryByText('Loading…'), {
    container,
  })
  expect(loadingIndicator).not.toBeNull()
})

test('it should correctly show no documents if the api returns an empty list', async () => {
  fetch.mockResponseOnce(
    JSON.stringify({
      data: [],
    })
  )

  const { queryByText } = renderWithApiAndFileProviders(<FilesList />)

  const headline = await waitForElement(() => queryByText('No documents'))
  expect(headline).toBeInTheDocument()
  expect(fetch).toHaveBeenCalledTimes(1)
})

describe('it should correctly ignore the given file if', () => {
  test('attributes are not wrapped in an "attributes" object', async () => {
    const payload = JSON.stringify({
      data: [
        {
          type: 'file',
          id:
            '4c1700116bfc788eca30ab1561a5f7821c686c6302b78e17f107e2c96a59d51c',
          title: '1552892759_00cd432e47_o',
          size: 1193928,
        },
      ],
    })

    fetch.mockResponseOnce(payload)

    const { queryByText } = renderWithApiAndFileProviders(<FilesList />)

    const headline = await waitForElement(() => queryByText('No documents'))
    expect(headline).not.toBeNull()
  })

  test('it lacks a title attribute', async () => {
    const payload = JSON.stringify({
      data: [
        {
          type: 'file',
          id:
            '4c1700116bfc788eca30ab1561a5f7821c686c6302b78e17f107e2c96a59d51c',
          attributes: {
            size: 1193928,
          },
        },
      ],
    })

    fetch.mockResponseOnce(payload)

    const { queryByText } = renderWithApiAndFileProviders(<FilesList />)

    const headline = await waitForElement(() => queryByText('No documents'))
    expect(headline).not.toBeNull()
  })

  test('it lacks the size attribute', async () => {
    const payload = JSON.stringify({
      data: [
        {
          type: 'file',
          id:
            '4c1700116bfc788eca30ab1561a5f7821c686c6302b78e17f107e2c96a59d51c',
          attributes: {
            name: 'file-name.asc',
          },
        },
      ],
    })

    fetch.mockResponseOnce(payload)
    const { queryByText } = renderWithApiAndFileProviders(<FilesList />)

    const headline = await waitForElement(() => queryByText('No documents'))
    expect(headline).not.toBeNull()
  })
})

test('it should correctly show one file if the api returns a valid file object', async () => {
  fetch.mockResponseOnce(
    JSON.stringify({
      data: [
        {
          type: 'file',
          id:
            '6fc6ff794b7101af013fa8ec300879d1ed245c3926619c1625753bf34ef8ccbd',
          attributes: {
            name: '1-bsSpf1dNMQ6NIotoSMQQrA<p>inject</p>',
            size: 26492,
          },
        },
        // this file should be ignored as the id is not a sha256 hash
        {
          type: 'file',
          id: 'someInvalidId',
          attributes: {
            title: '1552892759_00cd432e47_o',
            size: 1193928,
          },
        },
      ],
    })
  )

  const { queryByText, container } = renderWithApiAndFileProviders(
    <FilesList />
  )
  expect(queryByText('Loading…')).toBeInTheDocument()

  // wait for fetch promise to resolve
  await wait(async () => {
    const [
      headline,
      totalSize,
      fileName,
      fileSize,
    ] = await waitForElement(
      () => [
        queryByText('1 document'),
        queryByText('Total size: 26.49kb'),
        queryByText('1-bsSpf1dNMQ6NIotoSMQQrA<p>inject</p>'),
        queryByText('26.49kb'),
      ],
      { container }
    )

    expect(headline).toBeInTheDocument()
    expect(totalSize).toBeInTheDocument()
    expect(fileName).toBeInTheDocument()
    expect(fileSize).toBeInTheDocument()
  })
})

test('it should correctly remove a file', async () => {
  const fileId =
    '6fc6ff794b7101af013fa8ec300879d1ed245c3926619c1625753bf34ef8ccbd'

  fetch.mockResponseOnce(
    JSON.stringify({
      data: [
        {
          type: 'file',
          id: fileId,
          attributes: {
            name: '1-bsSpf1dNMQ6NIotoSMQQrA<p>inject</p>',
            size: 26492,
          },
        },
      ],
    })
  )

  const { queryByText, container } = renderWithApiAndFileProviders(
    <FilesList />
  )

  expect(fetch).toHaveBeenCalledTimes(1)

  await wait(async () => {
    const deleteButton = await waitForElement(() => queryByText('delete'), {
      container,
    })

    expect(deleteButton).toBeInTheDocument()

    act(() => {
      fetch.mockResponseOnce()
      fireEvent.click(deleteButton)
    })
  })

  expect(fetch).toHaveBeenCalledTimes(2)

  const [uri] = fetch.mock.calls[1]
  expect(uri).toContain('/' + fileId)

  expect(queryByText('No documents')).toBeInTheDocument()
  expect(queryByText('Total size: 0b')).toBeInTheDocument()
})
