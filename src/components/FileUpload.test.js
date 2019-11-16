import React from 'react'
import { renderWithApiAndFileProviders, fireEvent, act } from 'test-utils'

import FileUpload from './FileUpload'

const uploadProps = {
  accept: ['image/jpeg'],
  maxFileSize: 1e6, // 1mb
}

test('it should render correctly', () => {
  const { container } = renderWithApiAndFileProviders(
    <FileUpload {...uploadProps}>
      <button>Upload</button>
    </FileUpload>
  )

  expect(container).toMatchSnapshot()
})

test('the file input should be invisible', () => {
  const { container } = renderWithApiAndFileProviders(
    <FileUpload {...uploadProps}>
      <button>Upload</button>
    </FileUpload>
  )

  const input = container.querySelector('input')

  expect(input).toHaveClass('hidden')
})

test('a click on the child should open the file selector', () => {
  const { container, getByText } = renderWithApiAndFileProviders(
    <FileUpload {...uploadProps}>
      <button>Upload</button>
    </FileUpload>
  )

  const input = container.querySelector('input')
  act(() => {
    input.onclick = jest.fn()
    fireEvent.click(getByText('Upload'))
  })

  expect(input.onclick).toHaveBeenCalledTimes(1)
})

test('it should correctly call the onValidationHandler', () => {
  const onValidationError = jest.fn()

  const { container } = renderWithApiAndFileProviders(
    <FileUpload {...uploadProps} onValidationError={onValidationError}>
      <button>Upload</button>
    </FileUpload>
  )

  const input = container.querySelector('input')

  act(() => {
    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    })

    // @see https://github.com/testing-library/react-testing-library/issues/93#issuecomment-403887769
    Object.defineProperty(input, 'files', {
      value: [file],
    })

    fireEvent.change(input)
  })

  expect(onValidationError).toHaveBeenCalledTimes(1)
  expect(onValidationError.mock.calls[0][0]).toBe(
    'The given file type is not allowed.'
  )
})

test('it should correctly call the onValidationHandler if the file exceeds the limit', () => {
  const onValidationError = jest.fn()
  const maxFileSize = 9 // 9 bytes

  const { container } = renderWithApiAndFileProviders(
    <FileUpload
      {...uploadProps}
      maxFileSize={maxFileSize}
      onValidationError={onValidationError}
    >
      <button>Upload</button>
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

  expect(onValidationError).toHaveBeenCalledTimes(1)
  expect(onValidationError.mock.calls[0][0]).toBe('The given file is to large.')
})

test('it should correctly send the file', async () => {
  const onValidationError = jest.fn()
  const { container } = renderWithApiAndFileProviders(
    <FileUpload {...uploadProps} onValidationError={onValidationError}>
      <button>Upload</button>
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

  expect(onValidationError).not.toBeCalled()

  const [uri, opts] = fetch.mock.calls[0]
  const { body: formData } = opts

  expect(formData.getAll('file')).toHaveLength(1)
  expect(formData.get('file')).toBe(file)
})
