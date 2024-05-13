import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { UsersService } from "src/users/users.service";

export class BearerTokenGuard implements CanActivate {
    constructor(private readonly authService: AuthService,
        private readonly userService: UsersService
    ) {}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const req = context.switchToHttp().getRequest();
    const rawToken = req.headers['authorization'];

    if(!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const result = await this.authService.verifyToken(token);

    const user = await this.userService.getUserByEmail(result.email);
    req.token = token;
    req.tokenType = result.type;
    req.user = user;

    return true;

  }
}

