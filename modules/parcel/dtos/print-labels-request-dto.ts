import OutboundParcel from './outbound-parcel'
import PrintPosition from './print-position'
import PrinterType from './printer-type'

type PrintLabelsRequestDTO = {
  parcels: OutboundParcel[]
  printPosition: PrintPosition
  printerType: PrinterType
}

export default PrintLabelsRequestDTO
