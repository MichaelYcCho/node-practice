import express, { Application, Request, Response } from 'express'
import knex from 'knex'
import Bull from "bull";
import taskQueue from './queue';
require('dotenv').config({path: './.env'});

const app: Application = express()

const port: number = 3000

app.use(express.json());

app.post('/add-job', async (req, res) => {
    const { data, delay } = req.body;
    const job = await taskQueue.add(data, { delay });
    console.log({ jobId: job.id, status: 'Job added to queue with delay' })
    res.json({ jobId: job.id, status: 'response' });
  });


app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})