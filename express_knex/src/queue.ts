import Queue from 'bull';
import { redisConfig } from './config';


const taskQueue = new Queue('taskQueue', {
  redis: redisConfig,
});

taskQueue.process(async (job) => {
  console.log('시작 ID:', job.id);
  console.log('Job data:', job.data);
  // 작업 수행단.
//   await new Promise((resolve) => setTimeout(resolve, 5000)); 
//   console.log('Job completed:', job.id);
});

export default taskQueue;