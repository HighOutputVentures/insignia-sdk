import { hmac } from 'highoutput-utilities';
import R from 'ramda';
import { URL } from 'url';

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
    new URL(params.host).hostname,
    params.path,
    params.appId,
    params.query,
    params.body,
  ]
    .filter(R.identity)
    .join('\n');

  return hmac(stringToSign, appKey).toString('base64');
}
