import { hmac } from 'highoutput-utilities';
import R from 'ramda';

export default function createSignature(
  params: {
    method: string;
    host: string;
    path: string;
    appId: string;
    query?: string;
    body: string;
  },
  appKey: string,
) {
  const stringToSign = [
    params.method,
    params.host,
    params.path,
    params.appId,
    params.query,
    params.body,
  ]
    .filter(R.identity)
    .join('\n');

  return hmac(stringToSign, appKey).toString('base64');
}
