const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true})); // application/x-www-urlencoded 형태의 데이터 받아줌
app.use(bodyParser.json()); //application/json 형태의 데이터 받아줌

const { User } = require("./models/User");

const config = require('./config/key');


const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! 안녕하세요!!!'))
    
//Register Route

app.post('/register', (req, res) => {
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

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))