import { Module } from '@nestjs/common'
import { ChatsService } from './chats.service'
import { ChatsController } from './chats.controller'
import { ChatsGateway } from './chats.gateway'
import { ChatsModel } from './entity/chats.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommonService } from 'src/common/common.service'

@Module({
    imports: [TypeOrmModule.forFeature([ChatsModel])],
    controllers: [ChatsController],
    providers: [ChatsGateway, ChatsService, CommonService],
})
export class ChatsModule {}
