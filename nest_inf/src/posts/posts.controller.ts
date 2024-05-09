import { Controller, Get, Param, Put, ParseIntPipe, Post, Body, DefaultValuePipe } from '@nestjs/common';
import { PostsService } from './posts.service';

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
  postPosts(
    @Body('authorId') authorId: number,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean,
  ){
    return this.postsService.createPost(
      authorId, title, content
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
