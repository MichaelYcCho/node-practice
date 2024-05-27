import { Type } from 'class-transformer'
import { IsIn, IsNumber, IsOptional } from 'class-validator'

export class BasePaginationDto {
    @IsNumber()
    @IsOptional()
    page: number

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    where__id__moreThan?: number

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    where__id__lessThan?: number

    @IsIn(['ASC', 'DESC'])
    order__createdAt?: 'ASC' | 'DESC' = 'ASC'

    @IsNumber()
    @IsOptional()
    take: number = 20
}
