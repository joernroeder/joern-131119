import { useReducer, useEffect, useState, useRef } from 'react'
import axios, { CancelToken } from 'axios'

const axiosInstance = axios.create({
  // TODO get from config or env
  baseURL: 'http://localhost:4000/',
  timeout: 1000,
})

// Reducer actions to change between request status
const FETCH_START = 'FETCH_START'
const FETCH_SUCCESS = 'FETCH_SUCCESS'
const FETCH_ERROR = 'FETCH_ERROR'

// public status codes
export const RequestStatus = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
}

// debugging
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function useFetchStateReducer(state, action) {
  const { type } = action

  switch (type) {
    case FETCH_START: {
      return {
        ...state,
        status: RequestStatus.LOADING,
      }
    }

    case FETCH_SUCCESS: {
      const { payload } = action

      return {
        ...state,
        data: payload,
        error: null,
        status: RequestStatus.SUCCESS,
      }
    }

    case FETCH_ERROR: {
      const { payload } = action

      return {
        ...state,
        data: null,
        error: payload,
        status: RequestStatus.ERROR,
      }
    }

    default: {
      throw new Error(`Unknown action type ${type} given.`)
    }
  }
}

const defaultRequestOptions = {
  url: '',
  method: 'GET',
  data: {},
}

const defaultOptions = {
  onSuccess: () => {},
  //onError: () => {},
  loadImmediately: true,
}

/**
 * A hook to make asynchronous api calls to a set of API endpoints in a more declarative way –
 * without exposing too much complexity.
 *
 * `useApi` hook takes care of canceling requests on component unmount. It returns the state of the current request as
 * well as a `refresh` function, which can be used to (re)call the API.
 *
 * @example
 *  const [{ status, data, error }, refresh] = useApi({
 *    url: '/files',
 *  })
 *
 * When fetching data from an api you often want to do three things:
 *
 * 1. visualize loading status (loading, success, error) in the component triggering the request
 * 2. update some global state whenever the request succeeds or fails.
 * 3. Decide whether the request is send on mount, manually or both.
 *
 * To effectively compare request statuses in you component use the `RequestStatus` enum as shown below:
 *
 * @example
 *  import useApi, { RequestStatus } from './hooks/useApi'
 *
 *  const [{ status, data, error }, refresh] = useApi({
 *    url: '/files',
 *  })
 *
 *  if (status === RequestStatus.LOADING) {
 *    return <div>Loading...</div>
 *  }
 *
 * `useApi` accepts additional options and provides a `onSuccess` and `onError` callback.
 * These callbacks can be used to interact with other parts of the application like dispatching actions to
 * update global state, persist data etc.
 *
 * @example
 *  const [{ status, data, error }, refresh] = useApi({
 *    url: '/files',
 *  }, {
 *    onSuccess: (data) => dispatch({ type: 'LOADED', payload: data }),
 *    onError: (error) => dispatch({ type: 'FAILED', payload: error })
 *  })
 *
 *  To suppress a request on component mount set the `loadImmediately` option to `false`. You are able to trigger
 *  requests by calling the `refresh` method provided by the hook later at any time.
 *
 *  @example
 *  const [{ status, data, error }, refresh] = useApi({
 *    url: '/files',
 *  }, {
 *    loadImmediately: false
 *  })
 *
 *  const someEventHandler = (event) => {
 *    event.preventDefault()
 *    refresh()
 *  }
 *
 * @param {Object} requestOpts Axios request options @see https://github.com/axios/axios#request-config
 * @param opts { onSuccess, onError, loadImmediately}
 * @returns {[S, refresh]}
 */
const useApi = (requestOpts, opts) => {
  const requestOptions = Object.assign({}, defaultRequestOptions, requestOpts)
  const options = Object.assign({}, defaultOptions, opts)

  const [refreshIndex, setRefreshIndex] = useState(0)
  const { onSuccess, onError, loadImmediately } = options

  const [useFetchState, dispatch] = useReducer(useFetchStateReducer, {
    data: null,
    error: null,
    status: loadImmediately ? RequestStatus.LOADING : undefined,
  })

  const refresh = () => {
    setRefreshIndex(refreshIndex + 1)
  }

  useEffect(() => {
    // @see https://github.com/axios/axios#cancellation
    const source = CancelToken.source()

    const sendRequest = async () => {
      dispatch({ type: FETCH_START })

      try {
        await timeout(1000)
        const { data: response } = await axiosInstance({
          ...requestOptions,
          cancelToken: source.token,
        })

        if (onSuccess) {
          onSuccess(response.data)
        }

        dispatch({
          type: FETCH_SUCCESS,
          payload: response.data,
        })
      } catch (error) {
        if (axios.isCancel(error)) {
          // no need to dispatch an update to the reducer,
          // component is already unmounted.
          console.log(error.message)
          return
        }

        console.error(error)

        if (onError) {
          onError(error.message)
        }

        dispatch({
          type: FETCH_ERROR,
          payload: error.message,
        })
      }
    }

    if (loadImmediately || refreshIndex > 0) {
      sendRequest()
    }

    return () => {
      source.cancel('Cancelling request due to unmount of requesting component')
    }
  }, [loadImmediately, onError, onSuccess, refreshIndex, requestOptions])

  return [useFetchState, refresh]
}

export default useApi
