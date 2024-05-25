import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PostsModel } from './entities/post.entity'
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PaginatePostDto } from './dto/paginate-post.dto'

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsModel)
        private postsRepository: Repository<PostsModel>,
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
        const where: FindOptionsWhere<PostsModel> = {}

        if (dto.where__id_lessThan) {
            where.id = LessThan(dto.where__id_lessThan)
        } else if (dto.where__id_moreThan) {
            where.id = MoreThan(dto.where__id_moreThan)
        }

        const posts = await this.postsRepository.find({
            where,
            order: {
                createdAt: dto.order__createAt,
            },
            take: dto.take,
        })

        // take보다 적은 데이터가 조회되면 마지막 페이지로 간주
        const lastItem = posts.length > 0 && posts.length === dto.take ? posts[posts.length - 1] : null
        const nextUrl = new URL('http://localhost/posts')

        if (nextUrl) {
            // dto의 키값들을 looping하면서 키값에 해당하는 value를 params에 추가
            for (const key of Object.keys(dto)) {
                if (dto[key]) {
                    if (key !== 'where__id_moreThan') {
                        nextUrl.searchParams.append(key, dto[key])
                    }
                }
            }

            let key = null
            if (dto.order__createAt === 'ASC') {
                key = 'where__id_more_than'
            } else {
                key = 'where__id_less_than'
            }
            //let key = dto.order__createAt === 'ASC' ? 'where__id_moreThan' : 'where__id_lessThan'

            nextUrl.searchParams.append(key, lastItem.id.toString())
        }

        return {
            data: posts,
            cursor: {
                after: lastItem?.id ?? null,
            },
            count: posts.length,
            next: nextUrl.toString() ?? null,
        }
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
