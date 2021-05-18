/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-undef */
import { EventEmitter } from 'events';
import * as uuid from 'uuid';
import config from '../library/config';

export default class BitClout {
  private opts: { api: string; test?: boolean };

  private identityWindow: Window | null;

  private iframe: HTMLFrameElement;

  private iframeInitialized: boolean;

  private eventEmitter: EventEmitter;

  public constructor(opts?: { api?: string; test?: boolean }) {
    this.opts = (opts || {}) as any;
    this.opts.api = opts?.api || config.bitclout;
    this.opts.test = opts?.test;
    this.identityWindow = null;
    this.iframeInitialized = false;
    this.iframe = document.getElementById('identity') as HTMLFrameElement;
    this.eventEmitter = new EventEmitter();

    window.addEventListener(
      'message',
      async (message) => this.handleMessage(message),
      false,
    );
  }

  public async handleMessage(
    message: MessageEvent<{
      id: string;
      service: string;
      method: string;
      payload: Record<string, any>;
    }>,
  ) {
    const bitclout = this;

    if (message.data.service !== 'identity') {
      return;
    }

    const methods: Record<string, any> = {
      initialize: async () => {
        (message.source as any).postMessage(
          { id: message.data.id, service: message.data.service },
          message.origin,
        );
        if (!bitclout.iframeInitialized) {
          await bitclout.sendInfoSync();
          bitclout.iframeInitialized = true;
        }
      },
      login: async () => {
        if (!bitclout.identityWindow) return;

        bitclout.identityWindow.close();
        bitclout.identityWindow = null;

        localStorage.setItem(
          'identityUser',
          JSON.stringify(
            message.data.payload.users[message.data.payload.publicKeyAdded],
          ),
        );

        if (!message.data.payload.publicKeyAdded) {
          bitclout.eventEmitter.emit('logout', {});
          return;
        }

        const user =
          message.data.payload.users[message.data.payload.publicKeyAdded];

        const token = await bitclout.sendJWTSync({
          accessLevel: user.accessLevel,
          accessLevelHmac: user.accessLevelHmac,
          encryptedSeedHex: user.encryptedSeedHex,
        });

        bitclout.eventEmitter.emit('login', {
          token,
          publicKey: message.data.payload.publicKeyAdded,
        });
      },
    };
    const method =
      methods[message.data.method as string] ??
      function () {
        if (message.data.payload.jwt) {
          bitclout.eventEmitter.emit(message.data.id, message.data.payload.jwt);
          return;
        }
        bitclout.eventEmitter.emit(message.data.id, message.data.payload);
      };
    await method();
  }

  public sendInfoSync(): Promise<{
    hasStorageAccess: boolean;
    browserSupported: boolean;
  }> {
    return this.send<{
      hasStorageAccess: boolean;
      browserSupported: boolean;
    }>({
      method: 'info',
      payload: {},
    });
  }

  public async send<T>(params: { method: 'info' | 'jwt'; payload: any }) {
    return new Promise<T>((resolve, reject) => {
      if (!this.iframe) {
        reject(new Error('Not initialized yet'));
        return;
      }
      const id = uuid.v4();
      (this.iframe as any).contentWindow.postMessage(
        {
          id,
          service: 'identity',
          method: params.method,
          payload: params.payload,
        },
        '*',
      );
      this.eventEmitter.on(id, (data) => {
        return resolve(data);
      });
    });
  }

  public sendJWTSync(payload: {
    accessLevel: number;
    accessLevelHmac: string;
    encryptedSeedHex: string;
  }): Promise<string> {
    return this.send<string>({ method: 'jwt', payload });
  }

  public get pos() {
    return {
      x: window.outerHeight / 2 + window.screenY - 500,
      y: window.outerWidth / 2 + window.screenX - 400,
    };
  }

  public logoutAsync(publicKey: string) {
    return new Promise((resolve) => {
      this.identityWindow = window.open(
        `${this.opts.api}/logout?publicKey=${publicKey}`,
        'logout',
        `toolbar=no, width=800, height=1000, top=${this.pos.x}, left=${this.pos.y}`,
      );
      this.eventEmitter.on('logout', (message) => {
        return resolve(message);
      });
    });
  }

  public async loginAsync(accessLevel?: number) {
    return new Promise<{ token: string; publicKey: string }>(
      (resolve, reject) => {
        try {
          const queries = [];

          if (this.opts.test) {
            queries.push('testnet=true');
          }

          if (accessLevel !== undefined && accessLevel !== null) {
            queries.push(`accessLevelRequest=${accessLevel}`);
          }

          this.identityWindow = window.open(
            `${this.opts.api}/log-in${
              queries.length > 0 ? '?' : ''
            }${queries.join('&')}`,
            undefined,
            `toolbar=no, width=800, height=1000, top=${this.pos.x}, left=${this.pos.y}`,
          );
          this.eventEmitter.on('login', (message) => {
            return resolve(message);
          });
        } catch (error) {
          reject(error);
        }
      },
    );
  }
}
