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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'boilerplate',
      entities: [PostsModel, UsersModel],
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
  ],
})
export class AppModule {}
