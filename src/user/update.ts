import fetch from 'node-fetch';
import { ApplicationConfig, CustomResponse, ID, User } from '../type';
import config from '../library/config';
import createSignature from '../library/create-signature';
import Logger from '../library/logger';

const logger = Logger.tag('updateUser');

export default async function updateUser(
  host = config.host,
  appConfig: ApplicationConfig,
  user: ID,
  input: Partial<Pick<User, 'isVerified' | 'groups' | 'details'>>,
): Promise<CustomResponse<boolean>> {
  const path = `/v1/users/${user}`;
  const url = `${host}${path}`;
  const body = JSON.stringify(input);
  const method = 'PATCH';
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
