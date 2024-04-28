import { Controller, Param, Put } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

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
