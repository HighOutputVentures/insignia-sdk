import createUser from './user/create';
import authenticateUser from './token/authenticate';
import revokeToken from './token/revoke';
import BitClout from './bitclout';

export default class WebClient {
  private opts: { appId: string; host?: string; test?: boolean };

  private bitclout: BitClout;

  public constructor(opts: { appId: string; host?: string; test?: boolean }) {
    this.opts = opts;
    this.bitclout = new BitClout({ test: this.opts.test });
  }

  public get bitcloutAPI() {
    return this.bitclout;
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
      authenticate: async (input: Parameters<typeof authenticateUser>[2]) => {
        return authenticateUser(client.opts.host, client.opts.appId, input);
      },
      revoke: async (input: Parameters<typeof revokeToken>[2]) => {
        const payload = JSON.parse(
          Buffer.from(input.refreshToken.split('.')[1], 'base64').toString(),
        );
        await this.bitcloutAPI.logoutAsync(payload.externalId);
        return revokeToken(client.opts.host, client.opts.appId, input);
      },
    };
  }
}
