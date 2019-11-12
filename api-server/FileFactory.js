const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const readChunk = require('read-chunk')
const fileType = require('file-type')

const getId = (filePath) => {
  try {
    const file = fs.readFileSync(filePath)
    return crypto
      .createHash('sha256')
      .update(file)
      .digest('hex')
  } catch (err) {
    console.error(err)
    return null
  }
}
const create = (filePath) => {
  const buffer = readChunk.sync(filePath, 0, fileType.minimumBytes)
  const id = getId(filePath)

  if (!id) {
    return null
  }

  try {
    const { mime } = fileType(buffer)
    const { name } = path.parse(filePath)
    const { size } = fs.statSync(filePath)

    return {
      id,
      name,
      size,
      mime,
    }
  } catch (err) {
    return null
  }
}

module.exports = {
  create,
}
