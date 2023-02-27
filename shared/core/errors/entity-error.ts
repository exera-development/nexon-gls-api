import BaseError from '../base-error'

abstract class EntityError implements BaseError {
  public readonly message: string

  constructor(message: string) {
    this.message = message
  }
}

export default EntityError
