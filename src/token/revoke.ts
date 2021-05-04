import fetch from 'node-fetch';
import config from 'src/library/config';
import Logger from 'src/library/logger';
import { ID } from 'src/type';

const logger = Logger.tag('revokeToken');

export default async function revokeToken(
  appId: ID,
  input: { refreshToken: string },
) {
  const path = `/v1/revoke`;
  const url = `${config.baseURL}${path}`;
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
