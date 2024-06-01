import { Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { PostsModel } from './entities/post.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from 'src/users/users.module'
import { AuthModule } from 'src/auth/auth.module'
import { CommonModule } from 'src/common/common.module'
import { ImageModel } from 'src/common/entity/image.entity'

@Module({
    imports: [TypeOrmModule.forFeature([PostsModel, ImageModel]), AuthModule, UsersModule, CommonModule],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
