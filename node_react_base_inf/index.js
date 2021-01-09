const express = require('express')
const dotenv = require('dotenv')
const app = express()
const port = process.env.PORT || 4000

dotenv.config()


const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://michael:${process.env.DB_Password}@cluster0.donh0.mongodb.net/<dbname>?retryWrites=true&w=majority`, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected Success!'))
    .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!~~안녕하세요 ~ '))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))