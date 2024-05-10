import { Request } from 'express'
import GetParcelStatusesRequestDTO from '../../../dtos/get-parcel-statuses-request-dto'
import isValidLanguage from '../../../../../shared/utils/is-valid-language'
import isInteger from '../../../../../shared/utils/is-integer'

export const parseGetParcelStatusesRequestDTO = (
  req: Request
): GetParcelStatusesRequestDTO => {
  const parcelNumber = req.params?.parcelNumber
  const language = req.query?.language as string | undefined

  if (!isInteger(parcelNumber)) {
    throw new Error('Invalid parcelNumber')
  }

  if (language && !isValidLanguage(language)) {
    throw new Error('Invalid language')
  }

  return {
    parcelNumber: Number(parcelNumber),
    language,
  }
}
