import addCancelToken from '../helpers/addCancelToken'

const uploadFile = (axios) => {
  return async ({ with: fileData, ...args }) => {
    return await axios
      .post('/upload', fileData, {
        ...addCancelToken(args),
      })
      .then((res) => res.data.data)
  }
}

export default uploadFile
