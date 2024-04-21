import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModel } from './entity/user.entity';
import { Student, Teacher } from './entity/person.entity';
import { BookModel, CarModel, SingleBaseModel } from './entity/inheritance.entity';
import { ProfileModel } from './profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel, ProfileModel]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'boilerplate',
      entities: [UserModel, Student, Teacher, BookModel, CarModel, SingleBaseModel, ProfileModel],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
