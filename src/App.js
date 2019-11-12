import React from 'react'
import './tailwind.build.css'

import { FilesProvider } from './store/FileStore'

import AppHeader from './components/AppHeader'
import FilesList from './components/FilesList'

function App() {
  return (
    <main>
      <FilesProvider>
        <AppHeader />

        <FilesList />
      </FilesProvider>
    </main>
  )
}

export default App
