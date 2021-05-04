import createUser from 'src/user/create';
import authenticateUser from './token/authenticate';
import revokeToken from './token/revoke';

export default class WebClient {
  private appConfig: { appId: string };

  public constructor(appConfig: { appId: string }) {
    this.appConfig = appConfig;
  }

  public get user() {
    const client = this as WebClient;
    return {
      create: (input: Parameters<typeof createUser>[1]) =>
        createUser(client.appConfig, input),
    };
  }

  public get token() {
    const client = this as WebClient;
    return {
      authenticate: (input: Parameters<typeof authenticateUser>[1]) =>
        authenticateUser(client.appConfig.appId, input),
      revoke: (input: Parameters<typeof revokeToken>[1]) =>
        revokeToken(client.appConfig.appId, input),
    };
  }
}
