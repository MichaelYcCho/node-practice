// app.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { WebsocketClientService } from './web-sockets/websocket-client.service';

@Controller()
export class AppController {
  constructor(
    private readonly websocketClientService: WebsocketClientService,
  ) {}

  @Get('connect-and-send-message')
  async connectAndSendMessage(
    @Query('message') message: string,
  ): Promise<string> {
    try {
      await this.websocketClientService.connectToWebSocketServer(
        'ws://localhost:8765',
      );
      await this.websocketClientService.sendMessage(message);
      this.websocketClientService.disconnectFromWebSocketServer();
      return 'Message sent to the WebSocket server';
    } catch (error) {
      console.error(error);
      return 'Failed to send message';
    }
  }
}
