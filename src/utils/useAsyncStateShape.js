import PropTypes from 'prop-types'

const ReadOnlyAsyncStateShape = {
  data: PropTypes.any,
  error: PropTypes.error,
  value: PropTypes.any,
  initialValue: PropTypes.any,
  startedAt: PropTypes.instanceOf(Date),
  finishedAt: PropTypes.instanceOf(Date),
  status: PropTypes.string.isRequired,
  isInitial: PropTypes.bool,
  isPending: PropTypes.bool,
  isFulfilled: PropTypes.bool,
  isResolved: PropTypes.bool,
  isRejected: PropTypes.bool,
  isSettled: PropTypes.bool,
  counter: PropTypes.number,
}

const ExecutableAsyncStateShape = {
  ...ReadOnlyAsyncStateShape,
  promise: PropTypes.instanceOf(Promise).isRequired,
  run: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
}

const limitToReadOnlyAsyncState = (asyncState) => {
  const readOnlyKeys = Object.keys(ReadOnlyAsyncStateShape)

  /*
  return Object.keys(asyncState)
    .filter((key) => readOnlyKeys.includes(key))
    .reduce((accumulator, key) => {
      if (!asyncState[key]) {
        return accumulator
      }

      return {
        ...accumulator,
        ...{ [key]: asyncState[key] },
      }
    }, {})
  */
  return Object.fromEntries(
    Object.entries(asyncState).filter(([key]) => readOnlyKeys.includes(key))
  )
}

export {
  ReadOnlyAsyncStateShape,
  ExecutableAsyncStateShape,
  limitToReadOnlyAsyncState,
}
