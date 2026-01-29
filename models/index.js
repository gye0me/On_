const Sequelize = require('sequelize');  // 파일 가져오기
const User = require('./user');
const ClimateData = require('./climatedata');
const EmissionFactor = require('./emission_factor');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;

// db 객체에 담기
db.User = User;
db.ClimateData = ClimateData;
db.EmissionFactor = EmissionFactor;

// 모델 초기화
User.initiate(sequelize);
ClimateData.initiate(sequelize);
EmissionFactor.initiate(sequelize); 

User.associate(db);
ClimateData.associate(db);
EmissionFactor.associate(db); 

module.exports = db;