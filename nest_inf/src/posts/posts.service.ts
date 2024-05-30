import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PostsModel } from './entities/post.entity'
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PaginatePostDto } from './dto/paginate-post.dto'
import { CommonService } from 'src/common/common.service'
import { ConfigService } from '@nestjs/config'
import { ENV_HOST_KEY, ENV_PROTOCOL_KEY } from 'src/common/const/env.const'
import { POST_IMAGE_PATH, PUBLIC_FOLDER_PATH } from 'src/common/const/path.const'
import { basename, join } from 'path'
import { promises } from 'fs'

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsModel)
        private postsRepository: Repository<PostsModel>,
        private commonService: CommonService,
        private configService: ConfigService,
    ) {}

    async createPostImage(dto: CreatePostDto) {
        // dto 이미지 이름을 기반으로 파일경로 생성
        const tempFilePath = join(PUBLIC_FOLDER_PATH, dto.image)

        try {
            // 파일에 access 가능한지 확인
            await promises.access(tempFilePath)
        } catch (e) {
            throw new Error('파일 access 실패')
        }

        // 파일 이름 추출
        // ex) /public/image.jpg -> image.jpg
        const fileName = basename(tempFilePath)

        // 파일을 저장할 경로 생성
        // {프로젝트 경로}/public/posts/image.jpg
        const newPath = join(POST_IMAGE_PATH, fileName)

        // 파일 옮기기
        await promises.rename(tempFilePath, newPath)
        return true
    }

    async createPost(authorId: number, postDto: CreatePostDto) {
        const post = this.postsRepository.create({
            author: {
                id: authorId,
            },
            ...postDto,
        })
        await this.postsRepository.save(post)
        return post
    }

    async updatePost(postId: number, postDto: UpdatePostDto) {
        const { title, content } = postDto
        const post = await this.postsRepository.findOne({
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
            })
        }
    }

    async paginatePosts(dto: PaginatePostDto) {
        return this.commonService.paginate(dto, this.postsRepository, { relations: ['author'] }, 'posts')
    }

    async getPostById(postId: number) {
        const post = await this.postsRepository.findOne({
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
}
