import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { access } from 'fs';
import { PasswordPipe } from './pipe/password.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newToken = this.authService.rotateToken(token, false);
    
    return {
      accessToken: newToken,
    }
  }

  @Post('login/email')
  postLoginEmail(
    @Headers('authorization') rawToken: string,
    ) {
      const token = this.authService.extractTokenFromHeader(rawToken, false);
      const credentials = this.authService.decodeBasicToken(token);
      return this.authService.loginWithEmail(credentials);
  }

  @Post('register/email')
  postRegisterEmail(@Body('email') email: string, 
  @Body('password', PasswordPipe) password: string,
  @Body('nickname') nickname: string) {
    return this.authService.registerWithEmail(
      { 
        email, 
        password, 
        nickname 
      });
  }

}
