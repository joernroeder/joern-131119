import { useFetch } from 'react-async'

// TODO update to fetch pattern, see .deleteFile
export default (apiOptions) => {
  const { baseURL, headers } = apiOptions

  return (options) => {
    return useFetch(`${baseURL}/files?q=`, { headers }, options)
  }
}
