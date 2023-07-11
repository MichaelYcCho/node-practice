const express = require('express');

const app = express();

app.use('/', (req, res, next) => {
    console.log('This always runs!');
    next()
});


app.use('/add-product', (req, res, next) => {
    console.log('another middleware!');
    res.send('<h1>The Add Product Page!</h1>');
});


// 새로운 미들웨어를 추가하는 방법
app.use('/', (req, res, next) => {
    console.log('next middleware!');
    res.send('<h1>Hello from Express!</h1>');
});

app.listen(3000);

