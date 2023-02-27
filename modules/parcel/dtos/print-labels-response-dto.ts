import ErrorInfo from './error-info'
import LabelInfo from './label-info'

type PrintLabelsResponseDTO = {
  name: string | null
  pdf: string | null
  errorInfoList: ErrorInfo[]
  labelInfoList: LabelInfo[]
}

export default PrintLabelsResponseDTO
