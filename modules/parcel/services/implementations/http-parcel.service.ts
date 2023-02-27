import axios, { Axios } from 'axios'
import crypto from 'crypto'
import Address from '../../dtos/address'
import Parcel from '../../dtos/parcel'
import ParcelService, {
  AllLabelsFailedException,
  PrintLabelsInput,
  PrintLabelsOutput,
} from '../parcel.service'

export type Config = {
  url: string
  username: string
  password: string
}

type PrintLabelsError = {
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

type PrintLabelsResponse = {
  Labels: number[]
  PrintLabelsErrorList: PrintLabelsError[]
  PrintLabelsInfoList: PrintLabelsInfo[]
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
    const request = this.createRequest({
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
    const errorInfoList = this.toErrorInfoList(PrintLabelsErrorList)
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

  private convertToBuffer(byteArray: number[]) {
    return Buffer.from(byteArray)
  }

  private toErrorInfoList(list: PrintLabelsError[]) {
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

  private createRequest({
    input,
    username,
    password,
  }: {
    input: PrintLabelsInput
    username: string
    password: string
  }) {
    const { parcels, printPosition, printerType } = input

    return {
      Username: username,
      Password: this.mapPassword(password),
      ParcelList: parcels.map((parcel) => this.mapParcel(parcel)),
      PrintPosition: printPosition,
      printerType: printerType,
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
  // private mapDate(date: Date) {
  //   return `\\/Date(${date.getTime() * 1000})\\/`
  // }

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
