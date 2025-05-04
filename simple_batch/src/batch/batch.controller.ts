import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { BatchService } from './batch.service';

@Controller('batch')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post('job')
  async addJob(@Body() data: any) {
    const job = await this.batchService.addSampleJob(data);
    return { jobId: job.id, message: '작업이 성공적으로 큐에 추가되었습니다.' };
  }

  @Get('job/:id')
  async getJobStatus(@Param('id') id: string) {
    return this.batchService.getJobStatus(id);
  }

  @Get('jobs')
  async getAllJobs() {
    return this.batchService.getAllJobs();
  }
}
