import R from 'ramda';
import deleteUser from './user/delete';
import listenEvents from './event/listen';
import fetchEvents from './event/fetch';
import updateUser from './user/update';
import createUser from './user/create';
import { ID } from './type';
import readUser from './user/read';
import readUsers from './user/read-all';
import authenticateUser from './token/authenticate';
import revokeToken from './token/revoke';
import authorizeBearerUser from './token/authorize-bearer';
import koaAuthorizationBearerMiddleware from './middleware/koa-authorization-bearer-middleware';

export default class ServerClient {
  private opts: {
    appId: string;
    appKey: string;
    host?: string;
  };

  public constructor(opts: { appId: string; appKey: string; host?: string }) {
    this.opts = opts;
  }

  public get user() {
    const client = this as ServerClient;
    return {
      read: (input: Parameters<typeof readUser>[2]) =>
        readUser(
          client.opts.host,
          R.pick(['appId', 'appKey'])(client.opts),
          input,
        ),
      readAll: (input: Parameters<typeof readUsers>[2]) =>
        readUsers(
          client.opts.host,
          R.pick(['appId', 'appKey'])(client.opts),
          input,
        ),
      create: (input: Parameters<typeof createUser>[2]) =>
        createUser(
          client.opts.host,
          R.pick(['appId', 'appKey'])(client.opts),
          input,
        ),
      update: (id: ID, input: Parameters<typeof updateUser>[3]) =>
        updateUser(
          client.opts.host,
          R.pick(['appId', 'appKey'])(client.opts),
          id,
          input,
        ),
      delete: (id: ID) =>
        deleteUser(
          client.opts.host,
          R.pick(['appId', 'appKey'])(client.opts),
          id,
        ),
    };
  }

  public get event() {
    const client = this as ServerClient;
    return {
      listen: ((input: Parameters<typeof listenEvents>[1]) =>
        listenEvents(
          {
            appId: client.opts.appId,
            appKey: client.opts.appKey,
            host: client.opts.host,
          },
          input,
        )) as (
        type: Parameters<typeof listenEvents>[1],
      ) => ReturnType<typeof listenEvents>,
      fetch: (input: Parameters<typeof fetchEvents>[2]) =>
        fetchEvents(
          client.opts.host,
          R.pick(['appId', 'appKey'])(client.opts),
          input,
        ),
    };
  }

  public get middleware() {
    const client = this as ServerClient;
    return {
      koaAuthorizationBearer: (
        input: Parameters<typeof koaAuthorizationBearerMiddleware>[1],
      ) => koaAuthorizationBearerMiddleware(client.opts.appKey, input),
    };
  }

  public get token() {
    const client = this as ServerClient;
    return {
      authenticate: (input: Parameters<typeof authenticateUser>[2]) =>
        authenticateUser(client.opts.host, client.opts.appId, input),
      authorizeBearer: (input: Parameters<typeof authenticateUser>[1]) =>
        authorizeBearerUser(client.opts.appKey, input),
      revoke: (input: Parameters<typeof revokeToken>[2]) =>
        revokeToken(client.opts.host, client.opts.appId, input),
    };
  }
}
