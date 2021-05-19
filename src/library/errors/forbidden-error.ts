import AppError from '@highoutput/error';

export default class ForbiddenError extends AppError {
  public constructor(message: string, meta?: Record<string, any>) {
    super('FORBIDDEN', message, meta);
  }
}
