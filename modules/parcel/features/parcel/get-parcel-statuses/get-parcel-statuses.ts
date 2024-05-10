import Feature from '../../../../../shared/core/feature'
import { failure, success } from '../../../../../shared/core/result'
import ParcelService, {
  GetParcelStatusesOutput,
} from '../../../services/parcel.service'
import GetParcelStatusesDTO from './get-parcel-statuses.dto'
import { GetParcelStatusesResponse } from './get-parcel-statuses.response'
import { GetParcelStatusesErrors as Errors } from './get-parcel-statuses.errors'

class GetParcelStatuses
  implements Feature<GetParcelStatusesDTO, Promise<GetParcelStatusesResponse>>
{
  private parcelService: ParcelService

  constructor(parcelService: ParcelService) {
    this.parcelService = parcelService
  }

  async execute(
    request: GetParcelStatusesDTO
  ): Promise<GetParcelStatusesResponse> {
    const { parcelNumber, language } = request

    let output: GetParcelStatusesOutput

    try {
      output = await this.parcelService.getParcelStatuses({
        parcelNumber,
        language,
      })
    } catch (err) {
      return failure(new Errors.ServiceError(err.message))
    }

    return success({
      ...output,
    })
  }
}

export default GetParcelStatuses
