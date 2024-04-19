import { ChildEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";

export class BaseModel{
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}


@Entity()
export class BookModel extends BaseModel{
    
    @Column()
    name: string
}


@Entity()
export class CarModel extends BaseModel{
    @Column()
    brand: string
}

@Entity()
// 테이블 하나로 두개의 entity를 관리하기 위함(이를 위함 구분자 column, 이 경우 type이라는 column이 추가된다)
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class SingleBaseModel{
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@ChildEntity()
export class ComputerModel extends SingleBaseModel{
    @Column()
    brand: string
}

@ChildEntity()
export class AirplaneModel extends SingleBaseModel{
    @Column()
    country: string
}