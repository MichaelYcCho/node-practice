import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { access } from 'fs'
import { MaxLengthPipe, MinLengthPipe, PasswordPipe } from './pipe/password.pipe'
import { BasicTokenGuard } from './guard/basic-token.guard'
import { AccessTokenGuard, RefreshTokenGuard } from './guard/bearer-token.guard'
import { RegisterUserDto } from './dto/register-user.dto'
import { IsPublic } from 'src/common/decorator/is-public.decorator'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('token/access')
    @IsPublic()
    @UseGuards(AccessTokenGuard)
    postTokenAccess(@Headers('authorization') rawToken: string) {
        const token = this.authService.extractTokenFromHeader(rawToken, true)
        const newToken = this.authService.rotateToken(token, false)

        return {
            accessToken: newToken,
        }
    }

    @Post('token/refresh')
    @IsPublic()
    @UseGuards(RefreshTokenGuard)
    postTokenRefresh(@Headers('authorization') rawToken: string) {
        const token = this.authService.extractTokenFromHeader(rawToken, true)
        const newToken = this.authService.rotateToken(token, true)

        return {
            accessToken: newToken,
        }
    }

    @Post('login/email')
    @IsPublic()
    @UseGuards(BasicTokenGuard)
    postLoginEmail(@Headers('authorization') rawToken: string) {
        const token = this.authService.extractTokenFromHeader(rawToken, false)
        const credentials = this.authService.decodeBasicToken(token)
        return this.authService.loginWithEmail(credentials)
    }

    @Post('register/email')
    @IsPublic()
    postRegisterEmail(@Body() body: RegisterUserDto) {
        return this.authService.registerWithEmail(body)
    }
}
