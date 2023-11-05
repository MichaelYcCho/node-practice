import { Injectable } from '@nestjs/common';
import * as WebSocket from 'ws';

@Injectable()
export class WebsocketClientService {
  private wsClient: WebSocket;

  constructor() {
    this.connect();
  }

  private connect() {
    this.wsClient = new WebSocket('ws://localhost:8765');

    this.wsClient.on('open', () => {
      console.log('WebSocket client connected');
    });

    this.wsClient.on('message', (data) => {
      console.log('Message received:', data.toString());
    });

    this.wsClient.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    this.wsClient.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  public sendMessage(message: string) {
    if (this.wsClient.readyState === WebSocket.OPEN) {
      this.wsClient.send(message);
    } else {
      console.error('WebSocket is not open.');
    }
  }
}
