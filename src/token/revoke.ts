import fetch from 'node-fetch';
import InvalidRequestError from '../library/errors/invalid-request-error';
import config from '../library/config';
import Logger from '../library/logger';
import { ID } from '../type';

const logger = Logger.tag('revokeToken');

export default async function revokeToken(
  host = config.host,
  appId: ID,
  input: { refreshToken: string },
): Promise<boolean> {
  const path = '/v1/revoke';
  const url = `${host}${path}`;
  const body = JSON.stringify(input);
  const method = 'POST';
  const options = {
    method,
    headers: {
      'Content-type': 'application/json',
      'App-Id': appId,
    },
    body,
  };

  logger.verbose('request', { url, options });

  const response = await fetch(url, options);

  const result = await response.json();
  logger.verbose('response', { status: response.status, result });

  if (result.error) {
    throw new InvalidRequestError(result.error.message, result.error.meta);
  }

  return true;
}
