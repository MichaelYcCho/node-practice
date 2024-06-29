import { BadRequestException, Injectable } from '@nestjs/common'
import { In, QueryRunner, Repository } from 'typeorm'
import { UsersModel } from './entity/users.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { UserFollowersModel } from './entity/user-followers.entity'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersModel)
        private usersRepository: Repository<UsersModel>,
        @InjectRepository(UserFollowersModel)
        private readonly userFollowersRepository: Repository<UserFollowersModel>,
    ) {}

    getUsersRepository(queryRunner?: QueryRunner) {
        return queryRunner ? queryRunner.manager.getRepository<UsersModel>(UsersModel) : this.usersRepository
    }

    getUserFollowRepository(queryRunner?: QueryRunner) {
        return queryRunner
            ? queryRunner.manager.getRepository<UserFollowersModel>(UserFollowersModel)
            : this.userFollowersRepository
    }

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

    async followUser(followerId: number, followeeId: number, qr?: QueryRunner) {
        const userFollowersRepository = this.getUserFollowRepository(qr)

        await userFollowersRepository.save({
            follower: {
                id: followerId,
            },
            followee: {
                id: followeeId,
            },
        })

        return true
    }

    async getFollowers(userId: number, includeNotConfirmed: boolean) {
        /**
         * [
         *  {
         *      id: number;
         *      follower: UsersModel;
         *      followee: UsersModel;
         *      isConfirmed: boolean;
         *      createdAt: Date;
         *      updatedAt: Date;
         *  }
         * ]
         */
        const where = {
            followee: {
                id: userId,
            },
        }

        if (!includeNotConfirmed) {
            where['isConfirmed'] = true
        }

        const result = await this.userFollowersRepository.find({
            where,
            relations: {
                follower: true,
                followee: true,
            },
        })

        return result.map((x) => ({
            id: x.follower.id,
            nickname: x.follower.nickname,
            email: x.follower.email,
            isConfirmed: x.isConfirmed,
        }))
    }

    async confirmFollow(followerId: number, followeeId: number, queryRunner?: QueryRunner) {
        const userFollowersRepository = this.getUserFollowRepository(queryRunner)

        const existing = await userFollowersRepository.findOne({
            where: {
                follower: {
                    id: followerId,
                },
                followee: {
                    id: followeeId,
                },
            },
            relations: {
                follower: true,
                followee: true,
            },
        })

        if (!existing) {
            throw new BadRequestException('존재하지 않는 팔로우 요청입니다.')
        }

        await userFollowersRepository.save({
            ...existing,
            isConfirmed: true,
        })

        return true
    }
}
