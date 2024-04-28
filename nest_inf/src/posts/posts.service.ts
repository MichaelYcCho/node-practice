import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsModel)
        private postsRepository: Repository<PostsModel>,
    ) {}

    async createPost(authorId: number, title: string, content: string){
        const post = this.postsRepository.create({author:{
            id: authorId
        }, title, content});
        return {title, content};
    }

    async updatePost(postId: number, title: string, content: string){
        const post = await this.postsRepository.findOne({
            where: {
                id: postId
            }
        });
        post.title = title;
        post.content = content;
        await this.postsRepository.save(post);
        return post;
    }


    async getAllPosts(){
        // return this.postsRepository.find();
        return [{title: 'title1', content: 'content1'}, {title: 'title2', content: 'content2'}];
    }

}


