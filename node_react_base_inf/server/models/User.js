const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})



userSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {

        // salt생성
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            //비밀번호의 암호화
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
    // request에서 넘어온 pwd와 db에 hash된 pwd 비교
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function (cb) {
    var user = this;

    //jwt 생성

    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    //user._id + secretToekn으로 token 생성됨
    //이떄 secretToken을 넣으면 _id가 나타나는 방식

    user.token = token
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    //토큰의 decode

    jwt.verify(token, 'secretToken', function (err, decoded) {

        // 유저 아이디를 이용하여 유저를 찾은 후 
        // 클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인

        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }