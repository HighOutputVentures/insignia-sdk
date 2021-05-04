import fetch from 'node-fetch';
import R from 'ramda';
import config from 'src/library/config';
import createSignature from 'src/library/create-signature';
import Logger from 'src/library/logger';
import { User } from 'src/type';

const logger = Logger.tag('createUser');

export default async function createUser(
  appConfig: { appId: string; appKey?: string },
  input: Pick<User, 'username'> &
    Partial<Omit<User, 'id' | 'username'>> & { password: string },
) {
  const path = '/v1/users';
  const url = `${config.baseURL}${path}`;
  const body = JSON.stringify({
    ...R.omit(['password'])(input),
    credential: { password: input.password },
  });
  const method = 'POST';
  const signature: Record<string, any> = appConfig.appKey
    ? {
        Signature: createSignature(
          {
            method,
            path,
            body,
            host: config.baseURL,
            appId: appConfig.appId,
          },
          appConfig.appKey,
        ),
      }
    : {};
  const options = {
    method,
    headers: R.mergeRight(
      {
        'Content-type': 'application/json',
        'App-Id': appConfig.appId,
      },
      signature,
    ),
    body,
  };

  logger.verbose('request', { url, options });

  const response = await fetch(url, options);

  const result = await response.text();
  logger.verbose('response', { status: response.status, result });

  return JSON.parse(result) as User;
}
