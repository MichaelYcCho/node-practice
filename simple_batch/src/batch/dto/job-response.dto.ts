import { ApiProperty } from '@nestjs/swagger';

export class JobResponseDto {
  @ApiProperty({
    description: '작업 ID',
    example: '1621354987452',
  })
  jobId: string;

  @ApiProperty({
    description: '상태 메시지',
    example: '작업이 성공적으로 큐에 추가되었습니다.',
  })
  message: string;
}
