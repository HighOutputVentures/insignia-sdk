import { Buffer } from 'buffer';
import BitClout from '../bitclout';
import authenticateUser from './library/authenticate-user';
import createUser from './library/create-user';
import revokeToken from './library/revoke-token';

export default class WebClient {
  private opts: { appId: string; host?: string; test?: boolean };

  private bitcloutInstance: BitClout;

  public constructor(opts: { appId: string; host?: string; test?: boolean }) {
    this.opts = opts;
    this.bitcloutInstance = new BitClout({ test: this.opts.test });
  }

  public get bitclout() {
    return this.bitcloutInstance;
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
        await this.bitcloutInstance.logoutAsync(payload.externalId);
        return revokeToken(client.opts.host, client.opts.appId, input);
      },
    };
  }
}
