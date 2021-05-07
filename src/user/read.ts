import fetch from 'node-fetch';
import InvalidRequestError from '../library/errors/invalid-request-error';
import config from '../library/config';
import createSignature from '../library/create-signature';
import Logger from '../library/logger';
import { ApplicationConfig, ID, User } from '../type';

const logger = Logger.tag('readUser');

export default async function readUser(
  host = config.host,
  appConfig: ApplicationConfig,
  user: ID,
): Promise<User> {
  const path = `/v1/users/${user}`;
  const url = `${host}${path}`;
  const body = JSON.stringify({});
  const method = 'GET';
  const options = {
    method,
    headers: {
      'Content-type': 'application/json',
      'App-Id': appConfig.appId,
      Signature: createSignature(
        {
          method,
          path,
          body,
          host,
          appId: appConfig.appId,
        },
        appConfig.appKey,
      ),
    },
    body,
  };

  logger.verbose('request', { url, options });

  const response = await fetch(url, options);

  const result = await response.text();
  logger.verbose('response', { status: response.status, result });

  const responseBody = JSON.parse((result as any) || {});

  if (responseBody.error) {
    throw new InvalidRequestError(
      responseBody.error.message,
      responseBody.error.meta,
    );
  }

  return responseBody;
}
