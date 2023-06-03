import { type HttpResponse } from '../../protocols/http'
import { ServerError } from '../../errors'

export const serverError = (error: Error): HttpResponse => (
  {
    statusCode: 500,
    body: new ServerError(error.stack)
  })
