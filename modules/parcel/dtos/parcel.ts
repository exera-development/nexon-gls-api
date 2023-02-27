import Address from './address'

type Parcel = {
  clientNumber: number
  clientReference: string
  count: number
  codAmount: number
  codReference: string
  content: string
  pickupAddress: Address
  deliveryAddress: Address
}

export default Parcel
