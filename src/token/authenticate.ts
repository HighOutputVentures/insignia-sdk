import fetch from 'node-fetch';
import config from 'src/library/config';
import Logger from 'src/library/logger';
import { ID } from 'src/type';

const logger = Logger.tag('authenticateUser');

export default async function authenticateUser(
  appId: ID,
  input:
    | { grantType: 'refreshToken'; refreshToken: string }
    | { grantType: 'password'; username: string; password: string },
) {
  const path = `/v1/authenticate`;
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

  return JSON.parse(result) as {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}
