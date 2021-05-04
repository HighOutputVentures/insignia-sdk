import createUser from 'src/user/create';
import authenticateUser from './token/authenticate';
import revokeToken from './token/revoke';

export default class WebClient {
  private opts: { appId: string; host?: string };

  public constructor(opts: { appId: string; host?: string }) {
    this.opts = opts;
  }

  public get user() {
    const client = this as WebClient;
    return {
      create: (input: Parameters<typeof createUser>[2]) =>
        createUser(client.opts.host, client.opts, input),
    };
  }

  public get token() {
    const client = this as WebClient;
    return {
      authenticate: (input: Parameters<typeof authenticateUser>[2]) =>
        authenticateUser(client.opts.host, client.opts.appId, input),
      revoke: (input: Parameters<typeof revokeToken>[2]) =>
        revokeToken(client.opts.host, client.opts.appId, input),
    };
  }
}
