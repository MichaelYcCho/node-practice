import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { localsMiddleware } from "./middlewares";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";
const app = express();

app.set("view engine", "pug");

app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));

// 미들웨어영역
app.use(helmet()); // 보안강화를 위해 미들웨어에 같이 쓰임
app.use(function (req, res, next) {
    res.setHeader("Content-Security-Policy", "script-src 'self' https://archive.org");
    return next();
});
app.use(cookieParser()); // 쿠키를 전달받아서 사용할수 있도록 하는 미들웨어 사용자인증시 필요
app.use(bodyParser.json()); // 사용자가 웹사이트로 전달하는 정보들을 검사함  request정보에서 form이나 json형태로된 body를 검사함
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
/*
 morgan
 tiny -어떤접속(get)인지, 어디서 접속했는지 알수 있음 / combine - 어떤종류의 브라우저인지, 어떤종류의 접속인지 알 수 있음
 어플리케이션에서 발생하는 모든것을 로깅(logging) 함
*/

app.use(localsMiddleware);

// 라우터영역
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);


export default app;