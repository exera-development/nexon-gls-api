import ErrorInfo from '../../../dtos/error-info'
import FeatureError from '../../../../../shared/core/errors/feature-error'

export namespace PrintLabelsErrors {
  export class NoParcelsError implements FeatureError {
    public message: string

    constructor() {
      this.message = 'At least one parcel is required'
    }
  }

  export class NoPDFError implements FeatureError {
    public message: string
    public errorInfoList: ErrorInfo[]

    constructor(errorInfoList: ErrorInfo[]) {
      this.message = 'No PDF'
      this.errorInfoList = errorInfoList
    }
  }

  export class ServiceError implements FeatureError {
    public message: string

    constructor(problem: string) {
      this.message = `Service error: ${problem}`
    }
  }
}
