const Sequelize = require('sequelize');

const sequelize = require('../util/database');

// Define a model, 첫번째 인자는 테이블 이름, 두번째 인자는 테이블의 컬럼 정보
const Product = sequelize.define('product', {
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title:{
    type: Sequelize.STRING,
  },
  price:{
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl:{
    type: Sequelize.STRING,
    allowNull: false
  },
  description:{
    type: Sequelize.STRING,
    allowNull: false
  }
  });

module.exports = Product;