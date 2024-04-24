import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { In, LessThan, Not, Repository } from 'typeorm';
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
      where:{
        //  아닌 경우 가져오기
        //id: Not(1),
        //적은경우 가져오기
        //id: LessThan(30),
        //적은경우 or 같은경우
        //id: LessThanOrEqual(30),
        // 많은경우
        //id: MoreThan(30),
        // 많은경우 or 같은경우
        //id: MoreThanOrEqual(30),
        // 같은경우
        //id: Equal(30),
        // Like검색
        //email: Like('%@gmail%'),
        // In 검색
        //id: In([1, 2, 3]),
        // IsNull 검색
        //email: IsNull(),
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


