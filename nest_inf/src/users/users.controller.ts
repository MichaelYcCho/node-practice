import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Patch,
    Post,
    UseInterceptors,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { Roles } from './decorator/roles.decorator'
import { RolesEnum } from './const/roles.const'
import { UsersModel } from './entity/users.entity'
import { getUser } from './decorator/user.decorator'
import { getQueryRunner } from 'src/common/decorator/query-runner.decorator'
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor'
import { QueryRunner } from 'typeorm'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @Roles(RolesEnum.ADMIN)
    getUsers() {
        return this.usersService.getAllUsers()
    }

    @Get('follow/me')
    async getFollow(
        @getUser() user: UsersModel,
        @getQueryRunner('includeNotConfirmed', new DefaultValuePipe(false), ParseBoolPipe) includeNotConfirmed: boolean,
    ) {
        return this.usersService.getFollowers(user.id, includeNotConfirmed)
    }

    @Post('follow/:id')
    async postFollow(@getUser() user: UsersModel, @Param('id', ParseIntPipe) followeeId: number) {
        await this.usersService.followUser(user.id, followeeId)

        return true
    }

    @Patch('follow/:id/confirm')
    @UseInterceptors(TransactionInterceptor)
    async patchFollowConfirm(
        @getUser() user: UsersModel,
        @Param('id', ParseIntPipe) followerId: number,
        @getQueryRunner() queryRunner: QueryRunner,
    ) {
        await this.usersService.confirmFollow(followerId, user.id, queryRunner)
        await this.usersService.incrementFollowerCount(user.id, queryRunner)
        await this.usersService.incrementFolloweeCount(followerId, queryRunner)
        return true
    }

    @Delete('follow/:id')
    @UseInterceptors(TransactionInterceptor)
    async deleteFollow(
        @getUser() user: UsersModel,
        @Param('id', ParseIntPipe) followeeId: number,
        @getQueryRunner() queryRunner: QueryRunner,
    ) {
        await this.usersService.deleteFollow(user.id, followeeId, queryRunner)
        await this.usersService.decrementFollowerCount(followeeId, queryRunner)
        await this.usersService.decrementFolloweeCount(user.id, queryRunner)

        return true
    }
}
