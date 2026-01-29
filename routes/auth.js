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

module.exports = router;