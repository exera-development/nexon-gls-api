import axios, { Axios } from 'axios'
import crypto from 'crypto'
import Address from '../../dtos/address'
import Parcel from '../../dtos/parcel'
import ParcelService, {
  AllLabelsFailedException,
  GetParcelStatusesInput,
  GetParcelStatusesOutput,
  PrintLabelsInput,
  PrintLabelsOutput,
} from '../parcel.service'

export type Config = {
  url: string
  username: string
  password: string
}

type ParcelError = {
  ErrorCode: number
  ErrorDescription: string
  ClientReferenceList: string[]
  ParcelIdList: number[]
}

type PrintLabelsInfo = {
  ClientReference: string
  ParcelId: number
  ParcelNumber: number
}

type ParcelStatus = {
  DepotCity: string
  DepotNumber: string
  StatusCode: string
  StatusDate: string
  StatusDescription: string
  StatusInfo: string
}

type PrintLabelsResponse = {
  Labels: number[]
  PrintLabelsErrorList: ParcelError[]
  PrintLabelsInfoList: PrintLabelsInfo[]
}

type GetParcelStatusesResponse = {
  ClientReference: string
  DeliveryCountryCode: string
  DeliveryZipCode: string
  ParcelNumber: number
  GetParcelStatusErrors: ParcelError[]
  ParcelStatusList: ParcelStatus[]
}

class HttpParcelService implements ParcelService {
  private username: string
  private password: string
  private axiosInstance: Axios

  constructor(config: Config) {
    this.username = config.username
    this.password = config.password
    this.axiosInstance = axios.create({
      baseURL: config.url,
    })
  }

  async printLabels(input: PrintLabelsInput): Promise<PrintLabelsOutput> {
    const request = this.createPrintLabelsRequest({
      input,
      username: this.username,
      password: this.password,
    })

    let result: PrintLabelsResponse

    try {
      result = await this.axiosInstance
        .post<PrintLabelsResponse>('/PrintLabels', request)
        .then((result) => result.data)
    } catch (err) {
      console.error(err)
      throw new Error('API error')
    }

    const { Labels, PrintLabelsErrorList, PrintLabelsInfoList } = result
    const errorInfoList = this.toParcelErrorList(PrintLabelsErrorList)
    const labelInfoList = this.toLabelInfoList(PrintLabelsInfoList)

    if (!result.PrintLabelsInfoList.length) {
      throw new AllLabelsFailedException(
        'All of the labels failed, thus no PDF has been generated',
        errorInfoList
      )
    }

    return {
      labels: this.convertToBuffer(Labels),
      errorInfoList,
      labelInfoList,
    }
  }

  async getParcelStatuses(
    input: GetParcelStatusesInput
  ): Promise<GetParcelStatusesOutput> {
    const request = this.createGetParcelStatusesRequest({
      input,
      username: this.username,
      password: this.password,
    })

    let result: GetParcelStatusesResponse

    try {
      result = await this.axiosInstance
        .post<GetParcelStatusesResponse>('/GetParcelStatuses', request)
        .then((result) => result.data)
    } catch (err) {
      console.error(err)
      throw new Error('API error')
    }

    const { GetParcelStatusErrors, ParcelStatusList } = result
    const parcelStatusErrors = this.toParcelErrorList(GetParcelStatusErrors)
    const parcelStatusList = this.toParcelStatusList(ParcelStatusList)

    return {
      clientReference: result.ClientReference,
      deliveryCountryCode: result.DeliveryCountryCode,
      deliveryZipCode: result.DeliveryZipCode,
      parcelNumber: result.ParcelNumber,
      parcelStatusErrors,
      parcelStatusList,
    }
  }

  private convertToBuffer(byteArray: number[]) {
    return Buffer.from(byteArray)
  }

  private toParcelErrorList(list: ParcelError[]) {
    return list.map((error) => ({
      errorCode: error.ErrorCode,
      errorDescription: error.ErrorDescription,
      clientReferenceList: error.ClientReferenceList,
      parcelIdList: error.ParcelIdList,
    }))
  }

  private toLabelInfoList(list: PrintLabelsInfo[]) {
    return list.map((info) => ({
      clientReference: info.ClientReference,
      parcelId: info.ParcelId,
      parcelNumber: info.ParcelNumber,
    }))
  }

  private toParcelStatusList(list: ParcelStatus[]) {
    return list.map((info) => ({
      depotCity: info.DepotCity,
      depotNumber: info.DepotNumber,
      statusCode: info.StatusCode,
      statusDate: this.convertStatusDate(info.StatusDate),
      statusDescription: info.StatusDescription,
      statusInfo: info.StatusInfo,
    }))
  }

  private createPrintLabelsRequest({
    input,
    username,
    password,
  }: {
    input: PrintLabelsInput
    username: string
    password: string
  }) {
    const { parcels, printPosition, printerType, webshopEngine } = input

    return {
      Username: username,
      Password: this.mapPassword(password),
      ParcelList: parcels.map((parcel) => this.mapParcel(parcel)),
      WebshopEngine: webshopEngine,
      PrintPosition: printPosition,
      printerType: printerType,
    }
  }

  private createGetParcelStatusesRequest({
    input,
    username,
    password,
  }: {
    input: GetParcelStatusesInput
    username: string
    password: string
  }) {
    const { parcelNumber, language = 'EN' } = input

    return {
      Username: username,
      Password: this.mapPassword(password),
      ParcelNumber: parcelNumber,
      LanguageIsoCode: language,
      ReturnPOD: false,
    }
  }

  private mapPassword(password: string) {
    return Array.from(crypto.createHash('sha512').update(password).digest())
  }

  private mapParcel(parcel: Parcel) {
    return {
      ClientNumber: `${parcel.clientNumber}`,
      ClientReference: parcel.clientReference,
      Count: parcel.count,
      CODAmount: parcel.codAmount,
      CODReference: parcel.codReference,
      Content: parcel.content,
      PickupAddress: this.mapAddress(parcel.pickupAddress),
      DeliveryAddress: this.mapAddress(parcel.deliveryAddress),
    }
  }

  // Currently not used, but I left it here in case we will need to set the PickupDate.
  // Why implement it twice, eh?
  private mapDateToJSONDate(date: Date) {
    return `\\/Date(${date.getTime() * 1000})\\/`
  }

  private convertStatusDate(statusDate: string) {
    const timestampMatch = statusDate.match(/\/Date\((\d+)([+-]\d{4})\)\//)

    if (timestampMatch) {
      const timestamp = parseInt(timestampMatch[1], 10)
      return new Date(timestamp)
    } else {
      throw new Error('Invalid statusDate format')
    }
  }

  private mapAddress(address: Address) {
    return {
      Name: address.name,
      Street: address.street,
      HouseNumber: address.houseNumber,
      HouseNumberInfo: address.houseNumberInfo,
      City: address.city,
      ZipCode: address.zipCode,
      CountryIsoCode: address.countryIsoCode,
      ContactName: address.contactName,
      ContactPhone: address.contactPhone,
      ContactEmail: address.contactEmail,
    }
  }
}

export default HttpParcelService
