import React, { createContext, useContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import ValidationError, {
  ValidationErrorCodes,
} from '../errors/ValidationError'
import { isValidFile, fileAlreadyExists } from './validators/FileValidator'

const Actions = {
  ADD_FILE: 'ADD_FILE',
  ADD_FILES: 'ADD_FILES',
  DELETE_FILE: 'DELETE_FILE',
}

const defaultState = {
  files: [],
}

const testAndGetPayloadKey = (action, key) => {
  const { type, payload } = action
  if (!payload || payload[key] === undefined) {
    throw new ValidationError(
      `Action ${type} requires a payload with key ${key}`,
      ValidationErrorCodes.INVALID_DATA_FORMAT
    )
  }

  return payload[key]
}

const fileValidation = (state, dispatch) => {
  return (action) => {
    const { type } = action

    switch (action.type) {
      case Actions.ADD_FILES: {
        const files = testAndGetPayloadKey(action, 'files')

        if (!Array.isArray(files)) {
          throw new ValidationError(
            `${action.type} expects a file array as payload`,
            ValidationErrorCodes.INVALID_DATA_FORMAT
          )
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

        return dispatch({ type, payload: { files: validFiles } })
      }

      case Actions.ADD_FILE: {
        const file = testAndGetPayloadKey(action, 'file')

        if (!isValidFile(file)) {
          throw new ValidationError(
            `${action.type} received an invalid file object`,
            ValidationErrorCodes.INVALID_DATA_FORMAT
          )
        }

        if (fileAlreadyExists(state.files, file)) {
          throw new ValidationError(
            `The file given to ${action.type} already exists.`,
            ValidationErrorCodes.DUPLICATE_ENTRY
          )
        }

        return dispatch({ type, payload: { file } })
      }

      case Actions.DELETE_FILE: {
        const id = testAndGetPayloadKey(action, 'id')

        const fileIndex = state.files.findIndex((file) => {
          return file.id === id
        })

        // id not found in files list. returning...
        if (fileIndex === -1) {
          throw new ValidationError(`No file with the given id found. ${id}`)
        }

        return dispatch(action)
      }

      default: {
        return dispatch(action)
      }
    }
  }
}

const fileReducer = (state, action) => {
  switch (action.type) {
    case Actions.ADD_FILES: {
      const { files } = action.payload

      return {
        ...state,
        files: [...state.files, ...files],
      }
    }

    case Actions.ADD_FILE: {
      const { payload } = action
      const { file } = payload

      return {
        ...state,
        files: [...state.files, file],
      }
    }

    case Actions.DELETE_FILE: {
      const { id } = action.payload

      const updatedFiles = state.files.filter((file) => {
        return file.id !== id
      })

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
      <FilesDispatchContext.Provider value={fileValidation(state, dispatch)}>
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
