import { Either } from '../../../../../shared/core/result'
import ErrorInfo from '../../../dtos/error-info'
import ParcelStatus from '../../../dtos/parcel-status'
import { GetParcelStatusesErrors as Errors } from './get-parcel-statuses.errors'

export type GetParcelStatusesSuccess = {
  clientReference: string
  deliveryCountryCode: string
  deliveryZipCode: string
  parcelNumber: number
  parcelStatusErrors: ErrorInfo[]
  parcelStatusList: ParcelStatus[]
}

export type GetParcelStatusesResponse = Either<
  GetParcelStatusesSuccess,
  Errors.ServiceError
>
