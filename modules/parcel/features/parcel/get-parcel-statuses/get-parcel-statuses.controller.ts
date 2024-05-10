import { Request, Response } from 'express'
import BaseController from '../../../../../shared/infrastructure/http/models/base-controller'
import GetParcelStatuses from './get-parcel-statuses'
import GetParcelStatusesRequestDTO from '../../../dtos/get-parcel-statuses-request-dto'
import { parseGetParcelStatusesRequestDTO } from './get-parcel-statuses.validation'
import GetParcelStatusesDTO from './get-parcel-statuses.dto'
import GetParcelStatusesResponseDTO from '../../../dtos/get-parcel-statuses-response-dto'
import { GetParcelStatusesSuccess } from './get-parcel-statuses.response'

class GetParcelStatusesController extends BaseController {
  private feature: GetParcelStatuses

  constructor(feature: GetParcelStatuses) {
    super()
    this.feature = feature
  }

  protected async executeImpl(req: Request, res: Response): Promise<unknown> {
    let request: GetParcelStatusesRequestDTO

    try {
      request = parseGetParcelStatusesRequestDTO(req)
    } catch (err) {
      return this.clientError(res, err.message)
    }

    const { parcelNumber, language } = request

    const dto: GetParcelStatusesDTO = {
      parcelNumber,
      language,
    }

    try {
      const result = await this.feature.execute(dto)

      if (result.isFailure()) {
        const error = result.value

        switch (error.constructor) {
          default:
            return this.fail(res, error.message)
        }
      }

      return this.ok(res, this.createResponseDTO(result.value))
    } catch (err) {
      return this.fail(res, err)
    }
  }

  private createResponseDTO(
    value: GetParcelStatusesSuccess
  ): GetParcelStatusesResponseDTO {
    return {
      clientReference: value.clientReference,
      deliveryCountryCode: value.deliveryCountryCode,
      deliveryZipCode: value.deliveryZipCode,
      parcelNumber: value.parcelNumber,
      parcelStatusErrors: value.parcelStatusErrors,
      parcelStatusList: value.parcelStatusList,
    }
  }
}

export default GetParcelStatusesController
