const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true})); // application/x-www-urlencoded 형태의 데이터 받아줌
app.use(bodyParser.json()); //application/json 형태의 데이터 받아줌

const cookieParser = require('cookie-parser')
app.use(cookieParser())

// import
const { auth } = require("./middleware/auth")
const { User } = require("./models/User");

const config = require('./config/key');


const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))


//Register Route
app.get('/', (req, res) => res.send('Hello World! 안녕하세요!!!'))
app.get('/api/hello', (req, res) => res.send('Hello World! 안녕하세요!!!'))

app.post('/api/users/register', (req, res) => {
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) {
            return res.json({
                success: false, 
                err
            })
        } else {
            return res.status(200).json({
                success: true
            })
        }
    })
})

app.post('/api/users/login', (req, res) => {
    console.log(req)
    
    // 요청된 이메일이 데이터베이스에 있는지 찾는다
    User.findOne({ email: req.body.email }, (err, user) => {
        
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        console.log(user)
        
        // 요청된 이메일이 db에 있다면 비밀번호가 맞는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            console.log(isMatch)
            
            if(!isMatch) 
            return res.json({
                loginSuccess: false,
                message: "비밀번호가 틀렸습니다."
            })
            
            // 비밀번호까지 맞다면 토큰을 생성
            // 토큰을 저장한 후 user를 받아옴
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err)
                
                //토큰을 저장한다. 어디에?.. 쿠키, 로컬스토리지...
                // npm install cookie-parser
                res.cookie("x_auth", user.token)
                .status(200)
                .json({
                    loginSuccess: true,
                    userId: user._id
                })
                
            })
        })
        
    })
})

// endpoint, auth : 미들웨어(콜백함수 호출 전 실행), 콜백함수
app.get('/api/users/auth', auth, (req, res) => {
    // 콜백까지 왔다는 것은 authentication을 통과했다는 것.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? true : false, // role이 0이면 관리자.
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).send({
            success: true
        })
    })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))