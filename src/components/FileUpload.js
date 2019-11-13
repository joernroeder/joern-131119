import React, { useState, useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useFilesDispatch, Actions } from '../store/FileStore'
import { useApiContext, ApiStatus } from '../api/ApiContext'

const FileUpload = (props) => {
  // get dispatch from store
  const dispatch = useFilesDispatch()

  const fileInput = useRef(undefined)

  // set up upload API
  const api = useApiContext()
  const [status, setStatus] = useState(undefined)
  const [cancelToken, _] = useState(api.getCancelToken())
  let [isCanceled, setIsCanceled] = useState(false)

  useEffect(() => {
    return () => {
      cancelToken.cancel()
    }
  }, [cancelToken])

  const startFileUpload = useCallback(
    (fileData) => {
      if (!fileData) {
        return
      }

      setStatus(ApiStatus.LOADING)

      api
        .uploadFile({ with: fileData, cancelVia: cancelToken })
        .then((file) => {
          console.log(file)
          dispatch({
            type: Actions.ADD_FILE,
            payload: { file },
          })
          setStatus(ApiStatus.SUCCESS)
        })
        .catch(() => {
          setStatus(ApiStatus.ERROR)
        })
    },
    [api, cancelToken, dispatch]
  )

  const { accept, maxFileSize, multiple, disabled } = props
  const { onValidationError } = props

  // TODO validators could also be passed via prop and some middleware pattern.
  const validateFile = (file) => {
    if (!accept.includes(file.type)) {
      throw new Error('The given file type is not allowed.')
    }

    console.log('file.size, maxFileSize', file.size, maxFileSize)
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
      if (onValidationError) {
        onValidationError(error.message)
      }
      return
    }

    const data = new FormData()
    data.append('file', file)

    startFileUpload(data)
  }

  const onOpenFileSelector = (event) => {
    event.preventDefault()

    if (disabled) {
      return
    }

    fileInput.current.click()
  }

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
        onClick: onOpenFileSelector,
        disabled: status === ApiStatus.LOADING,
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
  onValidationError: PropTypes.func,
}

FileUpload.defaultProps = {
  multiple: false,
  disabled: false,
}

export default FileUpload
