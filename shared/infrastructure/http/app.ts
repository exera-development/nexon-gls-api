import bodyParser from 'body-parser'
import express from 'express'
import { middleware } from '.'
import * as config from '../config'
import v1Router from './api/v1'

const port = config.app.port
const productionMode = config.app.productionMode
const baseUrl = config.app.baseUrl ?? ''
const app = express()
const baseRouter = express.Router()

app.use(bodyParser.json())

baseRouter.get('/ping', (req, res) => {
  res.status(200).send()
})

baseRouter.use('/api/v1', middleware.checkApiKey(), v1Router)
baseRouter.use('/downloads', express.static(config.services.storage.baseDir))

app.use(baseUrl, baseRouter)

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
