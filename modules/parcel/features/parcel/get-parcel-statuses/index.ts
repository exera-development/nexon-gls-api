import GetParcelStatuses from './get-parcel-statuses'
import { parcelService } from '../../../services'
import GetParcelStatusesController from './get-parcel-statuses.controller'

const getParcelStatuses = new GetParcelStatuses(parcelService)
const getParcelStatusesController = new GetParcelStatusesController(
  getParcelStatuses
)

export { getParcelStatuses, getParcelStatusesController }
