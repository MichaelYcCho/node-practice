import { PostsModel } from '../entities/post.entity'
import { PickType } from '@nestjs/mapped-types'

export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {}
