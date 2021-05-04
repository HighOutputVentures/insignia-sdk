import { EventEmitter } from 'events';
import io from 'socket.io-client';
import config from 'src/library/config';
import { UserEvent, UserEventType } from 'src/type';

const socket = io(`${config.host}/socket`, {
  reconnectionDelayMax: 10000,
});
class CustomEventEmitter extends EventEmitter {
  on(input: 'data', cb: (data: UserEvent) => void) {
    super.on(input, cb);
    return this;
  }
}

const userEvents = new CustomEventEmitter();

export default function listenEvents(appId: string, type?: UserEventType) {
  socket.on(`${appId}:events`, (message: any) => {
    const event: UserEvent = JSON.parse(message);

    if (type && type !== event.type) {
      return;
    }
    userEvents.emit('data', event);
  });
  return userEvents;
}
