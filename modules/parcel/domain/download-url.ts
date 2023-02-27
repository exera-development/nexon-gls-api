import Entity, { EntityCreationError } from '../../../shared/core/entity'
import { Either, success } from '../../../shared/core/result'

export type DownloadUrlProps = {
  url: string
}

class DownloadUrl extends Entity {
  private _url: string
  public get url(): string {
    return this._url
  }

  private constructor(url: string) {
    super()
    this._url = url
  }

  public static create({
    url,
  }: DownloadUrlProps): Either<DownloadUrl, EntityCreationError> {
    // TODO: handle validation of url
    return success(new DownloadUrl(url))
  }
}

export default DownloadUrl
