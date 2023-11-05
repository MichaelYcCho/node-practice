import { Controller, Get } from '@nestjs/common';
import { WebsocketClientService } from './web-sockets/websocket-client.service';

@Controller()
export class AppController {
  constructor(
    private readonly websocketClientService: WebsocketClientService,
  ) {}

  @Get('send-message')
  sendMessage(): string {
    const message = 'Hello from NestJS client!';
    this.websocketClientService.sendMessage(message);
    return 'Message sent to the WebSocket server';
  }
}
