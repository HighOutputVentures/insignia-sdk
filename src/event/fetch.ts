import fetch from 'node-fetch';
import config from 'src/library/config';
import createSignature from 'src/library/create-signature';
import Logger from 'src/library/logger';
import { User, UserEvent } from 'src/type';

const logger = Logger.tag('fetchEvents');

export default async function fetchEvents(
  appConfig: {
    appId: string;
    appKey: string;
  },
  params: Partial<{
    filter: Pick<UserEvent, 'type'>;
    sort: 'ASC' | 'DESC';
    size: number;
    after: Buffer;
  }>,
) {
  const queryString = `page=${Buffer.from(JSON.stringify(params)).toString(
    'base64',
  )}`;
  const path = '/v1/events';
  const url = `${config.baseURL}${path}?${queryString}`;
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
          host: config.baseURL,
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

  return JSON.parse(result) as User;
}
