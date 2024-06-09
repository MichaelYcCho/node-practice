import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { PostsModel } from './entity/post.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from 'src/users/users.module'
import { AuthModule } from 'src/auth/auth.module'
import { CommonModule } from 'src/common/common.module'
import { ImageModel } from 'src/common/entity/image.entity'
import { PostsImagesService } from './image/images.service'
import { LogMiddleware } from 'src/common/middleware/log.middleware'

@Module({
    imports: [TypeOrmModule.forFeature([PostsModel, ImageModel]), AuthModule, UsersModule, CommonModule],
    controllers: [PostsController],
    providers: [PostsService, PostsImagesService],
})
export class PostsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // posts/* 모든 요청에 대해 LogMiddleware를 적용합니다.
        consumer.apply(LogMiddleware).forRoutes({
            path: 'posts*',
            method: RequestMethod.ALL,
        })
    }
}
