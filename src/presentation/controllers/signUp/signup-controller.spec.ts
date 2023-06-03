import { type AccountModel } from '@/domain/models/account'
import { type AddAccount, type AddAccountModel } from '@/domain/usecases/add-account.use-case'
import { serverError } from './signup-controller.protocols'
import { SignUpController } from './signup-controller'

const makeFakeRequest = (): any => ({
  body: {
    name: 'any_name',
    email: 'any_emai@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()

  const sut = new SignUpController(addAccountStub)
  return {
    sut,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('Shoul return 500 if addAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const httpReponse = await sut.handle(makeFakeRequest())
    expect(httpReponse).toEqual(serverError(new Error(null)))
  })

  test('Shoul call AddAcount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addpSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addpSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_emai@mail.com',
      password: 'any_password'
    })
  })

  test('Shoul return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpReponse = await sut.handle(makeFakeRequest())
    expect(httpReponse.statusCode).toBe(200)
    console.log(httpReponse)
    expect(httpReponse.statusCode).toBe(200)
    expect(httpReponse.body).toEqual({ account: makeFakeAccount() })
  })
})
