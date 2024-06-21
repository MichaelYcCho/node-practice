import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { RolesEnum } from '../const/roles.const'

import { BaseModel } from 'src/common/entity/base.entity'
import { IsEmail, IsString, Length } from 'class-validator'
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message'
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message'
import { emailValidationMessage } from 'src/common/validation-message/src/common/validation-message/email-validation.message'
import { Exclude, Expose } from 'class-transformer'
import { PostsModel } from 'src/posts/entity/post.entity'
import { CommentsModel } from 'src/posts/comments/entity/comments.entity'
import { ChatsModel } from 'src/chats/entity/chats.entity'
import { MessagesModel } from 'src/chats/messages/entity/messages.entity'

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
    @Exclude({
        // 보내는 응답에는 password를 포함시키지 않음
        toPlainOnly: true,
        // 받는 요청에는 password를 포함시키지 않음
        //toClassOnly: true,
    })
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

    @ManyToMany(() => ChatsModel, (chat) => chat.users)
    @JoinTable()
    chats: ChatsModel[]

    @OneToMany(() => MessagesModel, (message) => message.author)
    messages: MessagesModel
}
