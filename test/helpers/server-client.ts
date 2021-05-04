import { ServerClient } from '../../src/index';
import chance from './chance';

const serverClient = new ServerClient({
  appId: chance.guid(),
  appKey: chance.guid(),
  host: 'http://localhost:3000',
});
export default serverClient;
