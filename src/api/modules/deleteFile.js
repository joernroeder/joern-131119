import { useAsync } from 'react-async'

export default (apiOptions) => {
  const { baseURL, headers } = apiOptions

  const deleteFile = ([id, { onResolve, onReject }], props, options) => {
    const { signal } = options

    return fetch(`${baseURL}/files/${encodeURI(id)}`, {
      method: 'DELETE',
      headers,
      signal,
    })
      .then(onResolve)
      .catch(onReject)
  }

  return (options) => {
    return useAsync({
      ...options,
      deferFn: deleteFile,
    })
  }
}
