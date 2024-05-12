import { BaseModel } from "src/common/entity/base.entity";
import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

 
@Entity()
export class PostsModel extends BaseModel{

    @Column()
    title: string;

    @Column()
    content: string;
    
    @ManyToOne(() => UsersModel, (user) => user.posts, {
        nullable: false,
    })
    author: UsersModel;
}