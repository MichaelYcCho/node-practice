import { BadRequestException, Injectable } from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { UsersModel } from './entity/users.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersModel)
        private usersRepository: Repository<UsersModel>,
    ) {}

    async createUser(user: Pick<UsersModel, 'email' | 'nickname' | 'password'>) {
        const nickNameExists = await this.usersRepository.findOne({
            where: {
                nickname: user.nickname,
            },
        })

        if (nickNameExists) {
            throw new BadRequestException('Nickname already exists')
        }

        const emailExists = await this.usersRepository.findOne({
            where: {
                email: user.email,
            },
        })

        if (emailExists) {
            throw new BadRequestException('Email already exists')
        }

        const userObject = this.usersRepository.create({
            nickname: user.nickname,
            email: user.email,
            password: user.password,
        })

        const newUser = await this.usersRepository.save(userObject)
        return newUser
    }

    async getAllUsers() {
        return this.usersRepository.find()
    }

    async getUserByEmail(email: string) {
        return this.usersRepository.findOne({
            where: {
                email,
            },
        })
    }
}
