const addCancelToken = ({ cancelVia: cancelSource }) => {
  return cancelSource ? { cancelToken: cancelSource.token } : {}
}

export default addCancelToken
