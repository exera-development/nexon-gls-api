import express from 'express'
import { getParcelStatusesController } from '../../../features/parcel/get-parcel-statuses'

const parcelRouter = express.Router()

parcelRouter.get('/:parcelNumber', (req, res) =>
  getParcelStatusesController.execute(req, res)
)

export default parcelRouter
