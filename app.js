const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const actionRouter = require('./routes/action');

dotenv.config();

// 라우터 및 설정 가져오기
const weatherRouter = require('./routes/weather');
const authRouter = require('./routes/auth');
const passportConfig = require('./passport');
const { sequelize } = require('./models');

const app = express();
passportConfig(); // 패스포트 설정 실행

app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure(path.join(__dirname, 'views'), {
  express: app,
  watch: true,
  noCache: true,
});

sequelize.sync({ force: false })
  .then(() => { console.log('데이터베이스 연결 성공!'); })
  .catch((err) => { console.error('DB 연결 에러:', err); });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// 세션 설정
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

// 패스포트 미들웨어
app.use(passport.initialize());
app.use(passport.session());

// 모든 템플릿에서 사용할 수 있도록 유저 정보 전달
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// 라우터 연결
app.use('/auth', authRouter);
app.use('/weather', weatherRouter);
app.use('/auth', authRouter);
app.use('/weather', weatherRouter);
app.use('/action', actionRouter);

// 수정 테스트 라우터를 다른 라우터보다 '위'에 배치해서 가로채기 확인
app.get('/debug-test', (req, res) => {
  res.send('<h1>라우터 연결 성공! 이 글자가 보이나요?</h1>');
});

// 라우터 연결
app.use('/auth', authRouter);
app.use('/weather', weatherRouter);

// 메인 페이지 라우터
app.get('/', (req, res) => {
  res.render('main', { title: '온(On): 체감' });
});

// 회원가입 페이지 라우터
app.get('/join', (req, res) => {
  res.render('join', { title: '회원가입 - 온(On)' });
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중!');
});