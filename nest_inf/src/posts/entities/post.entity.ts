import { Transform } from 'class-transformer'
import { IsString } from 'class-validator'
import { join } from 'path'
import { POST_PUBLIC_IMAGE_PATH } from 'src/common/const/path.const'
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
    @Transform(({ value }) => `/${join(POST_PUBLIC_IMAGE_PATH, value)}`)
    image: string

    @ManyToOne(() => UsersModel, (user) => user.posts, {
        nullable: false,
    })
    author: UsersModel
}
