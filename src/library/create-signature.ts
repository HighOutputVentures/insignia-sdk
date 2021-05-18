import crypto from 'crypto';
import Url from 'url-parse';

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
    new Url(params.host).hostname,
    params.path,
    params.appId,
    params.query,
    params.body,
  ]
    .filter((value) => !!value)
    .join('\n');

  return crypto
    .createHmac('sha256', appKey)
    .update(stringToSign)
    .digest()
    .toString('base64');
}
