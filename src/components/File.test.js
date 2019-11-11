import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'

import File from './File'

test('files without/with invalid id should be treated as invalid', () => {
  const props = {
    id: '',
    name: 'my-file-name.txt',
    size: 42,
  }

  const { container } = render(<File {...props} />)

  expect(container).toBeEmpty()
})

test('it should correctly show the file name', () => {
  const props = {
    id: 'someId',
    name: 'my-file-name.txt',
    size: 0,
  }

  const { queryByText } = render(<File {...props} />)

  expect(queryByText('my-file-name.txt')).toBeInTheDocument()
})

test('delete button should exist', () => {
  const props = {
    id: 'someId',
    name: 'fileName',
    size: 0,
  }

  const { queryByText } = render(<File {...props} />)

  expect(queryByText('delete')).toBeInTheDocument()
})
