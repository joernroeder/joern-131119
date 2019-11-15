import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import 'jest-prop-type-error'
import fetchMock from 'jest-fetch-mock'

import { render } from '@testing-library/react'

import { FilesProvider } from '../store/FileStore'
import { FilteredFilesProvider } from '../store/FilteredFileStore'
import { ApiProvider } from '../api/ApiContext'

global.fetch = fetchMock

const WithFilesProvider = ({ children }) => {
  return (
    <FilesProvider>
      <FilteredFilesProvider>{children}</FilteredFilesProvider>
    </FilesProvider>
  )
}

const WithApiAndFilesProvider = ({ children }) => {
  return (
    <ApiProvider>
      <WithFilesProvider>{children}</WithFilesProvider>
    </ApiProvider>
  )
}

const renderWithFilesProviders = (ui, options) => {
  return render(ui, { wrapper: WithFilesProvider, ...options })
}

const renderWithApiAndFileProviders = (ui, options) => {
  return render(ui, { wrapper: WithApiAndFilesProvider, ...options })
}

// re-export everything
export * from '@testing-library/react'

// override render method
export { renderWithFilesProviders, renderWithApiAndFileProviders }
