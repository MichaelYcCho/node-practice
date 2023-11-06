import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { WebSocketsModule } from './web-sockets/web-sockets.module';
import { WsGateway } from './ws/ws.gateway';

@Module({
  imports: [EventsModule, WebSocketsModule],
  controllers: [AppController],
  providers: [AppService, WsGateway],
})
export class AppModule {}
