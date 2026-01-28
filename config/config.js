require('dotenv').config();
module.exports = {
  development: {
    username: 'root',
    password: process.env.DB_PASSWORD, // .env 파일에서 비번을 가져옴
    database: 'on_chegam_db',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: process.env.DB_PASSWORD, // .env 파일에서 비번을 가져옴
    database: 'on_chegam_db',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: process.env.DB_PASSWORD, // .env 파일에서 비번을 가져옴
    database: 'on_chegam_db',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};