export type Either<S, F> = Success<S, F> | Failure<S, F>

export class Success<S, F> {
  readonly value: S

  constructor(value: S) {
    this.value = value
  }

  isSuccess(): this is Success<S, F> {
    return true
  }

  isFailure(): this is Failure<S, F> {
    return false
  }
}

export class Failure<S, F> {
  readonly value: F

  constructor(value: F) {
    this.value = value
  }

  isSuccess(): this is Success<S, F> {
    return false
  }

  isFailure(): this is Failure<S, F> {
    return true
  }
}

export const success = <S, F>(value: S): Either<S, F> => {
  return new Success<S, F>(value)
}

export const failure = <S, F>(value: F): Either<S, F> => {
  return new Failure<S, F>(value)
}
