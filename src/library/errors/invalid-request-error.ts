import AppError from '@highoutput/error';

export default class InvalidRequestError extends AppError {
  public constructor(message: string, meta?: Record<string, any>) {
    super('INVALID_REQUEST', message, meta);
  }
}
