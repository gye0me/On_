const Sequelize = require('sequelize');
const User = require('./user'); // 1. User 설계도 가져오기

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User; // 2. db 객체에 User 담기

User.initiate(sequelize); // 3. User 연결하기
User.associate(db); // 4. 관계 설정하기

module.exports = db;