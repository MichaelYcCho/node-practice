import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(8080, { transports: ['websocket'] })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  // Clinet에서 Server로 보내는 메시지
  //클라이언트에서 toServer 이름으로 메세지를 보내면 서버에선 메세지의 body에서 데이터를 읽어와 그대로 toServer 이름으로 보냄
  @SubscribeMessage('toServer')
  async handleMessage(@MessageBody() data) {
    console.log(data);
    this.server.emit('toClient', data);
  }
}
