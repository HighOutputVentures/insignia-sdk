import fetch from 'node-fetch';
import config from '../library/config';
import Logger from '../library/logger';
import { CustomResponse, ID } from '../type';

const logger = Logger.tag('authenticateUser');

export default async function authenticateUser(
  host = config.host,
  appId: ID,
  input:
    | { grantType: 'refreshToken'; refreshToken: string }
    | { grantType: 'password'; username: string; password: string },
): Promise<
  CustomResponse<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }>
> {
  const path = '/v1/authenticate';
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

  return JSON.parse(result);
}
