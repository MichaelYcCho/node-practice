import { Module } from '@nestjs/common'
import { ChatsService } from './chats.service'
import { ChatsController } from './chats.controller'
import { ChatsGateway } from './chats.gateway'
import { ChatsModel } from './entity/chats.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommonService } from 'src/common/common.service'
import { MessagesModel } from './messages/entity/messages.entity'
import { ChatsMessagesService } from './messages/messages.service'
import { MessagesController } from './messages/messages.controller'
import { CommonModule } from 'src/common/common.module'
import { UsersModule } from 'src/users/users.module'
import { AuthModule } from 'src/auth/auth.module'

@Module({
    imports: [TypeOrmModule.forFeature([ChatsModel, MessagesModel]), CommonModule, UsersModule, AuthModule],
    controllers: [ChatsController, MessagesController],
    providers: [ChatsGateway, ChatsService, CommonService, ChatsMessagesService],
})
export class ChatsModule {}
