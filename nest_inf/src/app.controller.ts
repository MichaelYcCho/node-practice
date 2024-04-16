import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  @Post('users')
  async postUser(){
    return await this.userRepository.save({
      title: 'test',
    });
  }

  @Get('users')
  async getUsers() {
    return await this.userRepository.find({
      select:{
        id: true,
        title: true,

      }
    });
  }


  @Patch('users/:id')
  async patchUser(
    @Param('id') id: string,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });

    return await this.userRepository.save({
      ...user,
      title: 'updated',
    });
  } 
  
}
