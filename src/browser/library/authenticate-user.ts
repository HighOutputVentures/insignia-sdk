import config from '../../library/config';

/* eslint-disable no-undef */
export default async function authenticateUser(
  host = config.host,
  appId: string,
  input:
    | {
        grantType: 'bitclout';
        token: string;
        publicKey: string;
      }
    | { grantType: 'refreshToken'; refreshToken: string }
    | { grantType: 'password'; username: string; password: string },
): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}> {
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

  const response = await fetch(url, options);

  const result = await response.text();

  const responseBody = JSON.parse((result as any) || {});

  if (responseBody.error) {
    throw new Error(responseBody.error.message);
  }

  return responseBody;
}
