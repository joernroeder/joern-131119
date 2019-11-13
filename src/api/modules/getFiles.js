import addCancelToken from '../helpers/addCancelToken'

const getFiles = (axios) => {
  return async (args) => {
    return await axios
      .get('/files', {
        ...addCancelToken(args),
      })
      .then((res) => res.data.data)
  }
}

export default getFiles
