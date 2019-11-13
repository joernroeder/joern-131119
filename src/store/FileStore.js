import React, { createContext, useContext, useReducer } from 'react'

const Actions = {
  ADD_FILE: 'ADD_FILE',
  ADD_FILES: 'ADD_FILES',
  DELETE_FILE: 'DELETE_FILE',
}

const initialState = {
  files: [],
}

// TODO test schema
const isValidFile = (state, file) => {
  const { id } = file

  const fileIndex = state.files.findIndex((stateFile) => {
    return stateFile.id === id
  })

  // id already exists in in the list. returning...
  if (fileIndex !== -1) {
    return false
  }

  return true
}

const fileReducer = (state, action) => {
  switch (action.type) {
    case Actions.ADD_FILES: {
      const { files } = action.payload

      const validFiles = files.reduce((accumulator, candidate) => {
        if (!isValidFile(state, candidate)) {
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

      if (!isValidFile(state, file)) {
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

const FilesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(fileReducer, initialState)

  return (
    <FilesStateContext.Provider value={state}>
      <FilesDispatchContext.Provider value={dispatch}>
        {children}
      </FilesDispatchContext.Provider>
    </FilesStateContext.Provider>
  )
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
