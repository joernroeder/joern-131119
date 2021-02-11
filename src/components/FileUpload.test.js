import React from 'react'
import {
  renderWithApiAndFileProviders,
  renderWithApiProvider,
  fireEvent,
  act,
} from 'test-utils'

import FileUpload from './FileUpload'
import { FilesProvider } from '../store/FileStore'

const uploadProps = {
  accept: ['image/jpeg'],
  maxFileSize: 1e6, // 1mb
}

const NullButton = () => null

test('it should render correctly', () => {
  const Button = () => <button>Upload</button>
  const { container } = renderWithApiAndFileProviders(
    <FileUpload {...uploadProps}>
      <Button />
    </FileUpload>
  )

  expect(container).toMatchSnapshot()
})

test('the file input should be invisible', () => {
  const { container } = renderWithApiAndFileProviders(
    <FileUpload {...uploadProps}>
      <NullButton />
    </FileUpload>
  )

  const input = container.querySelector('input')

  expect(input).toHaveClass('hidden')
})

test('a click on the child should open the file selector', () => {
  const Button = ({ openFileSelector }) => (
    <button onClick={openFileSelector}>Upload</button>
  )

  const { container, getByText } = renderWithApiAndFileProviders(
    <FileUpload {...uploadProps}>
      <Button />
    </FileUpload>
  )

  const input = container.querySelector('input')
  act(() => {
    input.onclick = jest.fn()
    fireEvent.click(getByText('Upload'))
  })

  expect(input.onclick).toHaveBeenCalledTimes(1)
})

test('it should correctly reject if the file type is not allowed', async () => {
  let testIsRejected = false
  let testErrorMessage = undefined

  const Button = ({ uploadState: { isRejected, error } }) => {
    testIsRejected = isRejected
    testErrorMessage = error ? error.message : undefined

    return null
  }

  const { container } = renderWithApiAndFileProviders(
    <FileUpload {...uploadProps}>
      <Button />
    </FileUpload>
  )

  const input = container.querySelector('input')

  await act(async () => {
    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    })

    // @see https://github.com/testing-library/react-testing-library/issues/93#issuecomment-403887769
    Object.defineProperty(input, 'files', {
      value: [file],
    })

    fireEvent.change(input)
  })

  expect(testIsRejected).toBeTruthy()
  expect(testErrorMessage).toBe('The given file type is not allowed.')
})

test('it should correctly reject if the file exceeds the limit', () => {
  const maxFileSize = 9 // 9 bytes

  let testIsRejected = false
  let testErrorMessage = undefined

  const Button = ({ uploadState: { isRejected, error } }) => {
    testIsRejected = isRejected
    testErrorMessage = error ? error.message : undefined

    return null
  }

  const { container } = renderWithApiAndFileProviders(
    <FileUpload {...uploadProps} maxFileSize={maxFileSize}>
      <Button />
    </FileUpload>
  )

  const input = container.querySelector('input')

  act(() => {
    const file = new File(['0123456789'], 'ten-byte.jpg', {
      type: 'image/jpeg',
    })
    Object.defineProperty(input, 'files', {
      value: [file],
    })
    fireEvent.change(input)
  })

  expect(testIsRejected).toBeTruthy()
  expect(testErrorMessage).toBe('The given file is to large.')
})

test('it should correctly send the file', async () => {
  let testIsRejected = false
  let testIsResolved = false
  let testErrorMessage = undefined

  const Button = ({ uploadState: { isRejected, isResolved, error } }) => {
    testIsRejected = isRejected
    testIsResolved = isResolved
    testErrorMessage = error ? error.message : undefined

    return null
  }

  const { container } = renderWithApiAndFileProviders(
    <FileUpload {...uploadProps}>
      <Button />
    </FileUpload>
  )

  const input = container.querySelector('input')
  const file = new File(['dummy content'], 'example.png', {
    type: 'image/jpeg',
  })

  fetch.mockResponseOnce(
    JSON.stringify({
      data: {
        type: 'file',
        id: '6fc6ff794b7101af013fa8ec300879d1ed245c3926619c1625753bf34ef8ccbd',
        attributes: {
          name: '1-bsSpf1dNMQ6NIotoSMQQrA<p>inject</p>',
          size: 26492,
        },
      },
    })
  )

  await act(async () => {
    // @see https://github.com/testing-library/react-testing-library/issues/93#issuecomment-403887769
    Object.defineProperty(input, 'files', {
      value: [file],
    })

    fireEvent.change(input)
  })

  expect(testIsRejected).toBeFalsy()
  expect(testIsResolved).toBeTruthy()
  expect(testErrorMessage).toBeUndefined()

  const [uri, opts] = fetch.mock.calls[0]
  const { body: formData } = opts

  expect(formData.getAll('file')).toHaveLength(1)
  expect(formData.get('file')).toBe(file)
})

test('it should correctly reject if the server response contains an invalid file object', async () => {
  let testIsRejected = false
  let testErrorMessage = undefined

  const Button = ({ uploadState: { isRejected, error } }) => {
    testIsRejected = isRejected
    testErrorMessage = error ? error.message : undefined

    return null
  }

  const { container } = renderWithApiAndFileProviders(
    <FileUpload {...uploadProps}>
      <Button />
    </FileUpload>
  )

  const input = container.querySelector('input')
  const file = new File(['dummy content'], 'example.png', {
    type: 'image/jpeg',
  })

  fetch.mockResponseOnce(
    JSON.stringify({
      data: {
        type: 'file',
        id: 'no hash',
        attributes: {
          name: '1-bsSpf1dNMQ6NIotoSMQQrA<p>inject</p>',
          size: 26492,
        },
      },
    })
  )

  await act(async () => {
    // @see https://github.com/testing-library/react-testing-library/issues/93#issuecomment-403887769
    Object.defineProperty(input, 'files', {
      value: [file],
    })

    fireEvent.change(input)
  })

  expect(testIsRejected).toBeTruthy()
  expect(testErrorMessage).toEqual('Something went wrong, please try again.')
})

test('it should correctly reject if the server response contains file object already listed in the file store', async () => {
  const duplicateFile = {
    type: 'file',
    id: '6fc6ff794b7101af013fa8ec300879d1ed245c3926619c1625753bf34ef8ccbd',
    attributes: {
      name: '1-bsSpf1dNMQ6NIotoSMQQrA<p>inject</p>',
      size: 26492,
    },
  }

  let testIsRejected = false
  let testErrorMessage = undefined

  const Button = ({ uploadState: { isRejected, error } }) => {
    testIsRejected = isRejected
    testErrorMessage = error ? error.message : undefined

    return null
  }

  const { container } = renderWithApiProvider(
    <FilesProvider state={{ files: [duplicateFile] }}>
      <FileUpload {...uploadProps}>
        <Button />
      </FileUpload>
    </FilesProvider>
  )

  const input = container.querySelector('input')
  const file = new File(['dummy content'], 'example.png', {
    type: 'image/jpeg',
  })

  fetch.mockResponseOnce(
    JSON.stringify({
      data: duplicateFile,
    })
  )

  await act(async () => {
    // @see https://github.com/testing-library/react-testing-library/issues/93#issuecomment-403887769
    Object.defineProperty(input, 'files', {
      value: [file],
    })

    fireEvent.change(input)
  })

  expect(testIsRejected).toBeTruthy()
  expect(testErrorMessage).toEqual('The file already exists.')
})
