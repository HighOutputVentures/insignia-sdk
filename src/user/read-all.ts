import fetch from 'node-fetch';
import config from 'src/library/config';
import createSignature from 'src/library/create-signature';
import Logger from 'src/library/logger';
import { ApplicationConfig, User } from 'src/type';

const logger = Logger.tag('readUsers');

export default async function readUsers(
  host = config.host,
  appConfig: ApplicationConfig,
  params: Partial<{
    filter: Pick<User, 'username' | 'isEmailVerified' | 'isVerified'>;
    sort: 'ASC' | 'DESC';
    size: number;
    after: Buffer;
    before: Buffer;
  }>,
) {
  const queryString = `page=${Buffer.from(JSON.stringify(params)).toString(
    'base64',
  )}`;
  const path = `/v1/users`;
  const url = `${host}${path}?${queryString}`;
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
          query: queryString,
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

  return JSON.parse(result);
}
