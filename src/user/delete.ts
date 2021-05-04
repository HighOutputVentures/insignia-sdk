import fetch from 'node-fetch';
import config from 'src/library/config';
import createSignature from 'src/library/create-signature';
import Logger from 'src/library/logger';
import { ApplicationConfig, ID } from 'src/type';

const logger = Logger.tag('deleteUser');

export default async function deleteUser(
  host = config.host,
  appConfig: ApplicationConfig,
  user: ID,
) {
  const path = `/v1/users/${user}`;
  const url = `${host}${path}`;
  const body = JSON.stringify({});
  const method = 'DELETE';
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

  return true;
}
