const express = require('express')
const dotenv = require('dotenv')
const app = express()
const port = process.env.PORT || 4000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require("./models/User");

const config = require('./config/key');

//application/x-www-form-urlencoded 데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({ extended: true }));

//application/json 을 분석
app.use(bodyParser.json());
app.use(cookieParser());

dotenv.config()


const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://michael:${config.DB_Password}@cluster0.donh0.mongodb.net/<dbname>?retryWrites=true&w=majority`, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected Success!'))
    .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!~~안녕하세요 ~ '))

app.post('/api/users/register', (req, res) => {

    // client에서 회원가입(User model)정보를 받아 db에 넣는다

    const user = new User(req.body)
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            userInfo,
            success: true
        })
    })
});

app.post('/api/users/login', (req, res) => {

    // 1. request로 넘어온 이메일이 db에 있는지 확인
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "가입되지않은 이메일입니다."
            })
        }

        // 2. 이메일이 db에있따면 비밀번호확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

            //비밀번호 일치한다면 토큰 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                // token을 x_auth라는 이름으로 쿠키에 저장
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))