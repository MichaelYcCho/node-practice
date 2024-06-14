import {
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
    namespace: 'chats', // -> ws://localhost:3000/chats
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
})
export class ChatsGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server

    handleConnection(socket: Socket) {
        console.log(`on connection: ${socket.id}`)
    }

    // socket.on('send_message', 'hello')
    @SubscribeMessage('send_message')
    sendMessage(@MessageBody() message: string) {
        this.server.emit('receive_message', 'hello from server')
    }
}
