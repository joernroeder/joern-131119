import React from 'react'

import useReadableFileSize from '../hooks/format/useReadableFileSize'
import useApi, { RequestStatus } from '../hooks/useApi'

import { Actions, useFilesDispatch, useFilesState } from '../store/FileStore'
//import {useFilteredFilesState} from "../store/FilteredFileStore";

import File from './File'

const FilesList = () => {
  const { files, loaded } = useFilesState()
  const dispatch = useFilesDispatch()

  const [{ status, error }, refresh] = useApi(
    {
      url: '/files',
    },
    {
      onSuccess: (files) => {
        dispatch({ type: Actions.ADD_FILES, payload: { files } })
      },
    }
  )

  console.log(files, loaded)
  console.log(status, error)

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

    return <File key={id} id={id} name={name} size={size} />
  })

  if (status === RequestStatus.LOADING) {
    return <div className="text-center py-10">Loading...</div>
  }

  if (status === RequestStatus.ERROR) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl mb-4">{error}</h2>
        <button className="bg-red-900 text-white px-4 py-1" onClick={refresh}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <section className="px-5 pb-5">
      <header className="md:flex justify-between items-baseline mb-5">
        <h1 className="text-3xl md:text-4xl lg:text-5xl">
          {filesCount
            ? `${filesCount} ${filesCount === 1 ? 'document' : 'documents'}`
            : 'No documents'}
        </h1>
        <div className="text-lg">Total size: {readableTotalFileSize}</div>
      </header>

      <section className="flex flex-wrap -mx-2">
        {files.length ? fileComponents : <div className="">Nothing here.</div>}
      </section>
    </section>
  )
}

export default FilesList
