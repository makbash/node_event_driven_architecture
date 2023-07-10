export default class AppError extends Error {
  status: string

  isOperational: boolean

  desciption: any

  constructor(public statusCode: number = 500, public message: string, desciption: any = null) {
    super(message)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true
    this.desciption = desciption

    Error.captureStackTrace(this, this.constructor)
  }
}
