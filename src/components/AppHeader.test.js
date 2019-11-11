import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'

import AppHeader from './AppHeader'

test('upload button should exist', () => {
  const { queryByText } = render(<AppHeader />)

  expect(queryByText('Upload')).toBeInTheDocument()
})

test('search field should exist', () => {
  const { queryByPlaceholderText } = render(<AppHeader />)

  expect(queryByPlaceholderText(/Search documents/)).toBeInTheDocument()
})
