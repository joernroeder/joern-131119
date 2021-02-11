import React from 'react'
import PropTypes from 'prop-types'

import useReadableFileSize from '../hooks/format/useReadableFileSize'

const File = ({ id, name, size, onDelete, isDeleting }) => {
  const readableSize = useReadableFileSize(size)

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
              onClick={() => onDelete(id)}
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
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
}

File.defaultProps = {
  isDeleting: false,
}

export default File
