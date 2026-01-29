const express = require('express');
const { ClimateData, EmissionFactor } = require('../models');
const { getCarbonG } = require('../utils/carbonCalculator');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    // 오늘 날짜(월-일) 자동 감지
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const targetMD = `${month}-${day}`; 

    // DB에서 탄소 배출 계수 가져오기
    const factorRow = await EmissionFactor.findOne({ 
      where: { category: '전력(소비단)' } 
    });
    const EF = factorRow ? factorRow.factor_value : 0.4173; 

    // DB에서 모든 데이터를 가져와서 오늘 날짜와 일치하는 것만 필터링
    const allData = await ClimateData.findAll({
      order: [['createdAt', 'DESC']]
    });

    const pastWeathers = allData.filter(data => {
      const dateStr = data.createdAt.toISOString();
      return dateStr.includes(targetMD); 
    });

    // 각 데이터마다 탄소 배출량(g) 계산
    const todayTemp = -2.0; // 실시간 기온 (현재는 가상 데이터) 

    const processedData = pastWeathers.map(data => {
      const tempDiff = Math.abs(data.temp - todayTemp); 
      
      // 외부 유틸 함수 사용 (CommonJS 방식)
      const carbonG = getCarbonG(tempDiff, EF); 

      return {
        ...data.dataValues,
        carbonG: carbonG 
      };
    });

    console.log(`🔎 오늘(${targetMD}) 기준 ${processedData.length}건 계산 완료`);

    // 화면으로 전송
    res.render('weather', {
      title: '온-체감: 과거 5년 데이터 조회',
      pastWeathers: processedData,
      todayMD: targetMD,
      emissionFactor: EF
    });

  } catch (err) {
    console.error('❌ 라우터 에러:', err);
    next(err);
  }
});

module.exports = router;