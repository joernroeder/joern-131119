const fs = require('fs')
const path = require('path')

const { UPLOAD_DESTINATION_PATH, ALLOWED_MIME_TYPES } = require('../config')
const { formatError, formatList } = require('../format')
const FileFactory = require('../FileFactory')

const ListFilesHandler = (req, res) => {
  const type = 'file'
  // TODO proper security checks for q
  const query = req.query.q

  // reads the directory on every request.
  // This should obviously be optimized in real world applications
  // TODO cache and optimize
  fs.readdir(UPLOAD_DESTINATION_PATH, (err, fileNames = []) => {
    if (err) {
      return res.json(formatError(err))
    }

    // iterate over given filesNames, try to construct file objects.
    const files = fileNames.reduce((accumulator, fileName) => {
      const filePath = path.join(UPLOAD_DESTINATION_PATH, fileName)

      const file = FileFactory.create(filePath)

      if (!file) {
        return accumulator
      }

      return [...accumulator, file]
    }, [])

    // filter files by mime type whitelist
    const allowedFiles = files.filter((file) => {
      const { mime } = file

      return ALLOWED_MIME_TYPES.includes(mime)
    })

    const filteredFiles = query
      ? files.filter(({ name }) =>
          name.toLowerCase().includes(query.toLowerCase())
        )
      : allowedFiles

    return res.json(
      formatList(filteredFiles, {
        type,
      })
    )
  })
}

module.exports = {
  handle: ListFilesHandler,
}
