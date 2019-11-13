import addCancelToken from '../helpers/addCancelToken'

const deleteFile = (axios) => {
  return async ({ withId: id, ...args }) => {
    return await axios
      .delete(`/files/${encodeURIComponent(id)}`, {
        ...addCancelToken(args),
      })
      .then((res) => res.data.data)
  }
}

export default deleteFile
