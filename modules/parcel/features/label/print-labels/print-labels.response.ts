import ErrorInfo from '../../../dtos/error-info'
import LabelInfo from '../../../dtos/label-info'
import { Either } from '../../../../../shared/core/result'
import DownloadUrl from '../../../domain/download-url'
import Pdf from '../../../domain/pdf'
import { PrintLabelsErrors as Errors } from './print-labels.errors'

export type PrintLabelsSuccess = {
  pdf: Pdf
  downloadUrl: DownloadUrl
  errorInfoList: ErrorInfo[]
  labelInfoList: LabelInfo[]
}

export type PrintLabelsResponse = Either<
  PrintLabelsSuccess,
  Errors.NoParcelsError | Errors.NoPDFError | Errors.ServiceError
>
