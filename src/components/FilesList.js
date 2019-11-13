import React, { useCallback, useEffect, useState } from 'react'

import useReadableFileSize from '../hooks/format/useReadableFileSize'

import { Actions, useFilesDispatch } from '../store/FileStore'
import { useFilteredFilesState } from '../store/FilteredFileStore'
import { useApiContext, ApiStatus } from '../api/ApiContext'

import File from './File'

const FilesList = () => {
  // get (filtered) files and dispatch from store
  const { files } = useFilteredFilesState()
  const dispatch = useFilesDispatch()

  // fetch the API, dispatching new items to the store on success
  const api = useApiContext()
  const [status, setStatus] = useState('LOADING')
  const [error, setError] = useState(undefined)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    setStatus(ApiStatus.LOADING)

    const cancelToken = api.getCancelToken()
    let isCanceled = false

    api
      .getFiles({ cancelVia: cancelToken })
      .then((data) => {
        if (isCanceled) {
          return
        }

        dispatch({ type: Actions.ADD_FILES, payload: { files: data } })
        setStatus(ApiStatus.SUCCESS)
      })
      .catch((error) => {
        if (isCanceled) {
          return
        }

        setError(error.message)
        setStatus(ApiStatus.ERROR)
      })

    return () => {
      cancelToken.cancel()
      isCanceled = true
    }
  }, [api, dispatch, refresh])

  const fetchAgain = useCallback(() => {
    setRefresh(refresh + 1)
  }, [refresh])

  // setting up dynamic content

  const filesCount = files.length
  const totalFileSize = files.reduce((total, file) => {
    const { size } = file.attributes

    if (!size || isNaN(size)) {
      return total
    }

    return total + size
  }, 0)
  const readableTotalFileSize = useReadableFileSize(totalFileSize)

  const fileComponents = files.map((file) => {
    const { id, attributes } = file
    const { name, size } = attributes

    try {
      return <File key={id} id={id} name={name} size={size} />
    } catch (error) {
      return null
    }
  })

  // render based on api response

  if (status === ApiStatus.LOADING) {
    return <div className="text-center py-10">Loading...</div>
  }

  if (status === ApiStatus.ERROR) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl mb-4">{error}</h2>
        <button
          type="button"
          className="bg-red-900 text-white px-4 py-1"
          onClick={fetchAgain}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <section className="px-5 pb-5 sm:px-0">
      <header className="md:flex justify-between items-baseline mb-5">
        <h1 className="text-3xl md:text-4xl lg:text-5xl">
          {filesCount
            ? `${filesCount} ${filesCount === 1 ? 'document' : 'documents'}`
            : 'No documents'}
        </h1>
        <div className="text-lg">Total size: {readableTotalFileSize}</div>
      </header>

      <section className="flex flex-wrap -mx-2">
        {files.length ? (
          fileComponents
        ) : (
          <div className="mx-2">Nothing here.</div>
        )}
      </section>
    </section>
  )
}

export default FilesList
