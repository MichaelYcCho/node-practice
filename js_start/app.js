const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => { 
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' }); // A Post is related to a User
User.hasMany(Product); // A User can have many posts
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });


sequelize
  .sync({ force: true }) // 기존 테이블을 삭제하고 새로 생성 (true)
  .then(result => {
    // console.log(result);
    return User.findByPk(1);
  })
  .then(user => {
    if (!user){
      return User.create({ name: 'Max', email: 'test@test.com' });
    }
    return Promise.resolve(user);
  })
  .then(user => {
    // console.log(user);
    return user.createCart();
  })
  .then(user => {
    console.log(user);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });