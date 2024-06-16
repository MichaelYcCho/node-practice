import { IsNumber } from 'class-validator'

export class CreateChatDto {
    // each: 각각의 값들이 모두 Number인지 검사
    @IsNumber({}, { each: true })
    userIds: number[]
}
