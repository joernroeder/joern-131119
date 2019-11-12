const cors = require('cors')
const express = require('express')

const ListFilesHandler = require('./handlers/listFiles')
const UploadFilesHandler = require('./handlers/uploadFiles')

const app = express()

app.use(cors({ origin: 'http://localhost:3000' }))

app.use(function(err, req, res, next) {
  console.error(err.stack)
  res.status(500).json({ foo: 'bar' }) // <== YOUR JSON DATA HERE
})

const port = process.env.PORT || 4000

app.get('/files', ListFilesHandler.handle)
app.post('/upload', UploadFilesHandler.handle)

app.listen(port)

console.log(`API-Server started successfully on port ${port}`)
