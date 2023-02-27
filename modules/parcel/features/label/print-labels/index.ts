import { controllers as controllersConfig } from '../../../../../shared/infrastructure/config'
import {
  downloadService,
  parcelService,
  storageService,
} from '../../../services'
import PrintLabels from './print-labels'
import PrintLabelsController from './print-labels.controller'

const printLabels = new PrintLabels(
  parcelService,
  storageService,
  downloadService
)
const printLabelsController = new PrintLabelsController(
  printLabels,
  controllersConfig.printLabels
)

export { printLabels, printLabelsController }
