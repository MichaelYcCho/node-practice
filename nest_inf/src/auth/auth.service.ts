import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
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

        return existingUser;
    }

    async loginWithEmail(user:Pick<UsersModel, 'email' | 'password'>){
        const existingUser = await this.authenticateWithEmailAndPassword(user);
        return this.loginUser(existingUser);
    }

    async registerWithEmail(user: Pick<UsersModel, 'email' | 'password' | 'nickname'>){
        const hash = await bcrypt.hash(user.password, HASH_ROUNDS);
        const newUser = await this.usersService.createUser(
            {
            ...user, 
            password: hash
            }
        );
        return this.loginUser(newUser);
    }

    async extractTokenFromHeader(header: string, isBearer : boolean){
        const splitToken = header.split(' ');
        const prefix = isBearer ? 'Bearer' : 'Basic';

        if(splitToken.length !== 2 || splitToken[0] !== prefix){
            throw new UnauthorizedException('Invalid token prefix');
        }

        const token = splitToken[1];
        return token;
    }

}

