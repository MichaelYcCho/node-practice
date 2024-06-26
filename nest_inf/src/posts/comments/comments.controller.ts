import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { CommentsService } from './comments.service'
import { PaginateCommentsDto } from './dto/paginate-comments.dto'
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor'
import { CreateCommentsDto } from './dto/create-comments.dto'
import { UsersModel } from 'src/users/entity/users.entity'
import { getUser } from 'src/users/decorator/user.decorator'
import { QueryRunner } from 'typeorm'
import { getQueryRunner } from 'src/common/decorator/query-runner.decorator'
import { PostsService } from '../posts.service'
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard'
import { UpdateCommentsDto } from './dto/update-comments.dto'
import { IsPublic } from 'src/common/decorator/is-public.decorator'
import { IsCommentMineOrAdminGuard } from './guard/is-comment-mine-or-admin.guard'

@Controller('posts/:postId/comments')
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService,
        private readonly postsService: PostsService,
    ) {}

    @Get()
    @IsPublic()
    getComments(@Param('postId', ParseIntPipe) postId: number, @Query() query: PaginateCommentsDto) {
        return this.commentsService.paginateComments(query, postId)
    }

    @Get(':commentId')
    @IsPublic()
    getComment(@Param('commentId', ParseIntPipe) commentId: number) {
        return this.commentsService.getCommentById(commentId)
    }

    @Post()
    @UseInterceptors(TransactionInterceptor)
    async postComment(
        @Param('postId', ParseIntPipe) postId: number,
        @Body() body: CreateCommentsDto,
        @getUser() user: UsersModel,
        @getQueryRunner() queryRunner: QueryRunner,
    ) {
        const resp = await this.commentsService.createComment(body, postId, user, queryRunner)

        await this.postsService.incrementCommentCount(postId, queryRunner)

        return resp
    }

    @Patch(':commentId')
    @UseGuards(IsCommentMineOrAdminGuard)
    //@UseGuards(AccessTokenGuard)
    async patchComment(@Param('commentId', ParseIntPipe) commentId: number, @Body() body: UpdateCommentsDto) {
        return this.commentsService.updateComment(body, commentId)
    }

    @Delete(':commentId')
    @UseGuards(IsCommentMineOrAdminGuard)
    //@UseGuards(AccessTokenGuard)
    @UseInterceptors(TransactionInterceptor)
    async deleteComment(
        @Param('commentId', ParseIntPipe) commentId: number,
        @Param('postId', ParseIntPipe) postId: number,
        @getQueryRunner() queryRunner: QueryRunner,
    ) {
        const resp = await this.commentsService.deleteComment(commentId, queryRunner)

        await this.postsService.decrementCommentCount(postId, queryRunner)

        return resp
    }
}
