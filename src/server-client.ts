import { ID } from 'src/type';
import createUser from 'src/user/create';
import updateUser from 'src/user/update';
import deleteUser from 'src/user/delete';
import listenEvents from 'src/event/listen';
import fetchEvents from 'src/event/fetch';

export default class ServerClient {
  private opts: { appId: string; appKey: string; host?: string };

  public constructor(opts: { appId: string; appKey: string; host?: string }) {
    this.opts = opts;
  }

  public get user() {
    const client = this as ServerClient;
    return {
      create: (input: Parameters<typeof createUser>[2]) =>
        createUser(client.opts.host, client.opts, input),
      update: (id: ID, input: Parameters<typeof updateUser>[3]) =>
        updateUser(client.opts.host, client.opts, id, input),
      delete: (id: ID) => deleteUser(client.opts.host, client.opts, id),
    };
  }

  public get event() {
    const client = this as ServerClient;
    return {
      listen: ((input: Parameters<typeof listenEvents>[1]) =>
        listenEvents(client.opts.appId, input)) as (
        type: Parameters<typeof listenEvents>[1],
      ) => ReturnType<typeof listenEvents>,
      fetch: (input: Parameters<typeof fetchEvents>[2]) =>
        fetchEvents(client.opts.host, client.opts, input),
    };
  }
}
