const express = require('express');
const { ClimateData } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    // 자동으로 오늘 날짜(월-일) 감지
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const targetMD = `${month}-${day}`; // 오늘 접속하면 자동으로 오늘 날짜가 나옴

    // DB에서 모든 데이터를 가져와서 필터링
    const allData = await ClimateData.findAll({
      order: [['createdAt', 'DESC']]
    });

    // 오늘 날짜와 일치하는 과거 데이터만 골라내기
    const pastWeathers = allData.filter(data => {
      const dateStr = data.createdAt.toISOString();
      // 연도는 상관없이 월-일만 일치하면 통과
      return dateStr.includes(targetMD); 
    });

    console.log(`🔎 오늘(${targetMD}) 기준으로 찾은 과거 데이터: ${pastWeathers.length}건`);

    // 화면 렌더링 (실시간 데이터는 빈 값으로 두었으니 나중에 채워야 함)
    res.render('weather', {
      title: '온-체감: 과거 5년 데이터 조회',
      pastWeathers, // 2021~2025년 데이터 리스트
      todayMD: targetMD
    });

  } catch (err) {
    console.error('❌ 라우터 에러:', err);
    next(err);
  }
});

module.exports = router;