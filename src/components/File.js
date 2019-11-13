import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'

import useReadableFileSize from '../hooks/format/useReadableFileSize'
import { useApiContext, ApiStatus } from '../api/ApiContext'
import { useFilesDispatch, Actions } from '../store/FileStore'

const File = ({ id, name, size }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const dispatch = useFilesDispatch()
  const readableSize = useReadableFileSize(size)

  const api = useApiContext()
  const [status, setStatus] = useState(undefined)
  const [cancelToken, _] = useState(api.getCancelToken())
  let [isCanceled, setIsCanceled] = useState(false)

  useEffect(() => {
    return () => {
      cancelToken.cancel()
      setIsCanceled(true)
    }
  }, [cancelToken])

  const onDeleteClick = useCallback(
    (event) => {
      event.preventDefault()

      setIsDeleting(true)
      setStatus(ApiStatus.LOADING)

      api
        .deleteFile({ withId: id, cancelVia: cancelToken })
        .then((file) => {
          if (isCanceled) {
            return
          }
          console.log(file)

          dispatch({ type: Actions.DELETE_FILE, payload: { id } })
          setStatus(ApiStatus.SUCCESS)
        })
        .catch(() => {
          if (isCanceled) {
            return
          }
          setStatus(ApiStatus.ERROR)
        })
    },
    [api, cancelToken, isCanceled, dispatch, id]
  )

  if (!id) {
    return null
  }

  return (
    <article
      className="w-full sm:w-1/2 md:w-1/3 px-2 pb-4"
      style={{ opacity: isDeleting ? 0.5 : 1 }}
    >
      <div className="border p-4 h-full">
        <h2 className="text-2xl mb-2 overflow-hidden">{name}</h2>
        <div className="flex justify-between items-baseline">
          <div className="mr-4">{readableSize}</div>
          <div>
            <button
              type="button"
              className="text-sm border border-blue-900 bg-blue-400 hover:bg-blue-900 hover:text-white focus:bg-blue-900 focus:text-white disabled:text-gray-900 disabled:bg-gray-400 disabled:cursor-default py-1 px-4"
              onClick={onDeleteClick}
              disabled={isDeleting}
            >
              delete
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

File.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
}

export default File
