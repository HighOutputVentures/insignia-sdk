import omit from 'ramda/src/omit';
import mergeRight from 'ramda/src/mergeRight';
import config from '../../library/config';
import createSignature from '../../library/create-signature';
import { User } from '../../type';

export default async function createUser(
  host = config.host,
  appConfig: { appId: string; appKey?: string },
  input: Pick<User, 'username'> &
    Partial<Omit<User, 'id' | 'username'>> & { password: string },
): Promise<User> {
  const path = '/v1/users';
  const url = `${host}${path}`;
  const body = JSON.stringify({
    ...omit(['password'])(input),
    credentials: { password: input.password },
  });
  const method = 'POST';
  const signature: Record<string, string> = appConfig.appKey
    ? {
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
      }
    : {};
  const options = {
    method,
    headers: mergeRight(
      {
        'Content-type': 'application/json',
        'App-Id': appConfig.appId,
      },
      signature,
    ),
    body,
  };

  const response = await fetch(url, options);

  const result = await response.text();

  const responseBody = JSON.parse((result as any) || {});

  if (responseBody.error) {
    throw new Error(responseBody.error.message);
  }

  return responseBody;
}
