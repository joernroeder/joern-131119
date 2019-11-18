import React from 'react'
import PropTypes from 'prop-types'
import { ReadOnlyAsyncStateShape } from '../utils/useAsyncStateShape'

import useExpire from '../hooks/useExpire'

const UploadButton = ({
  openFileSelector = () => {},
  uploadState = {},
  ...props
}) => {
  const {
    message: notification,
    isVisible: hasNotification,
    reset: resetNotification,
    setMessage,
  } = useExpire({ expiryOffsetInMilliSeconds: 5000 })

  const { isPending, isRejected, isFulfilled, error, finishedAt } = uploadState

  if (isPending) {
    return (
      <div className="block w-full uppercase text-lg border border-blue-600 bg-blue-100 py-1 sm:px-10">
        Uploading...
      </div>
    )
  }

  if (isRejected) {
    setMessage({ message: error.message, startDate: finishedAt })
  }

  if (isFulfilled) {
    setMessage({
      message: 'File successfully uploaded',
      startDate: finishedAt,
      offsetInMilliSeconds: 5000,
    })
  }

  if (isRejected && hasNotification) {
    return (
      <div className="text-lg text-red-500 font-bold">
        {notification}{' '}
        <button
          type="button"
          className="bg-red-500 text-white p-1 px-3"
          onClick={resetNotification}
        >
          ok
        </button>
      </div>
    )
  }

  if (isFulfilled && hasNotification) {
    return (
      <div className="text-lg text-green-500 font-bold">{notification}</div>
    )
  }

  return (
    <button
      onClick={openFileSelector}
      disabled={isPending || props.disabled}
      type="button"
      className="block w-full uppercase text-lg border border-blue-900 bg-blue-400 hover:bg-blue-900 hover:text-white active:bg-blue-900 active:text-white py-1 sm:px-10"
      {...props}
    >
      Upload
    </button>
  )
}

UploadButton.propTypes = {
  openFileSelector: PropTypes.func,
  disabled: PropTypes.bool,
  uploadState: PropTypes.shape(ReadOnlyAsyncStateShape),
}

export default UploadButton
