import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { UsersModel } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersModel)       
        private usersRepository: Repository<UsersModel>,
    ) {}

    async createUser(nickname: string, email: string, password: string){
        const user = this.usersRepository.create({nickname, email, password});
        await this.usersRepository.save(user);
        return user;
    }

    async getAllUsers(){
        return this.usersRepository.find();
    }

    async getUserByEmail(email: string){
        return this.usersRepository.findOne({
            where: {
                email
            }
        });
    }
}
