import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { Socket } from 'socket.io'

@WebSocketGateway({
    namespace: 'chats', // -> ws://localhost:3000/chats
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
})
export class ChatsGateway implements OnGatewayConnection {
    handleConnection(socket: Socket) {
        console.log(`on connection: ${socket.id}`)
    }

    // socket.on('send_message', 'hello')
    @SubscribeMessage('send_message')
    sendMessage(@MessageBody() message: string) {
        console.log(message)
    }
}
