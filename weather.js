// weather.js (인증 대기용 임시 코드)
const { ClimateData } = require('./models');

const mockFetch = async () => {
  try {
    // API 호출 대신 가짜 데이터 생성
    const currentTemp = 5; 
    
    await ClimateData.create({
      temp: currentTemp,
      outer: '코트',
      top: '셔츠',
      bottom: '슬랙스',
      carbonIndex: 0.52 //
    });
    console.log("🧪 인증 대기 중: 가짜 데이터 저장 성공!");
  } catch (err) {
    console.error(err);
  }
};

mockFetch();