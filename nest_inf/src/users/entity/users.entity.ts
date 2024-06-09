import { Column, Entity, OneToMany } from 'typeorm'
import { RolesEnum } from '../const/roles.const'

import { BaseModel } from 'src/common/entity/base.entity'
import { IsEmail, IsString, Length } from 'class-validator'
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message'
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message'
import { emailValidationMessage } from 'src/common/validation-message/src/common/validation-message/email-validation.message'
import { Exclude, Expose } from 'class-transformer'
import { PostsModel } from 'src/posts/entity/post.entity'
import { CommentsModel } from 'src/posts/comments/entity/comments.entity'

@Entity()
export class UsersModel extends BaseModel {
    @Column({
        length: 20,
        unique: true,
    })
    @IsString()
    @Length(1, 20, {
        message: lengthValidationMessage,
    })
    nickname: string

    @Column({ unique: true })
    @IsString()
    @IsEmail({}, { message: emailValidationMessage })
    email: string

    @Column()
    @IsString()
    @Length(3, 8, { message: stringValidationMessage })
    @Exclude()
    password: string

    @Column({
        enum: Object.values(RolesEnum),
        default: RolesEnum.USER,
    })
    role: RolesEnum

    @OneToMany(() => PostsModel, (post) => post.author)
    posts: PostsModel[]

    @OneToMany(() => CommentsModel, (comment) => comment.author)
    postComments: CommentsModel[]

    @Expose()
    get nicknameAndEmail() {
        return `${this.nickname} ${this.email}`
    }
}
