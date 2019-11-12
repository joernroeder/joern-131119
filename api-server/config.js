const path = require('path')

const UPLOAD_DESTINATION_PATH = path.resolve(__dirname, 'uploads')
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png']

module.exports = {
  UPLOAD_DESTINATION_PATH,
  ALLOWED_MIME_TYPES,
}
