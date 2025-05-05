import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { BatchService } from './batch.service';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { CreateJobDto } from './dto/create-job.dto';
import { JobResponseDto } from './dto/job-response.dto';
import { JobStatusDto } from './dto/job-status.dto';

@ApiTags('batch')
@Controller('batch')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @ApiOperation({ summary: '새로운 배치 작업 생성' })
  @ApiResponse({
    status: 201,
    description: '작업이 성공적으로 큐에 추가됨',
    type: JobResponseDto,
  })
  @Post('job')
  async addJob(@Body() data: CreateJobDto): Promise<JobResponseDto> {
    const job = await this.batchService.addSampleJob(data);
    return { jobId: job.id, message: '작업이 성공적으로 큐에 추가되었습니다.' };
  }

  @ApiOperation({ summary: '특정 작업의 상태 조회' })
  @ApiParam({ name: 'id', description: '조회할 작업의 ID' })
  @ApiResponse({
    status: 200,
    description: '작업 상태 정보',
    type: JobStatusDto,
  })
  @ApiResponse({
    status: 404,
    description: '작업을 찾을 수 없음',
  })
  @Get('job/:id')
  async getJobStatus(@Param('id') id: string): Promise<JobStatusDto> {
    return this.batchService.getJobStatus(id);
  }

  @ApiOperation({ summary: '모든 작업 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '작업 목록',
    type: [JobStatusDto],
  })
  @Get('jobs')
  async getAllJobs(): Promise<JobStatusDto[]> {
    return this.batchService.getAllJobs();
  }
}
