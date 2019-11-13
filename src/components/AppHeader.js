import React from 'react'

import FileUpload from './FileUpload'
import FileSearch from './FileSearch'

const AppHeader = () => {
  const acceptMimeTypes = ['image/png', 'image/jpeg']
  const maxFileSize = 1e7 // 10mb
  const onValidationError = (reason) => alert(reason)

  return (
    <header className="sm:flex sm:justify-between p-5 sm:px-0">
      <div className="mb-4 sm:mb-0 sm:order-2">
        <FileUpload
          accept={acceptMimeTypes}
          maxFileSize={maxFileSize}
          onValidationError={onValidationError}
        >
          <button className="block w-full uppercase text-lg border border-blue-900 bg-blue-400 hover:bg-blue-900 hover:text-white focus:bg-blue-900 focus:text-white py-1 sm:px-10">
            Upload
          </button>
        </FileUpload>
      </div>

      <FileSearch />
    </header>
  )
}

export default AppHeader
