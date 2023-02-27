import Pdf from '../domain/pdf'

export type SaveLabelsInput = {
  name: string
  labels: Buffer
}

export type SaveLabelsOutput = {
  pdf: Pdf
}

interface StorageService {
  saveLabels(input: SaveLabelsInput): Promise<SaveLabelsOutput>
}

export default StorageService
