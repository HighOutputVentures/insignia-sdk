import { EventEmitter } from 'events';
import { UserEvent, UserEventType } from '../type';

class CustomEventEmitter extends EventEmitter {
  on(input: 'data', cb: (data: UserEvent) => void) {
    super.on(input, cb);
    return this;
  }
}

export default function listenEvents(
  options: { appId: string; socket: SocketIOClient.Socket },
  type?: UserEventType,
) {
  const userEventEmitter = new CustomEventEmitter();

  options.socket.on(`${options.appId}:events`, (message: string) => {
    const event: UserEvent = JSON.parse(message);

    if (type && type !== event.type) {
      return;
    }
    userEventEmitter.emit('data', event);
  });
  return userEventEmitter;
}
