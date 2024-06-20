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
import { CreateMessagesDto } from './messages/dto/create-messages.dto'
import { ChatsMessagesService } from './messages/messages.service'
import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { SocketCatchHttpExceptionFilter } from 'src/common/exception-filter/socket-catch-http.exception-filter'
import { SocketBearerTokenGuard } from 'src/auth/guard/socket/socket-bearer-token.guard'
import { UsersModel } from 'src/users/entity/users.entity'

@WebSocketGateway({
    namespace: 'chats', // -> ws://localhost:3000/chats
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
})
export class ChatsGateway implements OnGatewayConnection {
    constructor(
        private readonly chatsService: ChatsService,
        private readonly messagesService: ChatsMessagesService,
    ) {}

    @WebSocketServer()
    server: Server

    handleConnection(socket: Socket) {
        console.log(`on connection: ${socket.id}`)
    }

    @UsePipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    )
    @UseFilters(SocketCatchHttpExceptionFilter)
    @UseGuards(SocketBearerTokenGuard)
    @SubscribeMessage('create_chat')
    async createChat(@MessageBody() data: { chatId: number; userIds: number[] }, @ConnectedSocket() socket: Socket) {
        const chat = await this.chatsService.createChat(data)
    }

    @UsePipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    )
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
    @UsePipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    )
    @UseFilters(SocketCatchHttpExceptionFilter)
    @SubscribeMessage('send_message')
    async sendMessage(@MessageBody() dto: CreateMessagesDto, @ConnectedSocket() socket: Socket & { user: UsersModel }) {
        const chatExists = await this.chatsService.checkIfChatExists(dto.chatId)

        if (!chatExists) {
            throw new WsException(`존재하지 않는 채팅방입니다. Chat ID : ${dto.chatId}`)
        }

        const message = await this.messagesService.createMessage(dto, socket.user.id)

        socket.to(message.chat.id.toString()).emit('receive_message', message.message)
        // this.server.in(message.chatId.toString()).emit('receive_message', message.message);
    }
}
