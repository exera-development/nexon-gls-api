import FeatureError from '../../../../../shared/core/errors/feature-error'

export namespace GetParcelStatusesErrors {
  export class ServiceError implements FeatureError {
    public message: string

    constructor(problem: string) {
      this.message = `Service error: ${problem}`
    }
  }
}
