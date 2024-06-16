import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersModel } from 'src/users/entity/users.entity'
import { UsersService } from 'src/users/users.service'
import * as bcrypt from 'bcrypt'
import { RegisterUserDto } from './dto/register-user.dto'
import { ConfigService } from '@nestjs/config'
import { ENV_HASH_ROUNDS_KEY } from 'src/common/const/env.const'

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
    ) {}

    signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean): string {
        const payload = {
            email: user.email,
            sub: user.id,
            type: isRefreshToken ? 'refresh' : 'access',
        }
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: isRefreshToken ? '30d' : '15m',
        })
    }

    async loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
        const accessToken = this.signToken(user, false)
        const refreshToken = this.signToken(user, true)
        return { accessToken, refreshToken }
    }

    async authenticateWithEmailAndPassword(user: Pick<UsersModel, 'email' | 'password'>) {
        const existingUser = await this.usersService.getUserByEmail(user.email)

        if (!existingUser) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const passOk = await bcrypt.compare(user.password, existingUser.password)

        if (!passOk) {
            throw new UnauthorizedException('Invalid Password')
        }

        return existingUser
    }

    async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
        const existingUser = await this.authenticateWithEmailAndPassword(user)
        return this.loginUser(existingUser)
    }

    async registerWithEmail(user: RegisterUserDto) {
        const hash = await bcrypt.hash(user.password, parseInt(this.configService.get<string>(ENV_HASH_ROUNDS_KEY)))

        const newUser = await this.usersService.createUser({
            ...user,
            password: hash,
        })

        return this.loginUser(newUser)
    }

    extractTokenFromHeader(header: string, isBearer: boolean) {
        const splitToken = header.split(' ')
        const prefix = isBearer ? 'Bearer' : 'Basic'

        if (splitToken.length !== 2 || splitToken[0] !== prefix) {
            throw new UnauthorizedException('Invalid token prefix')
        }

        const token = splitToken[1]

        return token
    }

    decodeBasicToken(base64String: string) {
        const decoded = Buffer.from(base64String, 'base64').toString('utf-8')

        const split = decoded.split(':')

        if (split.length !== 2) {
            throw new UnauthorizedException('Invalid basic token')
        }

        const email = split[0]
        const password = split[1]

        return { email, password }
    }

    verifyToken(token: string) {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            })
        } catch (e) {
            throw new UnauthorizedException('Invalid token')
        }
    }

    rotateToken(token: string, isRefreshToken: boolean) {
        const decoded = this.verifyToken(token)

        return this.signToken(
            {
                ...decoded,
            },
            isRefreshToken,
        )
    }
}
