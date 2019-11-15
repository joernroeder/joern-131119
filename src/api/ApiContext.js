import React, { useContext } from 'react'
import PropTypes from 'prop-types'

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

const defaultApiConfig = {
  baseURL: 'http://localhost:4000',
  headers: { Accept: 'application/json' },
  timeout: 1000,
}

const ApiContext = React.createContext(undefined)

const ApiProvider = ({
  children,
  apiConfig: apiConfigOptions,
  endpoints: initialEndpoints,
}) => {
  const apiConfig = { ...defaultApiConfig, ...apiConfigOptions }
  let endpoints = { ...initialEndpoints }

  // add apiConfig to all apiModules
  for (let [name, apiModule] of Object.entries(apiModules)) {
    // skip endpoints which were already passed in via initialEndpoints
    if (endpoints[name]) {
      continue
    }

    endpoints[name] = apiModule(apiConfig)
  }

  return <ApiContext.Provider value={endpoints}>{children}</ApiContext.Provider>
}

ApiProvider.propTypes = {
  apiConfig: PropTypes.object,
  endpoints: PropTypes.objectOf(PropTypes.func),
  children: PropTypes.node.isRequired,
}

ApiProvider.defaultProps = {
  apiConfig: {},
  endpoints: {},
}

const useApiContext = () => {
  const context = useContext(ApiContext)

  if (context === undefined) {
    throw new Error('useApiContext must be used within an ApiProvider')
  }
  return context
}

export { useApiContext, ApiProvider, IfPending, IfFulfilled, IfRejected }
