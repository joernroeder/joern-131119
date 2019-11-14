import { useAsync } from 'react-async'

export default (apiOptions) => {
  const { baseURL, headers } = apiOptions

  const uploadFile = ([data], props, options) => {
    const { signal } = options

    return fetch(`${baseURL}/upload`, {
      method: 'POST',
      body: data,
      headers,
      signal,
    }).then((res) => res.json())
  }

  return (options) => {
    console.log(options)
    return useAsync({
      ...options,
      deferFn: uploadFile,
    })
  }
}
