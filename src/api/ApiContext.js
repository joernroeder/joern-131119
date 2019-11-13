import React, { useContext } from 'react'
import axios from 'axios'

import getFiles from './modules/getFiles'
import getFilteredFiles from './modules/getFilteredFiles'
import uploadFile from './modules/uploadFile'
import deleteFile from './modules/deleteFile'

const modules = {
  getFiles,
  getFilteredFiles,
  uploadFile,
  deleteFile,
}

const defaultAxiosConfig = {
  baseURL: 'http://localhost:4000/',
  timeout: 1000,
}

const ApiStatus = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
}

const ApiContext = React.createContext(undefined)

const ApiProvider = ({ children, axiosConfig }) => {
  const config = Object.assign({}, defaultAxiosConfig, axiosConfig)
  const axiosInstance = axios.create(config)

  // inject axios instance into api modules
  let endpoints = {
    getCancelToken: () => axios.CancelToken.source(),
  }

  for (let [name, apiModule] of Object.entries(modules)) {
    endpoints[name] = apiModule(axiosInstance)
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

export { useApiContext, ApiProvider, ApiStatus }
