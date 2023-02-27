import express from 'express'
import { labelRouter } from '../../../../modules/parcel/infrastructure/http/routes'

const v1Router = express.Router()

v1Router.use('/labels', labelRouter)

export default v1Router
