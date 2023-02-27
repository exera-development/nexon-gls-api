import bodyParser from 'body-parser'
import express from 'express'
import { middleware } from '.'
import * as config from '../config'
import v1Router from './api/v1'

const port = config.app.port
const productionMode = config.app.productionMode
const app = express()

app.use(bodyParser.json())

app.get('/ping', (req, res) => {
  res.status(200).send()
})

app.use('/api/v1', middleware.checkApiKey(), v1Router)
app.use('/downloads', express.static(config.services.storage.baseDir))

console.log('Configuration: ', config)

if (process.env.NODE_ENV === 'production' && productionMode === 'node') {
  app.listen(() =>
    console.log(`⚡️[server]: Server is running at http://localhost`)
  )
} else {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
  })
}
