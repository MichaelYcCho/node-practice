const { User } = require('../models/User');

//인증처리 미들웨어

let auth = (req, res, next) => {

    // 클라이언트 쿠키에서 토큰 가져옴
    let token = req.cookies.x_auth;

    // 토큰을 복호화 한 후 유저 find
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true })

        req.token = token;
        req.user = user;
        next();
    });

    //유저가 있으면 인증 완료


}


module.exports = { auth };