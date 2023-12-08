import { io } from 'socket.io-client';
import { ClickstreamAnalytics } from '@aws/clickstream-web';

class SocketioService {
  socket;
  constructor() {}

  setupSocketConnection() {
    this.socket = io('http://localhost:4001');
    this.socket.emit('my message', 'Hello there from Vue.');
    this.socket.on('my broadcast', (data) => {
      ClickstreamAnalytics.record({
        name: 'receive_websocket',
        attributes: { message:  data}
      });
      console.log(data);
    });
  }

  sendMessage(msg) {
    ClickstreamAnalytics.record({
      name: 'send_websocket',
      attributes: { message:  msg}
    });
    this.socket = io('http://localhost:4001');
    this.socket.emit('my message', msg);
  }
  
}

export default new SocketioService();