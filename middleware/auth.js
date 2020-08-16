const { User } = require('../models/User')

//인증 처리를 하는 곳.
let auth = (req, res, next) => {
    // client cookie에서 token을 가져옴
    let token = req.cookies.x_auth // 넣을 때 이름으로 가져옴

    // 토큰을 복호화 한 후 유저를 찾는다.
    // 유저가 있으면 인증 ok 
    // 유저가 없으면 인증 no
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true });

        // 이렇게 넣어주면 req에서 꺼내 쓸 수 있다.
        req.token = token;
        req.user = user;
        next(); // next를 해주어야 다음 함수로 넘어감.
    })
}

module.exports = { auth };