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
    UseFilters,
    Delete,
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard'
import { UsersModel } from 'src/users/entity/users.entity'
import { getUser } from 'src/users/decorator/user.decorator'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PaginatePostDto } from './dto/paginate-post.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageModelType } from 'src/common/entity/image.entity'
import { DataSource, QueryRunner } from 'typeorm'
import { PostsImagesService } from './image/images.service'
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor'
import { getQueryRunner } from 'src/common/decorator/query-runner.decorator'
import { HttpExceptionFilter } from 'src/common/exception-filter/http.exception-filter'
import { Roles } from 'src/users/decorator/roles.decorator'
import { RolesEnum } from 'src/users/const/roles.const'
import { IsPublic } from 'src/common/decorator/is-public.decorator'
import { IsPostMineOrAdminGuard } from './guard/is-post-mine-or-admin.guard'

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly postsImagesService: PostsImagesService,
        private readonly dataSource: DataSource,
    ) {}

    @Get()
    @IsPublic()
    getPosts(@Query() query: PaginatePostDto) {
        return this.postsService.paginatePosts(query)
    }

    @Post()
    //@UseGuards(AccessTokenGuard)
    async postPostsRandom(@getUser() user: UsersModel) {
        await this.postsService.generatePosts(user.id)
        return true
    }

    @Get(':id')
    @IsPublic()
    getPost(@Param('id', ParseIntPipe) id: string) {
        return this.postsService.getPostById(+id)
    }

    @Post()
    //@UseGuards(AccessTokenGuard)
    @UseInterceptors(TransactionInterceptor)
    @UseFilters(HttpExceptionFilter)
    async postPosts(
        @getUser('id') userId: number,
        @Body() body: CreatePostDto,
        @getQueryRunner() queryRunner: QueryRunner,
    ) {
        const post = await this.postsService.createPost(userId, body, queryRunner)

        for (let i = 0; i < body.images.length; i++) {
            await this.postsImagesService.createPostImage({
                post,
                order: i,
                path: body.images[i],
                type: ImageModelType.POST_IMAGE,
            })
        }

        return this.postsService.getPostById(post.id, queryRunner)
    }

    @Patch(':id')
    @UseGuards(IsPostMineOrAdminGuard)
    patchPost(@Param('postId', ParseIntPipe) id: number, @Body() body: UpdatePostDto) {
        return this.postsService.updatePost(+id, body)
    }

    // 5) DELETE /posts/:id
    //    id에 해당되는 POST를 삭제한다.
    @Delete(':id')
    @Roles(RolesEnum.ADMIN)
    deletePost(@Param('id', ParseIntPipe) id: number) {
        return this.postsService.deletePost(id)
    }
}
