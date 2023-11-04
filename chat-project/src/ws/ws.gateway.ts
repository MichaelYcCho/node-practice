import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway({ port: 8080 }) // 웹 소켓 서버가 8080 포트에서 수신 대기합니다.
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message') // 클라이언트로부터 'message' 이벤트를 수신합니다.
  handleMessage(client: any, payload: any): string {
    // 클라이언트로부터 메시지를 받아 모든 클라이언트에게 메시지를 브로드캐스트합니다.
    this.server.emit('message', payload);
    return 'Message received!';
  }
}
