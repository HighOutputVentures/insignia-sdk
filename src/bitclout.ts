/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-undef */
import { EventEmitter } from 'events';
import * as uuid from 'uuid';
import config from './library/config';

export default class BitClout {
  private opts: { api: string; test?: boolean };

  private identityWindow: Window | null;

  private iframe: HTMLIFrameElement | undefined;

  private eventEmitter: EventEmitter;

  public constructor(opts?: { api?: string; test?: boolean }) {
    this.opts = (opts || {}) as any;
    this.opts.api = opts?.api || config.bitclout;
    this.opts.test = opts?.test;
    this.eventEmitter = new EventEmitter();
    this.identityWindow = null;
    document.body.onload = () => {
      this.iframe = document.getElementById('identity') as HTMLIFrameElement;
      if (!this.iframe) {
        this.initializeIFrame();
      }
    };

    window.addEventListener(
      'message',
      async (message) => this.handleMessage(message),
      false,
    );
  }

  private initializeIFrame() {
    this.iframe = document.createElement('iframe');
    this.iframe.id = 'identity';
    this.iframe.src = 'https://identity.bitclout.com/embed';
    (this.iframe as any).frameBorder = 0;
    this.iframe.style.width = '100vw';
    this.iframe.style.height = '100vh';
    this.iframe.style.display = 'none';
    document.body.appendChild(this.iframe);
  }

  private async handleMessage(
    message: MessageEvent<{
      id: string;
      service: string;
      method: string;
      payload: Record<string, any>;
    }>,
  ) {
    console.log('handle-message', message.data);
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
        await bitclout.sendInfoSync();
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

  private async send<T>(params: { method: 'info' | 'jwt'; payload: any }) {
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
        console.log('send', params.method, data);
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

  public get position() {
    return {
      x: window.outerHeight / 2 + window.screenY - 500,
      y: window.outerWidth / 2 + window.screenX - 400,
    };
  }

  public logoutAsync(publicKey: string) {
    return new Promise((resolve, reject) => {
      try {
        const queries = [`publicKey=${publicKey}`];
        if (this.opts.test) {
          queries.push('testnet=true');
        }
        this.identityWindow = window.open(
          `${this.opts.api}/logout?${queries.join('&')}`,
          'logout',
          `toolbar=no, width=800, height=1000, top=${this.position.x}, left=${this.position.y}`,
        );
        this.eventEmitter.on('logout', (message) => {
          return resolve(message);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  public async loginAsync(accessLevel?: number) {
    return new Promise<{ token: string; publicKey: string }>(
      (resolve, reject) => {
        try {
          const queries = [`accessLevelRequest=${accessLevel || 4}`];

          if (this.opts.test) {
            queries.push('testnet=true');
          }

          this.identityWindow = window.open(
            `${this.opts.api}/log-in${
              queries.length > 0 ? '?' : ''
            }${queries.join('&')}`,
            undefined,
            `toolbar=no, width=800, height=1000, top=${this.position.x}, left=${this.position.y}`,
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
