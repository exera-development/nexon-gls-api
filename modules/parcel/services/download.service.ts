// export type GeneratePdfDownloadUrl

import DownloadUrl from '../domain/download-url'
import Pdf from '../domain/pdf'

export type GeneratePdfDownloadUrlInput = {
  pdf: Pdf
}

export type GeneratePdfDownloadUrlOutput = {
  downloadUrl: DownloadUrl
}

interface DownloadService {
  generatePdfDownloadUrl(
    input: GeneratePdfDownloadUrlInput
  ): Promise<GeneratePdfDownloadUrlOutput>
}

export default DownloadService
