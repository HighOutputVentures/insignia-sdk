import AppError from '@highoutput/error';

export default class AccessTokenExpiredError extends AppError {
  constructor() {
    super('Access token is expired.', 'ACCESS_TOKEN_EXPIRED');
  }
}
