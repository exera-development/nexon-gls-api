import Parcel from '../../../dtos/parcel'
import PrintPosition from '../../../dtos/print-position'
import PrinterType from '../../../dtos/printer-type'

interface PrintLabelsDTO {
  name: string
  parcels: Parcel[]
  printPosition: PrintPosition
  printerType: PrinterType
}

export default PrintLabelsDTO
