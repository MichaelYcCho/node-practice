const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));


app.use('/add-product', (req, res, next) => {
    console.log('another middleware!'); res, next
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});


app.use('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});


// 새로운 미들웨어를 추가하는 방법
app.use('/', (req, res, next) => {
    console.log('next middleware!');
    res.send('<h1>Hello from Express!</h1>');
});

app.listen(3000);

