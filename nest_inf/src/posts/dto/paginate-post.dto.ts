import { Type } from 'class-transformer'
import { IsIn, IsNumber, IsOptional } from 'class-validator'

export class PaginatePostDto {
    @IsNumber()
    @IsOptional()
    page: number

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    where__id_moreThan?: number

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    where__id_lessThan?: number

    @IsIn(['ASC', 'DESC'])
    order__createAt?: 'ASC' | 'DESC' = 'ASC'

    @IsNumber()
    @IsOptional()
    take: number = 20
}
