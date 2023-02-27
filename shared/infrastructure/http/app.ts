import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import v1Router from './api/v1'
import * as config from '../config'
import { middleware } from '.'

const port = config.app.port
const app = express()

app.use(bodyParser.json())

app.get('/ping', (req, res) => {
  res.status(200).send()
})

app.use('/api/v1', middleware.checkApiKey(), v1Router)
app.use('/downloads', express.static(config.services.storage.baseDir))

// Test

if (process.env.NODE_ENV === 'production') {
  // setupProductionServer()
}

console.log('Configuration: ', config)

app.listen(port, () => console.log(`Server is listening on port: ${port}`))

function setupProductionServer() {
  app.use(express.static(path.join(__dirname, 'client')))
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html')) // TODO: test this after app root modifications
  })
}
