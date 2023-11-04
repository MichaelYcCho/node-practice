import { Module } from '@nestjs/common';
import { WsGateway } from 'src/ws/ws.gateway';

@Module({
  providers: [WsGateway], // 여기에 게이트웨이를 추가
})
export class WebSocketsModule {}
