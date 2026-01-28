const Sequelize = require('sequelize');
const User = require('./user');
const ClimateData = require('./climatedata'); // 설계도 가져오기

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;

// 1. db 객체에 모델들 담기
db.User = User;
db.ClimateData = ClimateData;

// 2. 각 모델 초기화 (initiate)
User.initiate(sequelize);
ClimateData.initiate(sequelize);

// 3. 관계 설정
User.associate(db);
ClimateData.associate(db);

module.exports = db;