import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PostsModel } from './entities/post.entity'
import { Repository } from 'typeorm'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

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
