import Parcel from './parcel'

type OutboundParcel = Omit<Parcel, 'pickupAddress' | 'clientNumber'>

export default OutboundParcel
