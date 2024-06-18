import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ChatsService } from './chats.service'
import { EnterChatDto } from './dto/enter-chat.dto'

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
    async enterChat(@MessageBody() data: EnterChatDto, @ConnectedSocket() socket: Socket) {
        for (const chatId of data.chatIds) {
            const exists = await this.chatsService.checkIfChatExists(chatId)

            if (!exists) {
                throw new WsException({
                    code: 100,
                    message: `존재하지 않는 chat 입니다. chatId: ${chatId}`,
                })
            }
        }

        socket.join(data.chatIds.map((x) => x.toString()))
    }
    // socket.on('send_message', 'hello')
    @SubscribeMessage('send_message')
    sendMessage(@MessageBody() message: { message: string; chatId: number }, @ConnectedSocket() socket: Socket) {
        socket.to(message.chatId.toString()).emit('receive_message', message)
        // this.server.in(message.chatId.toString()).emit('receive_message', message)
    }
}
