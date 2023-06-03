import { type AddAccount } from '@/domain/usecases/add-account.use-case'
import {
  serverError,
  type Controller,
  type HttpRequest,
  type HttpResponse
} from './signup-controller.protocols'

export class SignUpController implements Controller {
  constructor (private readonly addAccount: AddAccount) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password } = httpRequest.body
      await this.addAccount.add({
        name,
        email,
        password
      })
      return new Promise(() => (null))
    } catch (error) {
      return serverError(error)
    }
  }
}
