import { services as configServices } from '../../../shared/infrastructure/config'
import DownloadService from './download.service'
import FileDownloadService from './implementations/file-download.service'
import FileStorageService from './implementations/file-storage.service'
import HttpParcelService from './implementations/http-parcel.service'
import ParcelService from './parcel.service'
import StorageService from './storage.service'

const {
  parcel: { url, username, password },
  storage: { baseDir },
  download: { baseUrl },
} = configServices

const parcelService: ParcelService = new HttpParcelService({
  url,
  username,
  password,
})
const storageService: StorageService = new FileStorageService({ baseDir })
const downloadService: DownloadService = new FileDownloadService({ baseUrl })

export { parcelService, storageService, downloadService }
