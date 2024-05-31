import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PostsModel } from './posts/entities/post.entity'
import { UsersModule } from './users/users.module'
import { PostsModule } from './posts/posts.module'
import { UsersModel } from './users/entities/users.entity'
import { AuthModule } from './auth/auth.module'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { CommonService } from './common/common.service'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { PUBLIC_FOLDER_PATH } from './common/const/path.const'
import { ImageModel } from './common/entity/image.entity'

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
            entities: [PostsModel, UsersModel, ImageModel],
            synchronize: true,
        }),
        UsersModule,
        PostsModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        },
        CommonService,
    ],
})
export class AppModule {}
