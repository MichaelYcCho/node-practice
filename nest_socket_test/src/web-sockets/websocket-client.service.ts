import { Injectable } from '@nestjs/common';
import * as WebSocket from 'ws';

@Injectable()
export class WebsocketClientService {
  private wsClient: WebSocket;

  connectToWebSocketServer(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.wsClient = new WebSocket(url);

      this.wsClient.on('open', () => {
        console.log('WebSocket client connected');
        resolve('WebSocket client connected');
      });

      this.wsClient.on('message', (data) => {
        console.log('Message received:', data.toString());
      });

      this.wsClient.on('close', () => {
        console.log('WebSocket client disconnected');
      });

      this.wsClient.on('error', (error) => {
        console.error('WebSocket error:', error);
        reject(`WebSocket error: ${error.message}`);
      });
    });
  }

  sendMessage(message: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.wsClient && this.wsClient.readyState === WebSocket.OPEN) {
        this.wsClient.send(message);
        resolve();
      } else {
        reject('WebSocket is not open.');
      }
    });
  }

  disconnectFromWebSocketServer(): void {
    if (this.wsClient) {
      this.wsClient.close();
    }
  }
}
