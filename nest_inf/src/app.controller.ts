import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { ProfileModel } from './profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,

  ) {}

  @Post('users')
  async postUser(){
    return await this.userRepository.save({
    });
  }

  @Get('users')
  async getUsers() {
    return await this.userRepository.find({


      // select: ['id', 'email'] 이렇게 특정 컬럼만 가져올 수도 있다, default는 모든 컬럼
      select:{profile:{
        id: true,
      }},

      // where: {id: 1} 이렇게 특정 조건을 줄 수도 있다
      where:{},
      relations: {
        profile: true,
      },
      order:{
        id: 'ASC',
        },
        take: 10,
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
      profile:{
        profileImg: 'test',
      }
    });

      //   const profile = await this.profileRepository.save({
  //     profileImg: 'test',
  //     user: user,
  //   });

  //   return user;
  // }
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
    
  @Post('posts/tags')
  async createPostAndTags(){
    const post1 = await this.postRepository.save({
      title: 'post1',
    });

    const post2 = await this.postRepository.save({
      title: 'post2',
    });

    const tag1 = await this.tagRepository.save({
      name: 'tag1',
      posts: [post1],
    });

    const tag2 = await this.tagRepository.save({
      name: 'tag2',
      posts: [post1, post2],
    });

    const post3 = await this.postRepository.save({
      title: 'post3',
      tags: [tag1, tag2],
    });

  }

  @Get('posts')
  getPosts(){
    return this.postRepository.find({
      relations:{
        tags: true,
      }
    });
  }

  @Get('tags')
  getTags(){
    return this.tagRepository.find({
      relations:{
        posts: true,
      }
    });
  }

}


