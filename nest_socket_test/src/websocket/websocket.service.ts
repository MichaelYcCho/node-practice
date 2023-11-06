import { Injectable, OnModuleInit } from '@nestjs/common';
import * as WebSocket from 'ws';
import * as fs from 'fs';
import { createServer } from 'http';

@Injectable()
export class WebsocketService implements OnModuleInit {
  private server: any;
  private wss: WebSocket.Server;
  private clients = {};

  onModuleInit() {
    this.initializeWebSocketServer();
  }

  private initializeWebSocketServer() {
    this.server = createServer();
    this.wss = new WebSocket.Server({ server: this.server });

    this.wss.on('connection', (ws: WebSocket) => {
      const id = this.generateUniqueId();
      this.clients[id] = ws;

      ws.on('message', (data) => {
        console.log(data);

        // C 소켓으로 데이터를 전달하는 로직을 여기에 추가합니다.
        // ...
      });

      ws.on('close', () => {
        console.log(`Connection with A closed`);
        delete this.clients[id];
        // 음성 녹음이 끝나면, 파일로 합치는 작업을 여기서 처리합니다.
        this.mergeAudioFiles();
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });

    this.server.listen(8080, () => {
      console.log('WebSocket server B is running on port 8080');
    });
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private mergeAudioFiles() {
    // C 소켓에서 넘어온 데이터를 합치는 로직을 구현합니다.
    // ...
  }

  // passDataToCSocket 등의 추가 메서드를 여기에 구현합니다.
}
