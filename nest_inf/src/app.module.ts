import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PostsModel } from './posts/entity/post.entity'
import { UsersModule } from './users/users.module'
import { PostsModule } from './posts/posts.module'
import { UsersModel } from './users/entity/users.entity'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { CommonService } from './common/common.service'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { PUBLIC_FOLDER_PATH } from './common/const/path.const'
import { ImageModel } from './common/entity/image.entity'
import { CommentsModule } from './posts/comments/comments.module'
import { CommentsModel } from './posts/comments/entity/comments.entity'
import { ChatsModule } from './chats/chats.module'
import { ChatsModel } from './chats/entity/chats.entity'
import { MessagesModel } from './chats/messages/entity/messages.entity'
import { RolesGuard } from './users/guard/roles.guard'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        ServeStaticModule.forRoot({
            // 파일을 serving할 최상단 경로
            rootPath: PUBLIC_FOLDER_PATH,
            // public/posts/xxx.jpg
            serveRoot: '/public',
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [PostsModel, UsersModel, ImageModel, CommentsModel, ChatsModel, MessagesModel],
            synchronize: true,
        }),
        UsersModule,
        PostsModule,
        AuthModule,
        CommentsModule,
        ChatsModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class AppModule {}
