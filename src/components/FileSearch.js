import React, { useState, useEffect } from 'react'
import {
  useFilteredFilesDispatch,
  Actions,
  useFilteredFilesState,
} from '../store/FilteredFileStore'

import useDebounce from '../hooks/useDebounce'
import { useApiContext, ApiStatus } from '../api/ApiContext'

// TODO implement loading indicator and show errors
const FileSearch = () => {
  // debounced value
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 100)

  // get query and dispatch from filteredFiles State
  const { query } = useFilteredFilesState()
  const dispatch = useFilteredFilesDispatch()

  const api = useApiContext()

  useEffect(() => {
    // no need to fetch, already up to date
    if (debouncedValue === query) {
      return
    }

    // resetting query
    if (!debouncedValue && query) {
      dispatch({ type: Actions.DISABLE_FILTER })
      return
    }

    const cancelToken = api.getCancelToken()
    let isCanceled = false

    api
      .getFilteredFiles({ by: debouncedValue, cancelVia: cancelToken })
      .then(({ query, data }) => {
        if (isCanceled) {
          return
        }

        dispatch({
          type: Actions.SET_FILTER,
          payload: {
            query,
            filteredFiles: data,
          },
        })
      })
      .catch((error) => {
        if (isCanceled) {
          return
        }

        console.error(error)
      })

    // cancel request on unmount
    return () => {
      cancelToken.cancel()
      isCanceled = true
    }
  }, [api, debouncedValue, dispatch, query])

  const onInputChange = (event) => {
    setValue(event.target.value)
    event.preventDefault()
  }

  const onFormSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <form className="sm:order-1">
      <input
        type="search"
        className="border text-lg w-full px-4 py-1"
        placeholder="Search documents…"
        value={value}
        onChange={onInputChange}
      />
    </form>
  )
}

export default FileSearch
