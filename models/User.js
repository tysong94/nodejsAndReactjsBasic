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

userSchema.pre('save', function ( next ) {
    var user = this; // userSchema를 가리킴

    // user의 패스워드 값이 변경되었을 때만.
    if(user.isModified('password')) {

        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })

    }

})

const User = mongoose.model('User', userSchema);

// 해당 상수를 다른 곳에서도 사용할 수 있도록 함.
module.exports = { User }