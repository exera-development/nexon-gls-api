import ErrorInfo from '../dtos/error-info'
import Parcel from '../dtos/parcel'
import LabelInfo from '../dtos/label-info'
import PrintPosition from '../dtos/print-position'
import PrinterType from '../dtos/printer-type'
import ParcelStatus from '../dtos/parcel-status'

export type PrintLabelsInput = {
  parcels: Parcel[]
  printPosition: PrintPosition
  printerType: PrinterType
}

export type PrintLabelsOutput = {
  labels: Buffer
  errorInfoList: ErrorInfo[]
  labelInfoList: LabelInfo[]
}

export type GetParcelStatusesInput = {
  parcelNumber: number
  language?: string
}

export type GetParcelStatusesOutput = {
  clientReference: string
  deliveryCountryCode: string
  deliveryZipCode: string
  parcelNumber: number
  parcelStatusErrors: ErrorInfo[]
  parcelStatusList: ParcelStatus[]
}

export class AllLabelsFailedException extends Error {
  public readonly errorInfoList: ErrorInfo[]
  constructor(message: string, errorInfoList: ErrorInfo[]) {
    super(message)
    this.errorInfoList = errorInfoList
  }
}

interface ParcelService {
  printLabels(input: PrintLabelsInput): Promise<PrintLabelsOutput>
  getParcelStatuses(
    input: GetParcelStatusesInput
  ): Promise<GetParcelStatusesOutput>
}

export default ParcelService
