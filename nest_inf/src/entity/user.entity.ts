import { ProfileModel } from "src/profile.entity";
import { Column, CreateDateColumn, Entity, Generated, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { PostModel } from "./post.entity";

export enum Role{
    USER = 'user',
    ADMIN = 'admin',
}

@Entity()
export class UserModel{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string; 

    // @Column({
    //     type: "text",
    //     name: "title",
    //     nullable: true,
    //     // true로 설정하면 처음 저장할때만 값지정 가능, 이후에는 변경 불가능
    //     update: false,
    //     default: 'default value',
    //     unique: false
    // })
    // title: string;

    @Column({
        type:"enum",
        enum: Role,
        default: Role.USER
    })
    role: Role;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // 데이터가 업데이트 될때마다 버전이 올라감 (최초 번호는 1)
    // save()함수가 몇번 불렸는지 기억한다고 생각하면된다 
    @VersionColumn()
    version: number;

    @Column()
    @Generated("uuid")
    additionalId: string;

    @OneToOne(() => ProfileModel, profile => profile.user, {
        // eager: true 설정시 user를 불러올때 profile도 같이 불러온다
        eager: true,
        // cascade: true 설정시 user를 저장할때 profile도 같이 저장한다
        cascade: true,
        
        nullable: true,
        onDelete: 'CASCADE',

    })
    @JoinColumn()
    profile: ProfileModel;

    @OneToMany(() => PostModel, post => post.author)
    posts: PostModel[];

}