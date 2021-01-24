const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10


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

const User = mongoose.model('User', userSchema)

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        // salt생성
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)
        })

        //비밀번호의 암호화
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err)

            user.password = hash
            next()
        })
    }
})

module.exports = { User }