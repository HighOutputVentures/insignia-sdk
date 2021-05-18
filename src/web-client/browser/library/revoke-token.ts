import config from '../../../library/config';

export default async function revokeToken(
  host = config.host,
  appId: string,
  input: { refreshToken: string },
): Promise<boolean> {
  const path = '/v1/revoke';
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
    throw responseBody.error;
  }

  return true;
}
