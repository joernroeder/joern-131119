import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'

import File from './File'

test('delete button should exist', () => {
  const { queryByText } = render(<File />)

  expect(queryByText('delete')).toBeInTheDocument()
})
