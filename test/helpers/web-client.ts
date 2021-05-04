import { WebClient } from 'src/index';
import chance from './chance';

const webClient = new WebClient({
  appId: chance.guid(),
  host: 'http://localhost:3000',
});
export default webClient;
