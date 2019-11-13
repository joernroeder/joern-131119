import React from 'react'
import { renderWithApiAndFileProviders } from 'test-utils'

import AppHeader from './AppHeader'

test('upload button should exist', async () => {
  const { queryByText } = renderWithApiAndFileProviders(<AppHeader />)

  expect(queryByText('Upload')).toBeInTheDocument()
})

test('search field should exist', async () => {
  const { queryByPlaceholderText } = renderWithApiAndFileProviders(
    <AppHeader />
  )

  expect(queryByPlaceholderText(/Search documents/)).toBeInTheDocument()
})
