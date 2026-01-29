const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const weatherRouter = require('./routes/weather');
const passportConfig = require('./passport');
const authRouter = require('./routes/auth');

const { sequelize } = require('./models'); // DB 연결용

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 8001);

app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

// 데이터베이스 연결 시도
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공!');
  })
  .catch((err) => {
    console.error('DB 연결 에러:', err);
  });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중!');
});

app.use('/weather', weatherRouter);

passportConfig();

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);