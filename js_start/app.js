const express = require('express');

const app = express();

// 새로운 미들웨어를 추가하는 방법
app.use((req, res, next) => {
    console.log('In the middleware!');
    next(); // Allows the request to continue to the next middleware in line
});

app.use((req, res, next) => {
    console.log('next middleware!');
    res.send('<h1>Hello from Express!</h1>');
});

app.listen(3000);