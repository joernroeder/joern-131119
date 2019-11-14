import React, { useCallback, useEffect, useState } from 'react'

import useReadableFileSize from '../hooks/format/useReadableFileSize'

import { Actions, useFilesDispatch } from '../store/FileStore'
import { useFilteredFilesState } from '../store/FilteredFileStore'
import {
  useApiContext,
  IfPending,
  IfFulfilled,
  IfRejected,
} from '../api/ApiContext'

import File from './File'

const FilesList = () => {
  // get (filtered) files and dispatch from store
  const { files } = useFilteredFilesState()
  const dispatch = useFilesDispatch()

  // fetch the API, dispatching new items to the store on success
  const api = useApiContext()

  const fetchFilesState = api.fetchFiles({
    onResolve: ({ data }) => {
      dispatch({ type: Actions.ADD_FILES, payload: { files: data } })
    },
  })

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
  return (
    <>
      <IfPending state={fetchFilesState}>
        <div className="text-center py-10">Loading...</div>
      </IfPending>

      <IfRejected state={fetchFilesState}>
        <div className="text-center py-10">
          <h2 className="text-xl mb-4">
            {fetchFilesState.error
              ? fetchFilesState.error.message
              : 'An unspecified error occurred'}
          </h2>
          <button
            type="button"
            className="bg-red-900 text-white px-4 py-1"
            onClick={fetchFilesState.reload}
          >
            Try Again
          </button>
        </div>
      </IfRejected>

      <IfFulfilled state={fetchFilesState}>
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
      </IfFulfilled>
    </>
  )
}

export default FilesList
