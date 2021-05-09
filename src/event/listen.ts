/* eslint-disable @typescript-eslint/explicit-member-accessibility, no-dupe-class-members */
import { EventEmitter } from 'events';
import io from 'socket.io-client';
import config from '../library/config';
import { UserEvent, UserEventType } from '../type';

class CustomEventEmitter extends EventEmitter {
  on(input: UserEventType, cb: (data: UserEvent) => any): this;

  on(input: 'data', cb: (data: UserEvent) => any): this;

  on(input: UserEventType | 'data', cb: (data: UserEvent) => any) {
    super.on(input, cb as any);
    return this;
  }
}

export default function listenEvents(
  appConfig: {
    host?: string;
    appId: string;
    appKey: string;
  },
  options: {
    startFromLastEventCursor?: string | false | null;
    type?: UserEventType;
    reconnect?: boolean;
  },
) {
  const { startFromLastEventCursor } = options;

  const socket = io(`${appConfig.host || config.host}`, {
    reconnectionDelayMax: 10000,
    reconnection: options.reconnect || false,
    path: '/events',
    query: {
      appId: appConfig.appId,
      appKey: appConfig.appKey,
      startFromLastEventCursor,
    },
  });
  const userEventEmitter = new CustomEventEmitter();

  socket.on(`${appConfig.appId}:events`, (message: string) => {
    const event: UserEvent = JSON.parse(message);
    if (options.type && options.type !== event.type) {
      return;
    }
    userEventEmitter.emit(event.type, event);
    userEventEmitter.emit('data', event);
  });
  return userEventEmitter;
}
