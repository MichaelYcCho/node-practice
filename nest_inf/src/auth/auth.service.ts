import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { JWT_SECRET } from './const/auth.const';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
    ){}

    signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken : boolean){
        const payload = {
            email: user.email,
            sub: user.id,
            type: isRefreshToken ? 'refresh' : 'access',
        };
        return this.jwtService.sign(payload, {
            secret: JWT_SECRET,
            expiresIn: isRefreshToken ? '30d' : '15m',
        });  
    }
}

