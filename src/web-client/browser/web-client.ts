import { Buffer } from 'buffer';
import BitClout from '../bitclout';
import authenticateUser from './library/authenticate-user';
import revokeToken from './library/revoke-token';

export default class WebClient {
  private opts: { appId: string; host?: string; test?: boolean };

  private bitclout: BitClout;

  public constructor(opts: { appId: string; host?: string; test?: boolean }) {
    this.opts = opts;
    this.opts.test = this.opts.test || false;
    this.bitclout = new BitClout({ test: this.opts.test });
  }

  public get bitcloutAPI() {
    return this.bitclout;
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
