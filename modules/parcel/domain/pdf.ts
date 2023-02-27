import Entity, { EntityCreationError } from '../../../shared/core/entity'
import { Either, success } from '../../../shared/core/result'

export type PdfProps = {
  name: string
  filePath: string
}

class Pdf extends Entity {
  private _name: string
  public get name(): string {
    return this._name
  }

  private _filePath: string
  public get filePath(): string {
    return this._filePath
  }

  private constructor(name: string, filePath: string) {
    super()
    this._name = name
    this._filePath = filePath
  }

  public static create({
    name,
    filePath,
  }: PdfProps): Either<Pdf, EntityCreationError> {
    // TODO: handle validation of name and filePath
    return success(new Pdf(name, filePath))
  }
}

export default Pdf
