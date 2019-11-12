const multer = require('multer')

const { UPLOAD_DESTINATION_PATH, ALLOWED_MIME_TYPES } = require('../config')

const { formatFile, formatError } = require('../format')
const FileFactory = require('../FileFactory')

const fileFilter = (req, file, callback) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return callback(
      new Error(`Only "${ALLOWED_MIME_TYPES.join(' ')}" allowed!`)
    )
  }

  return callback(null, true)
}

// file storage
const storage = multer.diskStorage({
  destination: UPLOAD_DESTINATION_PATH,
  filename: function(req, file, callback) {
    callback(null, file.originalname)
  },
})

const upload = multer({
  storage,
  fileFilter: fileFilter,
})

// TODO what about overriding files?
const UploadFilesHandler = (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).send(formatError(err))
    }

    console.log(req.file)
    const { path } = req.file
    console.log(path)

    return res.status(201).send({ data: formatFile(FileFactory.create(path)) })
  })
}

module.exports = {
  fileFilter,
  handle: UploadFilesHandler,
}
