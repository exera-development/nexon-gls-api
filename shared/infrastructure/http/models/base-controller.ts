import { Request, Response } from 'express'

abstract class BaseController {
  protected abstract executeImpl(
    req: Request,
    res: Response
  ): Promise<void | unknown>

  public async execute(req: Request, res: Response): Promise<void> {
    try {
      await this.executeImpl(req, res)
    } catch (err) {
      console.error('[BaseController] Uncaught controller error')
      console.error(err)
      this.fail(res, 'An unexpected error occured')
    }
  }

  public static jsonResponse(res: Response, code: number, message: string) {
    return res.status(code).json({ message })
  }

  public ok<T>(res: Response, dto?: T) {
    return !!dto ? res.status(200).json(dto) : res.sendStatus(200)
  }

  public clientError(res: Response, message?: string) {
    return BaseController.jsonResponse(
      res,
      400,
      message ? message : 'Bad Request'
    )
  }

  public fail(res: Response, error: Error | string) {
    console.error(error)
    return res.status(500).json({
      message: error.toString(),
    })
  }
}

export default BaseController
