import fetch from 'node-fetch';
import config from '../library/config';
import Logger from '../library/logger';
import { ID } from '../type';

const logger = Logger.tag('revokeToken');

export default async function revokeToken(
  host = config.host,
  appId: ID,
  input: { refreshToken: string },
) {
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

  const result = await response.text();
  logger.verbose('response', { status: response.status, result });

  return true;
}
