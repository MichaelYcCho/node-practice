import express, { Application, Request, Response } from 'express'
import knex from 'knex'
require('dotenv').config({path: './.env'});

const app: Application = express()

const port: number = 3000

app.get('/main', (req: Request, res: Response) => {

    const knex = require('knex')({ 
        client: 'pg',
        connection:{
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user:     process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port:process.env.DB_PORT,
        }})

     knex.select('id').from('users').then((data: any) => {
        console.log(data)

    }
    )
    res.send('Hello World!')

    
   

    })


app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})