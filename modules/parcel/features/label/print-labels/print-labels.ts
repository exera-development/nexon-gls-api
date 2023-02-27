import Parcel from '../../../dtos/parcel'
import PrintPosition from '../../../dtos/print-position'
import PrinterType from '../../../dtos/printer-type'
import Feature from '../../../../../shared/core/feature'
import handlePromiseError from '../../../../../shared/core/handle-promise-error'
import { failure, success } from '../../../../../shared/core/result'
import Pdf from '../../../domain/pdf'
import DownloadService, {
  GeneratePdfDownloadUrlOutput,
} from '../../../services/download.service'
import ParcelService, {
  AllLabelsFailedException,
  PrintLabelsOutput,
} from '../../../services/parcel.service'
import StorageService, {
  SaveLabelsOutput,
} from '../../../services/storage.service'
import PrintLabelsDTO from './print-labels.dto'
import { PrintLabelsErrors as Errors } from './print-labels.errors'
import { PrintLabelsResponse } from './print-labels.response'

class PrintLabels
  implements Feature<PrintLabelsDTO, Promise<PrintLabelsResponse>>
{
  private parcelService: ParcelService
  private storageService: StorageService
  private downloadService: DownloadService

  constructor(
    parcelService: ParcelService,
    storageService: StorageService,
    downloadService: DownloadService
  ) {
    this.parcelService = parcelService
    this.storageService = storageService
    this.downloadService = downloadService
  }

  async execute(request: PrintLabelsDTO): Promise<PrintLabelsResponse> {
    const { name, parcels, printPosition, printerType } = request

    if (!parcels.length) {
      return failure(new Errors.NoParcelsError())
    }

    let printOutput: PrintLabelsOutput
    let saveOutput: SaveLabelsOutput
    let generateOutput: GeneratePdfDownloadUrlOutput

    try {
      printOutput = await this.print(parcels, printPosition, printerType)
    } catch (err) {
      switch (err.constructor) {
        case AllLabelsFailedException:
          return failure(new Errors.NoPDFError(err.errorInfoList))
        default:
          return failure(new Errors.ServiceError(err.message))
      }
    }

    try {
      saveOutput = await this.save(name, printOutput.labels)
      generateOutput = await this.generate(saveOutput.pdf)
    } catch (err) {
      return failure(new Errors.ServiceError(err.message))
    }

    return success({
      pdf: saveOutput.pdf,
      downloadUrl: generateOutput.downloadUrl,
      errorInfoList: printOutput.errorInfoList,
      labelInfoList: printOutput.labelInfoList,
    })
  }

  private print(
    parcels: Parcel[],
    printPosition: PrintPosition,
    printerType: PrinterType
  ): Promise<PrintLabelsOutput> {
    return this.parcelService.printLabels({
      parcels,
      printPosition,
      printerType,
    })
  }

  private save(name: string, labels: Buffer): Promise<SaveLabelsOutput> {
    return handlePromiseError(
      this.storageService.saveLabels({ name, labels }),
      'Save labels as pdf failed'
    )
  }

  private generate(pdf: Pdf): Promise<GeneratePdfDownloadUrlOutput> {
    return handlePromiseError(
      this.downloadService.generatePdfDownloadUrl({ pdf }),
      'Generate pdf download url failed'
    )
  }
}

export default PrintLabels
