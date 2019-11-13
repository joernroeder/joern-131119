import React from 'react'

const UploadButton = ({ disabled, onClick, children }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type="button"
      className="block w-full uppercase text-lg border border-blue-900 bg-blue-400 hover:bg-blue-900 hover:text-white active:bg-blue-900 active:text-white py-1 sm:px-10"
    >
      {children}
    </button>
  )
}

export default UploadButton
