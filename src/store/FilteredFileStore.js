import React, { createContext, useContext, useReducer } from 'react'
import PropTypes from 'prop-types'

import { useFilesState } from './FileStore'
import { fileAlreadyExists, isValidFile } from './validators/FileValidator'

const Actions = {
  SET_FILTER: 'SET_FILTER',
  DISABLE_FILTER: 'DISABLE_FILTER',
}

const defaultState = {
  filteredFileIds: [],
  query: '',
  isActive: false,
}

const filteredFileReducer = (state, action) => {
  const { payload, type } = action

  switch (type) {
    case Actions.SET_FILTER: {
      const { query, filteredFiles } = payload

      if (!filteredFiles || !Array.isArray(filteredFiles)) {
        return state
      }

      const validFilteredFileIds = filteredFiles.reduce(
        (accumulator, candidate) => {
          if (!isValidFile(candidate)) {
            return accumulator
          }

          return [...accumulator, candidate]
        },
        []
      )

      return {
        ...state,
        filteredFileIds: validFilteredFileIds,
        query,
        isActive: true,
      }
    }

    default:
    case Actions.DISABLE_FILTER: {
      return {
        ...state,
        filteredFileIds: [],
        query: '',
        isActive: false,
      }
    }
  }
}

const FilteredFilesStateContext = createContext(undefined)
const FilteredFilesDispatchContext = createContext(undefined)

const getFilteredFiles = (filteredIds, files) => {
  return filteredIds.reduce((accumulator, filteredFile) => {
    const { id: filteredId } = filteredFile

    const foundFile = files.find((file) => {
      const { id: fileId } = file

      return filteredId === fileId
    })

    console.log(foundFile)

    if (!foundFile) {
      return accumulator
    }

    return [...accumulator, foundFile]
  }, [])
}

// TODO documentation
const FilteredFilesProvider = ({ children, state: initialState }) => {
  const { files } = useFilesState()
  const [filteredState, dispatch] = useReducer(filteredFileReducer, {
    ...defaultState,
    ...initialState,
  })

  const filteredFiles = {
    files: filteredState.isActive
      ? getFilteredFiles(filteredState.filteredFileIds, files)
      : files,
    isActive: filteredState.isActive,
    query: filteredState.query,
  }

  return (
    <FilteredFilesStateContext.Provider value={filteredFiles}>
      <FilteredFilesDispatchContext.Provider value={dispatch}>
        {children}
      </FilteredFilesDispatchContext.Provider>
    </FilteredFilesStateContext.Provider>
  )
}

FilteredFilesProvider.propTypes = {
  children: PropTypes.node,
  initialState: PropTypes.object,
}

const useFilteredFilesState = () => {
  const context = useContext(FilteredFilesStateContext)

  if (context === undefined) {
    throw new Error(
      'useFilteredFilesState must be used within a FilteredFilesProvider'
    )
  }
  return context
}

function useFilteredFilesDispatch() {
  const context = useContext(FilteredFilesDispatchContext)

  if (context === undefined) {
    throw new Error(
      'useFilteredFilesDispatch must be used within a FilteredFilesProvider'
    )
  }
  return context
}

export {
  FilteredFilesProvider,
  useFilteredFilesState,
  useFilteredFilesDispatch,
  Actions,
}
