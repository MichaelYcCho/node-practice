import { Controller, Get, Param, Put, ParseIntPipe, Post, Body, DefaultValuePipe, UseGuards, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { UsersModel } from 'src/users/entities/users.entity';
import { getUser } from 'src/users/decorator/user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(){
    return this.postsService.getAllPosts()
  }


  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: string){
    return this.postsService.getPostById(+id)
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  postPosts(
    @getUser() user : UsersModel,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean,
  ){
    return this.postsService.createPost(
      user.id, title, content
    )
  }

  @Put(':id')
  putPost(
    @Param('id') id: string,
    @Param('title') title?: string,
    @Param('content') content?: string,
  ){
    return this.postsService.updatePost(
      +id, title, content
    )
  }
}
