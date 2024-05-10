import ErrorInfo from './error-info'
import ParcelStatus from './parcel-status'

type GetParcelStatusesResponseDTO = {
  clientReference: string
  deliveryCountryCode: string
  deliveryZipCode: string
  parcelNumber: number
  parcelStatusErrors: ErrorInfo[]
  parcelStatusList: ParcelStatus[]
}

export default GetParcelStatusesResponseDTO
