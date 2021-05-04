import { EventEmitter } from 'events';
import crypto from 'crypto';
import io from 'socket.io-client';
import config from 'src/library/config';
import { ApplicationConfig, UserEvent, UserEventType } from 'src/type';

const decrypt = (hash: { iv: string; appKey: string; data: string }) => {
  const iv = Buffer.from(hash.iv, 'hex');
  const key = crypto
    .createHash('sha256')
    .update(hash.appKey)
    .digest('base64')
    .substr(0, 32);
  const encryptedText = Buffer.from(hash.data, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

const socket = io(`${config.baseURL}/socket`, {
  reconnectionDelayMax: 10000,
});

class CustomEventEmitter extends EventEmitter {
  on(input: 'data', cb: (data: UserEvent) => void) {
    super.on(input, cb);
    return this;
  }
}

const userEvents = new CustomEventEmitter();

export default function listenEvents(
  appConfig: ApplicationConfig,
  type?: UserEventType,
) {
  socket.on(
    `${appConfig.appId}:events`,
    (message: { iv: string; data: string }) => {
      const event: UserEvent = JSON.parse(
        decrypt({ ...message, appKey: appConfig.appKey }),
      );

      if (type && type !== event.type) {
        return;
      }
      userEvents.emit('data', event);
    },
  );
  return userEvents;
}
