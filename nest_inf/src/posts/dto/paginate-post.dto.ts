import { IsIn, IsNumber, IsOptional } from 'class-validator'

export class PaginatePostDto {
    @IsNumber()
    @IsOptional()
    where__id_moreThan?: number

    @IsIn(['ASC', 'DESC'])
    order__createAt?: 'ASC' | 'DESC' = 'ASC'

    @IsNumber()
    @IsOptional()
    take: number = 20
}