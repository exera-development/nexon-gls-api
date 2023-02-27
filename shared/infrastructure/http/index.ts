import { app } from '../config'
import Middleware from './models/middleware'

const middleware = new Middleware(app.apiKey)

export { middleware }
