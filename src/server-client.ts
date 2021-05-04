import { ID } from 'src/type';
import R from 'ramda';
import io from 'socket.io-client';
import createUser from 'src/user/create';
import updateUser from 'src/user/update';
import deleteUser from 'src/user/delete';
import listenEvents from 'src/event/listen';
import fetchEvents from 'src/event/fetch';
import config from './library/config';

export default class ServerClient {
  private opts: {
    appId: string;
    appKey: string;
    host?: string;
    socket: SocketIOClient.Socket;
  };

  public constructor(opts: { appId: string; appKey: string; host?: string }) {
    this.opts = {
      ...opts,
      socket: io(`${opts.host || config.host}`, {
        reconnectionDelayMax: 10000,
        path: '/events',
        query: {
          appId: opts.appId,
          appKey: opts.appKey,
        },
      }),
    };
  }

  public get user() {
    const client = this as ServerClient;
    return {
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
          { appId: client.opts.appId, socket: client.opts.socket },
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
