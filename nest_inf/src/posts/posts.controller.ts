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
import { ImageModelType } from 'src/common/entity/image.entity'
import { DataSource } from 'typeorm'
import { PostsImagesService } from './image/images.service'

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly postsImagesService: PostsImagesService,
        private readonly dataSource: DataSource,
    ) {}

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
    async postPosts(@getUser('id') userId: number, @Body() body: CreatePostDto) {
        const queryRunner = this.dataSource.createQueryRunner()

        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const post = await this.postsService.createPost(userId, body, queryRunner)

            for (let i = 0; i < body.images.length; i++) {
                await this.postsImagesService.createPostImage({
                    post,
                    order: i,
                    path: body.images[i],
                    type: ImageModelType.POST_IMAGE,
                })
            }
            await queryRunner.commitTransaction()
            return this.postsService.getPostById(post.id)
        } catch (e) {
            await queryRunner.rollbackTransaction()
            throw e
        } finally {
            await queryRunner.release()
        }
    }

    @Patch(':id')
    patchPost(@Param('id') id: string, @Body() body: UpdatePostDto) {
        return this.postsService.updatePost(+id, body)
    }
}
