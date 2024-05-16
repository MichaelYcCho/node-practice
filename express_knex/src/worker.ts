import taskQueue from './queue';

console.log('Worker started...');
taskQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed!`);
});

taskQueue.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed with error ${err.message}`);
});