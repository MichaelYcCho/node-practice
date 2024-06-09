import { IsString } from 'class-validator'
import { BaseModel } from 'src/common/entity/base.entity'
import { ImageModel } from 'src/common/entity/image.entity'
import { UsersModel } from 'src/users/entity/users.entity'

import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { CommentsModel } from '../comments/entity/comments.entity'

@Entity()
export class PostsModel extends BaseModel {
    @Column()
    @IsString()
    title: string

    @Column()
    @IsString()
    content: string

    @ManyToOne(() => UsersModel, (user) => user.posts, {
        nullable: false,
    })
    author: UsersModel

    @Column()
    likeCount: number

    @Column()
    commentCount: number

    @OneToMany(() => ImageModel, (image) => image.post)
    images: ImageModel[]

    @OneToMany(() => CommentsModel, (comment) => comment.post)
    comments: CommentsModel[]
}
