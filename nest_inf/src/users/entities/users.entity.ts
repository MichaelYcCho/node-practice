import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { RolesEnum } from '../const/roles.const'
import { PostsModel } from 'src/posts/entities/post.entity'
import { BaseModel } from 'src/common/entity/base.entity'
import { IsEmail, IsString, Length, ValidationArguments } from 'class-validator'
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message'
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message'
import { emailValidationMessage } from 'src/common/validation-message/src/common/validation-message/email-validation.message'

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
  password: string

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[]
}
