const http = require('http');
const express = require('express');

const app = express();

// 새로운 미들웨어를 추가하는 방법
app.use((req, res, next) => {
    console.log('In the middleware!');
    next(); // Allows the request to continue to the next middleware in line
});

app.use((req, res, next) => {
    console.log('next middleware!');
});

const server = http.createServer(app);

server.listen(3000);