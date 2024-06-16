import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ChatsService } from './chats.service'

@WebSocketGateway({
    namespace: 'chats', // -> ws://localhost:3000/chats
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
})
export class ChatsGateway implements OnGatewayConnection {
    constructor(private readonly chatsService: ChatsService) {}

    @WebSocketServer()
    server: Server

    handleConnection(socket: Socket) {
        console.log(`on connection: ${socket.id}`)
    }

    @SubscribeMessage('create_chat')
    async createChat(@MessageBody() data: { chatId: number; userIds: number[] }, @ConnectedSocket() socket: Socket) {
        const chat = await this.chatsService.createChat(data)
    }

    @SubscribeMessage('enter_chat')
    // 접속할 방의 id를 받는다
    enterChat(@MessageBody() data: number[], @ConnectedSocket() socket: Socket) {
        for (const chatId of data) {
            socket.join(chatId.toString())
        }
    }

    // socket.on('send_message', 'hello')
    @SubscribeMessage('send_message')
    sendMessage(@MessageBody() message: { message: string; chatId: number }, @ConnectedSocket() socket: Socket) {
        socket.to(message.chatId.toString()).emit('receive_message', message)
        // this.server.in(message.chatId.toString()).emit('receive_message', message)
    }
}
