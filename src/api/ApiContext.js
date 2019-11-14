import React, { useContext } from 'react'
import { IfPending, IfFulfilled, IfRejected } from 'react-async'

import fetchFiles from './modules/fetchFiles'
import fetchFilteredFiles from './modules/fetchFilteredFiles'
import uploadFile from './modules/uploadFile'
import deleteFile from './modules/deleteFile'

const apiModules = {
  fetchFiles,
  fetchFilteredFiles,
  uploadFile,
  deleteFile,
}

const apiConfig = {
  baseURL: 'http://localhost:4000',
  headers: { Accept: 'application/json' },
  timeout: 1000,
}

const ApiContext = React.createContext(undefined)

const ApiProvider = ({ children }) => {
  let endpoints = {}

  // add apiConfig to all apiModules
  for (let [name, apiModule] of Object.entries(apiModules)) {
    endpoints[name] = apiModule(apiConfig)
  }

  return <ApiContext.Provider value={endpoints}>{children}</ApiContext.Provider>
}

const useApiContext = () => {
  const context = useContext(ApiContext)

  if (context === undefined) {
    throw new Error('useApiContext must be used within an ApiProvider')
  }
  return context
}

export { useApiContext, ApiProvider, IfPending, IfFulfilled, IfRejected }
