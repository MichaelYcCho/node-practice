import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  postUser(@Body('nickname') nickName: string,
  @Body('email') email: string,
  @Body('password') password: string) {
    return this.usersService.createUser(nickName, email, password);
  }


}
