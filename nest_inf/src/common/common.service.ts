import { BadRequestException, Injectable } from '@nestjs/common'
import { BasePaginationDto } from './dto/base-pagination.dto'
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, MoreThan, Repository } from 'typeorm'
import { BaseModel } from './entity/base.entity'
import { FILTER_MAPPER } from './const/filter-mapper.const'
import { ConfigService } from '@nestjs/config'
import { ENV_DB_HOST_KEY, ENV_PROTOCOL_KEY } from './const/env.const'

@Injectable()
export class CommonService {
    constructor(private readonly configService: ConfigService) {}

    paginate<T extends BaseModel>(
        dto: BasePaginationDto,
        repository: Repository<T>,
        overrideFindOptions: FindManyOptions<T> = {},
        path: string,
    ) {
        if (dto.page) {
            return this.pagePaginate(dto, repository, overrideFindOptions)
        } else {
            return this.cursorPaginate(dto, repository, overrideFindOptions, path)
        }
    }

    private async pagePaginate<T extends BaseModel>(
        dto: BasePaginationDto,
        repository: Repository<T>,
        overrideFindOptions: FindManyOptions<T> = {},
    ) {
        const findOptions = this.composeFindOptions<T>(dto)

        const [data, count] = await repository.findAndCount({
            ...findOptions,
            ...overrideFindOptions,
        })

        return {
            data,
            total: count,
        }
    }

    private async cursorPaginate<T extends BaseModel>(
        dto: BasePaginationDto,
        repository: Repository<T>,
        overrideFindOptions: FindManyOptions<T> = {},
        path: string,
    ) {
        /**
         * where__likeCount__more_than
         *
         * where__title__ilike
         */
        const findOptions = this.composeFindOptions<T>(dto)

        const results = await repository.find({
            ...findOptions,
            ...overrideFindOptions,
        })

        const lastItem = results.length > 0 && results.length === dto.take ? results[results.length - 1] : null

        const protocol = this.configService.get<string>(ENV_PROTOCOL_KEY)
        const host = this.configService.get<string>(ENV_DB_HOST_KEY)

        const nextUrl = lastItem && new URL(`${protocol}://${host}/${path}`)

        if (nextUrl) {
            /**
             * dto의 키값들을 루핑하면서
             * 키값에 해당되는 벨류가 존재하면
             * param에 그대로 붙여넣는다.
             *
             * 단, where__id_more_than 값만 lastItem의 마지막 값으로 넣어준다.
             */
            for (const key of Object.keys(dto)) {
                if (dto[key]) {
                    if (key !== 'where__id__more_than' && key !== 'where__id__less_than') {
                        nextUrl.searchParams.append(key, dto[key])
                    }
                }
            }

            let key = null

            if (dto.order__createdAt === 'ASC') {
                key = 'where__id__more_than'
            } else {
                key = 'where__id__less_than'
            }

            nextUrl.searchParams.append(key, lastItem.id.toString())
        }

        return {
            data: results,
            cursor: {
                after: lastItem?.id ?? null,
            },
            count: results.length,
            next: nextUrl?.toString() ?? null,
        }
    }

    private composeFindOptions<T extends BaseModel>(dto: BasePaginationDto): FindManyOptions<T> {
        /**
         * DTO sample
         * {
         *  where__id__more_than: 1,
         *  order__createdAt: 'ASC'
         * }
         *
         * 현재는 where__id__more_than / where__id__less_than에 해당되는 where 필터만 사용중이지만
         * 나중에 where__likeCount__more_than 이나 where__title__ilike 등 추가 필터를 넣고싶어졌을때
         * 모든 where 필터들을 자동으로 파싱 할 수 있을 기능 제작
         *
         * 1) where로 시작한다면 필터 로직을 적용한다.
         * 2) order로 시작한다면 정렬 로직을 적용한다.
         * 3) 필터로직은 __을 기준으로 split 했을때 2개의 값으로 나뉘는지 3개의 값으로 나뉘는지 확인한다.
         */

        let where: FindOptionsWhere<T> = {}
        let order: FindOptionsOrder<T> = {}

        for (const [key, value] of Object.entries(dto)) {
            // key -> where__id__less_than
            // value -> 1

            if (key.startsWith('where__')) {
                where = {
                    ...where,
                    ...this.parseWhereFilter(key, value),
                }
            } else if (key.startsWith('order__')) {
                order = {
                    ...order,
                    ...this.parseWhereFilter(key, value),
                }
            }
        }

        // skip -> page 기반일때만
        return {
            where,
            order,
            take: dto.take,
            skip: dto.page ? dto.take * (dto.page - 1) : null,
        }
    }

    private parseWhereFilter<T extends BaseModel>(key: string, value: any): FindOptionsWhere<T> | FindOptionsOrder<T> {
        const options: FindOptionsWhere<T> = {}

        /**
         * ex) where__id__more_than ->  ['where', 'id', 'more_than']
         */
        const split = key.split('__')

        if (split.length !== 2 && split.length !== 3) {
            throw new BadRequestException(
                `where 필터는 '__'로 split 했을때 길이가 2 또는 3이어야합니다 - 문제되는 키값 : ${key}`,
            )
        }

        /**
         * ex) length === 2,  where__id = 3
         * ['where', 'id']
         */
        if (split.length === 2) {
            const [_, field] = split
            options[field] = value
        } else {
            /**
             * ex) length === 3, where__id__more_than
             * ['where', 'id', 'more_than'] -> 여기서 id는 field, more_than은 operator
             */
            const [_, field, operator] = split

            // ex) where__id__between = 3,4
            // split()은 아무 값이 없어도 length는 무조건 1이다.
            // field -> id , operator -> more_than , FILTER_MAPPER[operator] -> MoreThan
            // const values = value.toString().split(',')
            // if(operator === 'between'){
            //     options[field] = FILTER_MAPPER[operator](values[0], values[1]);
            // }else{
            //     options[field] = FILTER_MAPPER[operator](value);
            // }

            if (operator === 'i_like') {
                options[field] = FILTER_MAPPER[operator](`%${value}%`)
            } else {
                options[field] = FILTER_MAPPER[operator](value)
            }
        }
        return options
    }
}
