import { Controller, Get, Post } from '@nestjs/common';
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
    return await this.userRepository.find();
  }
  
}
