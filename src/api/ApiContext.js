import React, { useContext } from 'react'
import { IfPending, IfFulfilled, IfRejected } from 'react-async'

import axios from 'axios'

import getFiles from './modules/getFiles'
import getFilteredFiles from './modules/getFilteredFiles'
import uploadFile from './modules/uploadFile'
import deleteFile from './modules/deleteFile'

import fetchFiles from './modules/fetchFiles'

const modules = {
  getFiles,
  getFilteredFiles,
  uploadFile,
  deleteFile,
}

const apiConfig = {
  baseURL: 'http://localhost:4000',
  headers: { Accept: 'application/json' },
  timeout: 1000,
}

const ApiStatus = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
}

const ApiContext = React.createContext(undefined)

const ApiProvider = ({ children, axiosConfig }) => {
  let endpoints = {
    getCancelToken: () => axios.CancelToken.source(),
    fetchFiles: fetchFiles(apiConfig),
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

export {
  useApiContext,
  ApiProvider,
  ApiStatus,
  IfPending,
  IfFulfilled,
  IfRejected,
}
