import R from 'ramda';
import deleteUser from './user/delete';
import listenEvents from './event/listen';
import fetchEvents from './event/fetch';
import updateUser from './user/update';
import createUser from './user/create';
import { ID } from './type';
import readUser from './user/read';
import readUsers from './user/read-all';

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
}
