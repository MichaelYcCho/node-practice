import express, { Application, Request, Response } from 'express'
import knex from 'knex'

const app: Application = express()

const port: number = 3000

app.get('/main', (req: Request, res: Response) => {
    knex('users')
    .select({
      id: 'id',
      username: 'name'
    })
    .then((users) => {
      return res.json(users);
    })
    .catch((err) => {
      console.error(err);
      return res.json({success: false, message: 'An error occurred, please try again later.'});
    })
    res.send('Hello main')
})



app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})