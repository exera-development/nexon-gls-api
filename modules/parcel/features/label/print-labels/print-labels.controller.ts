import { Request, Response } from 'express'
import Address from '../../../dtos/address'
import ErrorInfo from '../../../dtos/error-info'
import LabelInfo from '../../../dtos/label-info'
import PrintLabelsRequestDTO from '../../../dtos/print-labels-request-dto'
import PrintLabelsResponseDTO from '../../../dtos/print-labels-response-dto'
import formatValidationError from '../../../../../shared/core/format-validation-error'
import BaseController from '../../../../../shared/infrastructure/http/models/base-controller'
import { generateId } from '../../../../../shared/utils/id'
import DownloadUrl from '../../../domain/download-url'
import Pdf from '../../../domain/pdf'
import PrintLabels from './print-labels'
import PrintLabelsDTO from './print-labels.dto'
import { PrintLabelsErrors } from './print-labels.errors'
import { parsePrintLabelsRequestDTO } from './print-labels.validation'

export type Config = {
  clientNumber: number
  pickupAddress: Address
}

class PrintLabelsController extends BaseController {
  private feature: PrintLabels
  private clientNumber: number
  private pickupAddress: Address

  constructor(feature: PrintLabels, config: Config) {
    super()
    this.feature = feature
    this.clientNumber = config.clientNumber
    this.pickupAddress = config.pickupAddress
  }

  protected async executeImpl(req: Request, res: Response): Promise<unknown> {
    let request: PrintLabelsRequestDTO

    try {
      request = parsePrintLabelsRequestDTO(req.body)
    } catch (err) {
      return this.clientError(res, formatValidationError(err))
    }

    const { parcels, printPosition, printerType } = request

    const dto: PrintLabelsDTO = {
      name: generateId(),
      parcels: parcels.map((parcel) => ({
        ...parcel,
        clientNumber: this.clientNumber,
        pickupAddress: this.pickupAddress,
      })),
      printPosition,
      printerType,
    }

    try {
      const result = await this.feature.execute(dto)

      if (result.isFailure()) {
        const error = result.value

        switch (error.constructor) {
          case PrintLabelsErrors.NoParcelsError:
            return this.clientError(res, error.message)

          case PrintLabelsErrors.NoPDFError:
            const errorInfoList = (<PrintLabelsErrors.NoPDFError>error)
              .errorInfoList

            return this.ok(
              res,
              this.createResponseDTO({
                pdf: null,
                downloadUrl: null,
                errorInfoList: errorInfoList,
                labelInfoList: [],
              })
            )

          case PrintLabelsErrors.ServiceError:
          default:
            return this.fail(res, error.message)
        }
      }

      const {
        pdf,
        downloadUrl,
        errorInfoList: printLabelsErrorList,
        labelInfoList: printLabelsInfoList,
      } = result.value

      return this.ok(
        res,
        this.createResponseDTO({
          pdf,
          downloadUrl,
          errorInfoList: printLabelsErrorList,
          labelInfoList: printLabelsInfoList,
        })
      )
    } catch (err) {
      return this.fail(res, err)
    }
  }

  private createResponseDTO({
    pdf,
    downloadUrl,
    errorInfoList,
    labelInfoList,
  }: {
    pdf: Pdf | null
    downloadUrl: DownloadUrl | null
    errorInfoList: ErrorInfo[]
    labelInfoList: LabelInfo[]
  }): PrintLabelsResponseDTO {
    return {
      name: pdf?.name ?? null,
      pdf: downloadUrl?.url ?? null,
      errorInfoList,
      labelInfoList,
    }
  }
}

export default PrintLabelsController
