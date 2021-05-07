import fetch from 'node-fetch';
import InvalidRequestError from '../library/errors/invalid-request-error';
import config from '../library/config';
import createSignature from '../library/create-signature';
import Logger from '../library/logger';
import { ConnectionEdge, UserEvent } from '../type';

const logger = Logger.tag('fetchEvents');

export default async function fetchEvents(
  host = config.host,
  appConfig: {
    appId: string;
    appKey: string;
  },
  params: Partial<{
    filter: Pick<UserEvent, 'type'>;
    sort: 'ASC' | 'DESC';
    size: number;
    after: Buffer;
    before: Buffer;
  }>,
): Promise<ConnectionEdge<UserEvent>> {
  const queryString = `page=${Buffer.from(JSON.stringify(params)).toString(
    'base64',
  )}`;
  const path = '/v1/events';
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

  const result = await response.json();
  logger.verbose('response', { status: response.status, result });
  if (result.error) {
    throw new InvalidRequestError(result.error.message, result.error.meta);
  }

  return JSON.parse(result);
}
