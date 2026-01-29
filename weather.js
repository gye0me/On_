const axios = require('axios');
const { ClimateData } = require('./models');
require('dotenv').config();

const collectFiveYearsData = async () => {
  // 수집하고 싶은 연도 리스트
  const years = ['2021', '2022', '2023', '2024', '2025',];

  for (const year of years) {
    try {
      console.log(`⏳ ${year}년 데이터 수집 시작...`);

      const response = await axios.get('http://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList', {
        params: {
          serviceKey: process.env.DATA_SERVICE_KEY,
          numOfRows: 366, // 1년치(윤년 포함)를 한 번에 가져오기 위해 넉넉히 설정
          pageNo: 1,
          dataType: 'JSON',
          dataCd: 'ASOS',
          dateCd: 'DAY',
          startDt: `${year}0101`, // 각 연도 1월 1일부터
          endDt: `${year}1231`,   // 각 연도 12월 31일까지
          numOfRows: 366,         // 1년치를 한 번에 가져오도록 최대 용량 설정
          stnIds: '108'
        }
      });

      const items = response.data.response.body.items.item;

      if (items && items.length > 0) {
        // 한꺼번에 DB에 넣기 (bulkCreate가 훨씬 빠름)
        const weatherData = items.map(item => {
          const avgTemp = parseFloat(item.avgTa);
          
          // 기온별 로직 적용
          let recommended = { outer: '코트', top: '니트', bottom: '슬랙스', carbon: 0.52 };
          if (avgTemp <= 4) recommended = { outer: '패딩', top: '기모 맨투맨', bottom: '기모 바지', carbon: 0.85 };
          else if (avgTemp > 18) recommended = { outer: '가디건', top: '반팔', bottom: '면바지', carbon: 0.25 };

          return {
            temp: avgTemp,
            outer: recommended.outer,
            top: recommended.top,
            bottom: recommended.bottom,
            carbonIndex: recommended.carbon,
            createdAt: new Date(item.tm) // 실제 날짜를 생성일로 기록
          };
        });

        await ClimateData.bulkCreate(weatherData); // 365개를 한 번에
        console.log(`✅ ${year}년 데이터 (${items.length}건) 저장 완료`);
      }

      // 기상청 서버를 배려해 1초 정도 쉬었다가 다음 연도 진행
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`❌ ${year}년 수집 중 에러:`, error.message);
    }
  }
  console.log("🏁 모든 데이터 수집이 끝났습니다.");
};

collectFiveYearsData();