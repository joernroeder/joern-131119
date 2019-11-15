import React from 'react'

import FileUpload from './FileUpload'
import FileSearch from './FileSearch'
import UploadButton from './UploadButton'

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
          <UploadButton>Upload</UploadButton>
        </FileUpload>
      </div>

      <FileSearch className="sm:order-1" />
    </header>
  )
}

export default AppHeader
