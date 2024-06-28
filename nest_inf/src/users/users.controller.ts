import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    DefaultValuePipe,
    Get,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Post,
    UseInterceptors,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { Roles } from './decorator/roles.decorator'
import { RolesEnum } from './const/roles.const'
import { UsersModel } from './entity/users.entity'
import { getUser } from './decorator/user.decorator'
import { getQueryRunner } from 'src/common/decorator/query-runner.decorator'

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
}
