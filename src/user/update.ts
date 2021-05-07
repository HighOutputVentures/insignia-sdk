import fetch from 'node-fetch';
import R from 'ramda';
import InvalidRequestError from '../library/errors/invalid-request-error';
import { ApplicationConfig, ID, User } from '../type';
import config from '../library/config';
import createSignature from '../library/create-signature';
import Logger from '../library/logger';

const logger = Logger.tag('updateUser');

export default async function updateUser(
  host = config.host,
  appConfig: ApplicationConfig,
  user: ID,
  input: Partial<
    Pick<User, 'isVerified' | 'groups' | 'details'> & { password: string }
  >,
): Promise<boolean> {
  let body: any = R.pick(['isVerified', 'groups', 'details'])(input);
  if (input.password) {
    body = {
      ...body,
      credentials: {
        password: input.password,
      },
    };
  }

  const path = `/v1/users/${user}`;
  const url = `${host}${path}`;
  body = JSON.stringify(body);
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

  const responseBody = JSON.parse((result as any) || {});

  if (responseBody.error) {
    throw new InvalidRequestError(
      responseBody.error.message,
      responseBody.error.meta,
    );
  }

  return true;
}
