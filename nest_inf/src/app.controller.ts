import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { ProfileModel } from './profile.entity';
import { PostModel } from './entity/post.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
  ) {}

  @Post('users')
  async postUser(){
    return await this.userRepository.save({
    });
  }

  @Get('users')
  async getUsers() {
    return await this.userRepository.find({
      relations:{
        profile: true,
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
    });
  }


  @Post('user/profile')
  async createUserAndProfile(){
    const user = await  this.userRepository.save({
      email: 'test@nasdfasd.com',
    });

    const profile = await this.profileRepository.save({
      profileImg: 'test',
      user: user,
    });

    return user;
  }


  @Post('user/post')
  async createUserAndPost(){
    const user = await this.userRepository.save({
      email: 'poses@nadlswf.com',
    });

    await this.postRepository.save({
      author: user,
      title: 'test',
    });

    await this.postRepository.save({
      author: user,
      title: 'test2',
    });
  }
      

}


