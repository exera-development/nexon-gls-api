import { NextFunction, Request, Response } from 'express'

class Middleware {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  checkApiKey() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      if (req.headers.authorization !== `Bearer ${this.apiKey}`) {
        return res.status(401).json({ message: 'Invalid API key' })
      }

      next()
    }
  }
}

export default Middleware
