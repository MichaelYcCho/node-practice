import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PostsModel } from './entity/post.entity'
import { FindOptionsWhere, LessThan, MoreThan, QueryRunner, Repository } from 'typeorm'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PaginatePostDto } from './dto/paginate-post.dto'
import { CommonService } from 'src/common/common.service'
import { ConfigService } from '@nestjs/config'
import { ENV_HOST_KEY, ENV_PROTOCOL_KEY } from 'src/common/const/env.const'
import { POST_IMAGE_PATH, PUBLIC_FOLDER_PATH } from 'src/common/const/path.const'
import { basename, join } from 'path'
import { promises } from 'fs'
import { CreatePostImageDto } from './image/dto/create-image.dto'
import { ImageModel } from 'src/common/entity/image.entity'
import { DEFAULT_POST_FIND_OPTIONS } from './const/default-post-find-options.const'

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsModel)
        private postsRepository: Repository<PostsModel>,
        @InjectRepository(ImageModel)
        private readonly imageRepository: Repository<ImageModel>,
        private commonService: CommonService,
        private configService: ConfigService,
    ) {}

    getRepository(queryRunner?: QueryRunner) {
        return queryRunner ? queryRunner.manager.getRepository(PostsModel) : this.postsRepository
    }

    async createPost(userId: number, postDto: CreatePostDto, queryRunner?: QueryRunner) {
        const repository = this.getRepository(queryRunner)

        const post = repository.create({
            author: {
                id: userId,
            },
            ...postDto,
            images: [],
        })
        await repository.save(post)
        return post
    }

    async updatePost(postId: number, postDto: UpdatePostDto) {
        const { title, content } = postDto
        const post = await this.postsRepository.findOne({
            ...DEFAULT_POST_FIND_OPTIONS,
            where: {
                id: postId,
            },
        })
        post.title = title
        post.content = content
        await this.postsRepository.save(post)
        return post
    }

    async getAllPosts() {
        return this.postsRepository.find({
            relations: ['author'],
        })
    }

    async generatePosts(userId: number) {
        for (let i = 0; i < 100; i++) {
            await this.createPost(1, {
                title: `Post ${i} title`,
                content: `Post ${i} content`,
                images: [],
            })
        }
    }

    async paginatePosts(dto: PaginatePostDto) {
        return this.commonService.paginate(dto, this.postsRepository, { ...DEFAULT_POST_FIND_OPTIONS }, 'posts')
    }

    async getPostById(postId: number, queryRunner?: QueryRunner) {
        const repository = this.getRepository(queryRunner)
        const post = await repository.findOne({
            where: {
                id: postId,
            },
            relations: ['author'],
        })

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        return post
    }

    async incrementCommentCount(postId: number, queryRunner?: QueryRunner) {
        const repository = this.getRepository(queryRunner)

        await repository.increment(
            {
                id: postId,
            },
            'commentCount',
            1,
        )
    }

    async decrementCommentCount(postId: number, qr?: QueryRunner) {
        const repository = this.getRepository(qr)

        await repository.decrement(
            {
                id: postId,
            },
            'commentCount',
            1,
        )
    }

    async checkPostExistsById(id: number) {
        return this.postsRepository.exists({
            where: {
                id,
            },
        })
    }
}
