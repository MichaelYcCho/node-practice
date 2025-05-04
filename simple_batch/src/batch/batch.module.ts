import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BatchService } from './batch.service';
import { BatchController } from './batch.controller';
import { SampleProcessor } from './processors/sample.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'sample-queue',
    }),
  ],
  controllers: [BatchController],
  providers: [BatchService, SampleProcessor],
  exports: [BatchService],
})
export class BatchModule {}
