import DownloadUrl from '../../domain/download-url'
import DownloadService, {
  GeneratePdfDownloadUrlInput,
  GeneratePdfDownloadUrlOutput,
} from '../download.service'

export type Config = {
  baseUrl: string
}

class FileDownloadService implements DownloadService {
  private baseUrl: string

  constructor(config: Config) {
    this.baseUrl = config.baseUrl
  }

  async generatePdfDownloadUrl({
    pdf,
  }: GeneratePdfDownloadUrlInput): Promise<GeneratePdfDownloadUrlOutput> {
    const url = `${this.baseUrl}/pdf/${pdf.name}.pdf`
    const downloadUrlOrError = DownloadUrl.create({ url })

    if (downloadUrlOrError.isFailure()) {
      throw new Error(
        `Failed to create download url: ${downloadUrlOrError.value.message}`
      )
    }

    return {
      downloadUrl: downloadUrlOrError.value,
    }
  }
}

export default FileDownloadService
