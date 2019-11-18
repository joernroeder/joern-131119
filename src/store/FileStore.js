import React, { createContext, useContext, useReducer } from 'react'
import { isValidFile, fileAlreadyExists } from './validators/FileValidator'
import PropTypes from 'prop-types'

const Actions = {
  ADD_FILE: 'ADD_FILE',
  ADD_FILES: 'ADD_FILES',
  DELETE_FILE: 'DELETE_FILE',
}

const defaultState = {
  files: [],
}

const fileReducer = (state, action) => {
  switch (action.type) {
    case Actions.ADD_FILES: {
      const { files } = action.payload

      if (!files || !Array.isArray(files)) {
        return state
      }

      const validFiles = files.reduce((accumulator, candidate) => {
        if (!isValidFile(candidate)) {
          return accumulator
        }

        if (fileAlreadyExists(state.files, candidate)) {
          return accumulator
        }

        return [...accumulator, candidate]
      }, [])

      return {
        ...state,
        files: [...state.files, ...validFiles],
      }
    }

    case Actions.ADD_FILE: {
      const { payload } = action
      const { file } = payload

      if (!isValidFile(file)) {
        return state
      }

      if (fileAlreadyExists(state.files, file)) {
        return state
      }

      return {
        ...state,
        files: [...state.files, file],
      }
    }

    case Actions.DELETE_FILE: {
      const { id } = action.payload

      const fileIndex = state.files.findIndex((file) => {
        return file.id === id
      })

      // id not found in files list. returning...
      if (fileIndex === -1) {
        return state
      }

      const updatedFiles = [...state.files]
      updatedFiles.splice(fileIndex, 1)

      return {
        ...state,
        files: updatedFiles,
      }
    }

    default:
      return state
  }
}

const FilesStateContext = createContext(undefined)
const FilesDispatchContext = createContext(undefined)

const FilesProvider = ({ children, state: initialState }) => {
  const [state, dispatch] = useReducer(fileReducer, {
    ...defaultState,
    ...initialState,
  })

  return (
    <FilesStateContext.Provider value={state}>
      <FilesDispatchContext.Provider value={dispatch}>
        {children}
      </FilesDispatchContext.Provider>
    </FilesStateContext.Provider>
  )
}

FilesProvider.propTypes = {
  children: PropTypes.node,
  state: PropTypes.object,
}

const useFilesState = () => {
  const context = useContext(FilesStateContext)

  if (context === undefined) {
    throw new Error('useFilesState must be used within a FilesProvider')
  }
  return context
}

function useFilesDispatch() {
  const context = useContext(FilesDispatchContext)

  if (context === undefined) {
    throw new Error('useFilesDispatch must be used within a FilesProvider')
  }
  return context
}

export { FilesProvider, useFilesState, useFilesDispatch, Actions }
