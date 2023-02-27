import fs from 'fs'
import path from 'path'
import Pdf from '../../domain/pdf'
import StorageService, {
  SaveLabelsInput,
  SaveLabelsOutput,
} from '../storage.service'

export type Config = {
  baseDir: string
}

class FileStorageService implements StorageService {
  private baseDir: string

  constructor(config: Config) {
    this.baseDir = config.baseDir
  }

  async saveLabels({
    name,
    labels,
  }: SaveLabelsInput): Promise<SaveLabelsOutput> {
    const folder = path.join(this.baseDir, 'pdf')
    const filename = `${name}.pdf`
    const file = path.join(folder, filename)

    await this.createFolderIfNotExists(folder)
    await this.saveFile(file, labels)

    const pdfOrError = Pdf.create({ name, filePath: file })

    if (pdfOrError.isFailure()) {
      throw new Error(`Failed to create PDF: ${pdfOrError.value.message}`)
    }

    return {
      pdf: pdfOrError.value,
    }
  }

  private async createFolderIfNotExists(folder: string) {
    await fs.promises.mkdir(folder, { recursive: true })
  }

  private async saveFile(file: string, data: Buffer) {
    await fs.promises.writeFile(file, data)
  }
}

export default FileStorageService
