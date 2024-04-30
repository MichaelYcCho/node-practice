import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
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

    async loginUser(user: Pick<UsersModel, 'email' | 'id'>){
        const accessToken = this.signToken(user, false);
        const refreshToken = this.signToken(user, true);
        return {accessToken, refreshToken};
    }

    async authenticateWithEmailAndPassword(user: Pick<UsersModel, 'email' | 'password'>){
        const existingUser = await this.usersService.getUserByEmail(user.email);

        if(!existingUser){
            throw new UnauthorizedException('Invalid credentials');
        }
        
        const passOk = await bcrypt.compare(user.password, existingUser.password);

        if(!passOk){
            throw new UnauthorizedException('Invalid Password');
        }

        return this.loginUser(existingUser);
    }
}

