import express from 'express'
import { printLabelsController } from '../../../features/label/print-labels'

const labelRouter = express.Router()

labelRouter.post('/', (req, res) => printLabelsController.execute(req, res))

export default labelRouter
