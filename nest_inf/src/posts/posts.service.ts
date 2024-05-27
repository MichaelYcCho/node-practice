import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PostsModel } from './entities/post.entity'
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PaginatePostDto } from './dto/paginate-post.dto'
import { CommonService } from 'src/common/common.service'

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsModel)
        private postsRepository: Repository<PostsModel>,
        private commonService: CommonService,
    ) {}

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
        return this.commonService.paginate(dto, this.postsRepository, {}, 'posts')
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
