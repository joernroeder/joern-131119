import React, { useState, useEffect } from 'react'
import {
  useFilteredFilesDispatch,
  Actions,
  useFilteredFilesState,
} from '../store/FilteredFileStore'

import useDebounce from '../hooks/useDebounce'
import { useApiContext } from '../api/ApiContext'

// TODO implement loading indicator and show errors
const FileSearch = () => {
  // debounced value
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 100)
  // stores value sent to the api
  const [valueSent, setValueSent] = useState('')

  // get query and dispatch from filteredFiles State
  const { query } = useFilteredFilesState()
  const dispatch = useFilteredFilesDispatch()

  const api = useApiContext()
  const { run, cancel } = api.fetchFilteredFiles({
    defer: true,
    onResolve: ({ data }) => {
      dispatch({
        type: Actions.SET_FILTER,
        payload: {
          query: valueSent, // <- use of valueSent
          filteredFiles: data,
        },
      })
    },
  })

  useEffect(() => {
    if (debouncedValue === valueSent) {
      return
    }

    // cancel running requests.
    cancel()

    // resetting query
    if (!debouncedValue && query) {
      dispatch({ type: Actions.DISABLE_FILTER })
      return
    }

    run((init) => {
      return {
        ...init,
        resource: init.resource + encodeURIComponent(debouncedValue),
      }
    })
    setValueSent(debouncedValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, query])

  const onInputChange = (event) => {
    setValue(event.target.value)
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
