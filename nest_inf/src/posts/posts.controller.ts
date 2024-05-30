import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Body,
    DefaultValuePipe,
    UseGuards,
    Request,
    Patch,
    Query,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard'
import { UsersModel } from 'src/users/entities/users.entity'
import { getUser } from 'src/users/decorator/user.decorator'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PaginatePostDto } from './dto/paginate-post.dto'
import { FileInterceptor } from '@nestjs/platform-express'

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
    @UseInterceptors(FileInterceptor('image'))
    postPosts(@getUser('id') userId: number, @Body() body: CreatePostDto, @UploadedFile() file?: Express.Multer.File) {
        return this.postsService.createPost(userId, body, file?.filename)
    }

    @Patch(':id')
    patchPost(@Param('id') id: string, @Body() body: UpdatePostDto) {
        return this.postsService.updatePost(+id, body)
    }
}
