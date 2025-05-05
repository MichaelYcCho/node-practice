import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({
    description: '작업 이름',
    example: '데이터 처리 작업',
  })
  name: string;

  @ApiProperty({
    description: '작업 파라미터',
    example: { key1: 'value1', key2: 'value2' },
    required: false,
  })
  params?: Record<string, any>;
}
