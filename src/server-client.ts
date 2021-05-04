import { ID } from 'src/type';
import createUser from 'src/user/create';
import updateUser from 'src/user/update';
import deleteUser from 'src/user/delete';
import listenEvents from 'src/event/listen';
import fetchEvents from 'src/event/fetch';

export default class ServerClient {
  private appConfig: { appId: string; appKey: string };

  public constructor(appConfig: { appId: string; appKey: string }) {
    this.appConfig = appConfig;
  }

  public get user() {
    const client = this as ServerClient;
    return {
      create: (input: Parameters<typeof createUser>[1]) =>
        createUser(client.appConfig, input),
      update: (id: ID, input: Parameters<typeof updateUser>[2]) =>
        updateUser(client.appConfig, id, input),
      delete: (id: ID) => deleteUser(client.appConfig, id),
    };
  }

  public get event() {
    const client = this as ServerClient;
    return {
      listen: ((input: Parameters<typeof listenEvents>[1]) =>
        listenEvents(client.appConfig, input)) as (
        type: Parameters<typeof listenEvents>[1],
      ) => ReturnType<typeof listenEvents>,
      fetch: (input: Parameters<typeof fetchEvents>[1]) =>
        fetchEvents(client.appConfig, input),
    };
  }
}
