import validator from 'validator'

const isPlainObject = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export const isValidFileId = (id) => {
  return validator.isHash(id, 'sha256')
}

export const isValidFileName = (name) => {
  if (validator.isDataURI(name)) {
    return false
  }

  if (validator.isJSON(name)) {
    return false
  }

  return true
}

export const isValidFileSize = (size) => {
  return !isNaN(size) && Number.isInteger(size)
}

export const isValidMimeType = (mime) => {
  try {
    return validator.isMimeType(mime)
  } catch (err) {
    return false
  }
}

export const isValidFile = (candidate) => {
  if (!candidate || !isPlainObject(candidate)) {
    return false
  }

  const { id } = candidate
  if (!isValidFileId(id)) {
    return false
  }

  const { attributes } = candidate
  if (!isPlainObject(attributes)) {
    return false
  }

  const { name } = attributes
  if (!isValidFileName(name)) {
    return false
  }

  const { size } = attributes
  if (!isValidFileSize(size)) {
    return false
  }

  return true
}

export const fileAlreadyExists = (list, file) => {
  const { id } = file

  const fileIndex = list.findIndex((stateFile) => {
    return stateFile.id === id
  })

  // id already exists in in the list. returning...
  if (fileIndex !== -1) {
    return false
  }

  return true
}
