import { UsersModel } from "src/users/entities/uesrs.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class PostModel{

    @PrimaryGeneratedColumn()
    id: number;

    // @ManyToOne(() => UserModel, user => user.posts)
    // author: UserModel;

    @Column()
    title: string;
}