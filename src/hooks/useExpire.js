import React, { useState, useEffect } from 'react'

const useExpire = ({
  message: initialMessage = '',
  expiresAt: initialExpiryTimestamp = '',
  expiryOffsetInMilliSeconds = 100,
}) => {
  const [message, setMessage] = useState(initialMessage)
  const [isVisible, setIsVisible] = useState(false)
  const [expiresAt, setExpiryTimestamp] = useState(initialExpiryTimestamp)
  const [startedAt, setStartedAt] = useState(undefined)

  const reset = () => {
    setMessage('')
    setIsVisible(false)
    setStartedAt(undefined)
    setExpiryTimestamp(Date.now())
  }

  const setMessageAndExpiryTimestamp = ({
    message,
    startDate = new Date(),
    offsetInMilliSeconds = undefined,
  }) => {
    const expireTimestamp =
      startDate.getTime() + (offsetInMilliSeconds || expiryOffsetInMilliSeconds)

    if (expireTimestamp === expiresAt) {
      return
    }

    setExpiryTimestamp(expireTimestamp)
    setMessage(message)
  }

  useEffect(() => {
    setIsVisible(true)
    setStartedAt(Date.now())
  }, [message, expiresAt])

  useEffect(() => {
    const isExpired = (date) => {
      return Date.now() > date + expiryOffsetInMilliSeconds
    }

    if (!expiresAt) {
      return
    }

    let timeCheck = setInterval(() => {
      if (isExpired(expiresAt)) {
        setIsVisible(false)
        clearInterval(timeCheck)
      }
    }, 100)

    return () => {
      clearInterval(timeCheck)
    }
  }, [message, expiresAt, expiryOffsetInMilliSeconds])

  return {
    message,
    isVisible,
    startedAt,
    expiresAt,
    reset,
    setMessage: setMessageAndExpiryTimestamp,
  }
}

export default useExpire
