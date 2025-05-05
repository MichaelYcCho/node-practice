import { ApiProperty } from '@nestjs/swagger';

export class JobStatusDto {
  @ApiProperty({
    description: '작업 ID',
    example: '1621354987452',
  })
  id: string;

  @ApiProperty({
    description: '작업 상태',
    example: 'completed',
    enum: ['waiting', 'active', 'completed', 'failed', 'delayed'],
  })
  state: string;

  @ApiProperty({
    description: '작업 진행률',
    example: 100,
    minimum: 0,
    maximum: 100,
  })
  progress: number;

  @ApiProperty({
    description: '작업 데이터',
    example: { name: '데이터 처리 작업', params: { key1: 'value1' } },
  })
  data: any;

  @ApiProperty({
    description: '작업 생성 시간',
    example: '2025-05-07T12:34:56.789Z',
  })
  createdAt: Date;
}
