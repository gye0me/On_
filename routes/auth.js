const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const router = express.Router();

// 카카오 로그인 시작점
router.get('/kakao', passport.authenticate('kakao'));

// 카카오 로그인 콜백
router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/?loginError=카카오로그인 실패',
}), (req, res) => {
  res.redirect('/'); // 로그인 성공 시 메인 화면으로
});

// 로그아웃
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// 회원가입
router.post('/join', async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect('/join?error=exist');
    }
    const hash = await bcrypt.hash(password, 12); // 비밀번호 암호화
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 로그인
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) return next(authError);
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) return next(loginError);
      return res.redirect('/');
    });
  })(req, res, next);
});

module.exports = router;