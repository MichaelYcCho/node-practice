import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModel } from './posts/entities/post.entity';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { UsersModel } from './users/entities/uesrs.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'boilerplate',
      entities: [UsersModel, PostModel],
      synchronize: true,
    }),
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
