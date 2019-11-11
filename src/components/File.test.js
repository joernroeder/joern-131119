import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'

import File from './File'

test('delete button should exist', () => {
  const props = {
    id: 'someId',
    name: 'fileName',
    size: 0,
  }

  const { queryByText } = render(<File {...props} />)

  expect(queryByText('delete')).toBeInTheDocument()
})
