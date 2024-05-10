import express from 'express'
import {
  labelRouter,
  parcelRouter,
} from '../../../../modules/parcel/infrastructure/http/routes'

const v1Router = express.Router()

v1Router.use('/labels', labelRouter)
v1Router.use('/parcels', parcelRouter)

export default v1Router
