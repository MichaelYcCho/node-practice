import {
    Controller,
    Get,
    Param,
    Put,
    ParseIntPipe,
    Post,
    Body,
    DefaultValuePipe,
    UseGuards,
    Request,
    Patch,
    Query,
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard'
import { UsersModel } from 'src/users/entities/users.entity'
import { getUser } from 'src/users/decorator/user.decorator'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PaginatePostDto } from './dto/paginate-post.dto'

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    getPosts(@Query() query: PaginatePostDto) {
        return this.postsService.paginatePosts(query)
    }

    @Post()
    @UseGuards(AccessTokenGuard)
    async postPostsRandom(@getUser() user: UsersModel) {
        await this.postsService.generatePosts(user.id)
        return true
    }

    @Get(':id')
    getPost(@Param('id', ParseIntPipe) id: string) {
        return this.postsService.getPostById(+id)
    }

    @Post()
    @UseGuards(AccessTokenGuard)
    postPosts(
        @getUser() user: UsersModel,
        @Body() body: CreatePostDto,
        @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean,
    ) {
        return this.postsService.createPost(user.id, body)
    }

    @Patch(':id')
    patchPost(@Param('id') id: string, @Body() body: UpdatePostDto) {
        return this.postsService.updatePost(+id, body)
    }
}
