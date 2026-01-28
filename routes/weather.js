const express = require('express');
const { ClimateData } = require('../models'); // 우리 모델 가져오기
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    // DB에서 가장 최근에 저장된 데이터 1개 가져오기
    const weather = await ClimateData.findOne({
      order: [['createdAt', 'DESC']],
    });
    
    // 화면(weather.html)에 데이터 던져주기
    res.render('weather', { 
      title: '오늘의 온-체감',
      weather: weather 
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;