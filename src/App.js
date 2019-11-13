import React from 'react'
import './tailwind.build.css'

import { FilesProvider } from './store/FileStore'
import { FilteredFilesProvider } from './store/FilteredFileStore'

import AppHeader from './components/AppHeader'
import FilesList from './components/FilesList'
import { ApiProvider } from './api/ApiContext'

function App() {
  return (
    <main className="container mx-auto">
      <ApiProvider>
        <FilesProvider>
          <FilteredFilesProvider>
            <AppHeader />

            <FilesList />
          </FilteredFilesProvider>
        </FilesProvider>
      </ApiProvider>
    </main>
  )
}

export default App
