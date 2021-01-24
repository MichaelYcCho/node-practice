const express = require('express')
const dotenv = require('dotenv')
const app = express()
const port = process.env.PORT || 4000
const bodyParser = require('body-parser');
const { User } = require("./models/User");

const config = require('./config/key');

//application/x-www-form-urlencoded 데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({ extended: true }));

//application/json 을 분석
app.use(bodyParser.json());

dotenv.config()


const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://michael:${config.DB_Password}@cluster0.donh0.mongodb.net/<dbname>?retryWrites=true&w=majority`, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected Success!'))
    .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!~~안녕하세요 ~ '))

app.post('/register', (req, res) => {

    // client에서 회원가입(User model)정보를 받아 db에 넣는다

    const user = new User(req.body)
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })


})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))