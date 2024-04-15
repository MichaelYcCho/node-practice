import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity()
export class UserModel{

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    title: string;

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

}