export interface SampleJobData {
  // 작업에 필요한 데이터 정의
  name: string;
  params?: Record<string, any>;
  createdAt?: Date;
}

export interface JobResult {
  success: boolean;
  processedAt: Date;
  result: string;
  error?: string;
}
