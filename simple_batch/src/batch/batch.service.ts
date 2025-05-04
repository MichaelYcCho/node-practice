import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class BatchService {
  constructor(
    @InjectQueue('sample-queue') private readonly sampleQueue: Queue,
  ) {}

  // 작업을 큐에 추가하는 메서드
  async addSampleJob(data: any): Promise<any> {
    return this.sampleQueue.add('sample-job', data, {
      attempts: 3, // 재시도 횟수
      removeOnComplete: true, // 완료 후 작업 제거
      delay: 1000, // 1초 후에 실행 (선택 사항)
    });
  }

  // 작업 상태 조회 메서드
  async getJobStatus(jobId: string): Promise<any> {
    const job = await this.sampleQueue.getJob(jobId);
    if (!job) {
      return { status: 'not_found' };
    }

    const state = await job.getState();
    const progress = await job.progress();

    return {
      id: job.id,
      state,
      progress,
      data: job.data,
      createdAt: job.timestamp,
    };
  }

  // 모든 대기 중인 작업 가져오기
  async getAllJobs(): Promise<any> {
    const jobs = await this.sampleQueue.getJobs([
      'waiting',
      'active',
      'delayed',
      'failed',
      'completed',
    ]);
    return jobs.map((job) => ({
      id: job.id,
      state: job.finishedOn
        ? 'completed'
        : job.failedReason
          ? 'failed'
          : 'pending',
      data: job.data,
      createdAt: job.timestamp,
    }));
  }
}
