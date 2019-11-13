import addCancelToken from '../helpers/addCancelToken'

const getFilteredFiles = (axios) => {
  return async ({ by: query, ...args }) => {
    return await axios
      .get('/files', {
        ...addCancelToken(args),
        params: {
          q: encodeURIComponent(query),
        },
      })
      .then((res) => ({ data: res.data.data, query }))
  }
}

export default getFilteredFiles
