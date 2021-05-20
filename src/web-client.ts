import createUser from './user/create';
import authenticateUser from './token/authenticate';
import revokeToken from './token/revoke';
import BitClout from './bitclout';

export default class WebClient {
  private opts: {
    appId: string;
    host?: string;
    browser?: boolean;
    bitcloutTestnet?: boolean;
  };

  private bitcloutInstance: BitClout | undefined;

  public constructor(opts: {
    appId: string;
    host?: string;
    browser?: boolean;
    bitcloutTestnet?: boolean;
  }) {
    this.opts = opts;
    if (opts.browser)
      this.bitcloutInstance = new BitClout({ test: this.opts.bitcloutTestnet });
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
        if (this.bitcloutInstance) {
          const payload = JSON.parse(
            Buffer.from(input.refreshToken.split('.')[1], 'base64').toString(),
          );
          await this.bitcloutInstance.logoutAsync(payload.externalId);
        }
        return revokeToken(client.opts.host, client.opts.appId, input);
      },
    };
  }
}
