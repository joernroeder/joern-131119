import { useFetch } from 'react-async'

export default (apiOptions) => {
  const { baseURL, headers } = apiOptions

  return (options) => {
    console.log(options)

    return useFetch(`${baseURL}/files`, { headers }, options)
  }
}
