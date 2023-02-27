import Address from '../../../modules/parcel/dtos/address'

export const app = {
  port: Number(process.env.APP_PORT),
  apiKey: process.env.APP_API_KEY as string,
  productionMode: process.env.APP_PRODUCTION_MODE as string,
  baseUrl: process.env.APP_BASE_URL as string,
}

export const services = {
  parcel: {
    url: process.env.SERVICES_PARCEL_URL as string,
    username: process.env.SERVICES_PARCEL_USERNAME as string,
    password: process.env.SERVICES_PARCEL_PASSWORD as string,
  },
  storage: { baseDir: process.env.SERVICES_STORAGE_BASE_DIR as string },
  download: { baseUrl: process.env.SERVICES_DOWNLOAD_BASE_URL as string },
}

// prettier-ignore
export const controllers = {
  printLabels: {
    clientNumber: Number(process.env.CONTROLLERS_PRINT_LABELS_CLIENT_NUMBER),
    pickupAddress: {
      name: process.env.CONTROLLERS_PRINT_LABELS_PICKUP_ADDRESS_NAME as string,
      street: process.env.CONTROLLERS_PRINT_LABELS_PICKUP_ADDRESS_STREET as string,
      houseNumber: process.env.CONTROLLERS_PRINT_LABELS_PICKUP_ADDRESS_HOUSE_NUMBER as string,
      houseNumberInfo: process.env.CONTROLLERS_PRINT_LABELS_PICKUP_ADDRESS_HOUSE_NUMBER_INFO as string,
      city: process.env.CONTROLLERS_PRINT_LABELS_PICKUP_ADDRESS_CITY as string,
      zipCode: process.env.CONTROLLERS_PRINT_LABELS_PICKUP_ADDRESS_ZIP_CODE as string,
      countryIsoCode: process.env.CONTROLLERS_PRINT_LABELS_PICKUP_ADDRESS_COUNTRY_ISO_CODE as string,
      contactName: process.env.CONTROLLERS_PRINT_LABELS_PICKUP_ADDRESS_CONTACT_NAME as string,
      contactPhone: process.env.CONTROLLERS_PRINT_LABELS_PICKUP_ADDRESS_CONTACT_PHONE as string,
      contactEmail: process.env.CONTROLLERS_PRINT_LABELS_PICKUP_ADDRESS_CONTACT_EMAIL as string
    } as Address
  }
}
