import { IsString } from 'class-validator'
import { BaseModel } from 'src/common/entity/base.entity'
import { UsersModel } from 'src/users/entities/users.entity'
import { Column, Entity, ManyToOne } from 'typeorm'

@Entity()
export class PostsModel extends BaseModel {
    @Column()
    @IsString()
    title: string

    @Column()
    @IsString()
    content: string

    @Column({
        nullable: true,
    })
    image: string

    @ManyToOne(() => UsersModel, (user) => user.posts, {
        nullable: false,
    })
    author: UsersModel
}
