export class ServerError extends Error {
  constructor (stack?: string | null) {
    super('Internal server Error')
    this.name = 'ServerError'
    this.stack = stack
  }
}
