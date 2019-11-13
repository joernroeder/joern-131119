import React, { createContext, useContext, useReducer } from 'react'
import { useFilesState } from './FileStore'

const Actions = {
  SET_FILTER: 'SET_FILTER',
  DISABLE_FILTER: 'DISABLE_FILTER',
}

const initialState = {
  filteredFiles: [],
  query: '',
  isActive: false,
}

const filteredFileReducer = (state, action) => {
  const { payload, type } = action

  switch (type) {
    case Actions.SET_FILTER: {
      const { query, filteredFiles } = payload

      return {
        ...state,
        filteredFiles,
        query,
        isActive: true,
      }
    }

    default:
    case Actions.DISABLE_FILTER: {
      return {
        ...state,
        ...initialState,
      }
    }
  }
}

const FilteredFilesStateContext = createContext(undefined)
const FilteredFilesDispatchContext = createContext(undefined)

// todo documentation
const FilteredFilesProvider = ({ children }) => {
  const { files } = useFilesState()
  const [filteredState, dispatch] = useReducer(
    filteredFileReducer,
    initialState
  )

  const filteredFiles = {
    files: filteredState.isActive ? filteredState.filteredFiles : files,
    isActive: filteredState.isActive,
    query: filteredState.query,
  }

  console.log(filteredFiles)

  return (
    <FilteredFilesStateContext.Provider value={filteredFiles}>
      <FilteredFilesDispatchContext.Provider value={dispatch}>
        {children}
      </FilteredFilesDispatchContext.Provider>
    </FilteredFilesStateContext.Provider>
  )
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
