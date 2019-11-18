import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { useFilesDispatch, Actions, useFilesState } from '../store/FileStore'
import { useApiContext } from '../api/ApiContext'
import {
  isValidFile,
  fileAlreadyExists,
} from '../store/validators/FileValidator'

import { limitToReadOnlyAsyncState } from '../utils/useAsyncStateShape'

const FileUpload = (props) => {
  // get dispatch from store
  const dispatch = useFilesDispatch()
  const { files: existingFilesList } = useFilesState()

  const fileInput = useRef(undefined)

  // set up upload API
  const api = useApiContext()
  const uploadFileState = api.uploadFile()
  const onFileUpload = ({ data: file }) => {
    if (!isValidFile(file)) {
      throw new Error('Invalid file returned from Server')
    }

    if (fileAlreadyExists(existingFilesList, file)) {
      throw new Error('File returned from server already exists')
    }

    dispatch({
      type: Actions.ADD_FILE,
      payload: { file },
    })
  }

  const { run: uploadFile, setError } = uploadFileState

  // input props
  const { accept, maxFileSize, multiple, disabled } = props

  // TODO validators could also be passed via prop and some middleware pattern.
  const validateFile = (file) => {
    if (!accept.includes(file.type)) {
      throw new Error('The given file type is not allowed.')
    }

    if (file.size > maxFileSize) {
      throw new Error('The given file is to large.')
    }

    return true
  }

  const handleInputChange = (event) => {
    const { files } = event.target
    const [file] = files

    if (!file) {
      return
    }

    try {
      validateFile(file)
    } catch (error) {
      setError(error)
      return
    }

    const data = new FormData()
    data.append('file', file)

    uploadFile(data, { onResolve: onFileUpload })
  }

  const onOpenFileSelector = (event) => {
    event.preventDefault()

    if (disabled) {
      return
    }

    fileInput.current.click()
  }

  const readOnlyUploadState = limitToReadOnlyAsyncState({ ...uploadFileState })

  return (
    <form>
      <input
        type="file"
        ref={fileInput}
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        required
      />
      {React.cloneElement(props.children, {
        openFileSelector: onOpenFileSelector,
        uploadState: readOnlyUploadState,
        disabled,
      })}
    </form>
  )
}

FileUpload.propTypes = {
  accept: PropTypes.arrayOf(PropTypes.string).isRequired,
  maxFileSize: PropTypes.number.isRequired,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.element.isRequired,
}

FileUpload.defaultProps = {
  multiple: false,
  disabled: false,
}

export default FileUpload
