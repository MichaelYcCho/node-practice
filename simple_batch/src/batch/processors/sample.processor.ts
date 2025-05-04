import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('sample-queue')
export class SampleProcessor {
  private readonly logger = new Logger(SampleProcessor.name);

  @Process('sample-job')
  async handleSampleJob(job: Job) {
    this.logger.debug(`작업 시작: ${job.id}`);
    this.logger.debug(`데이터: ${JSON.stringify(job.data)}`);

    // 작업 진행 상황 업데이트
    await job.progress(10);

    try {
      // 복잡한 작업 시뮬레이션
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 대기
        await job.progress((i + 1) * 10); // 진행률 업데이트
        this.logger.debug(`작업 진행률: ${(i + 1) * 10}%`);
      }

      // 작업 결과 반환
      this.logger.debug(`작업 완료: ${job.id}`);
      return {
        success: true,
        processedAt: new Date(),
        result: '작업이 성공적으로 완료되었습니다.',
      };
    } catch (error) {
      this.logger.error(`작업 실패: ${job.id}`, error.stack);
      throw new Error(`작업 처리 중 오류 발생: ${error.message}`);
    }
  }
}
