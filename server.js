const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config(); // .env 파일의 API 키를 읽어오기

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/api/weather', async (req, res) => {
    // fetchWeather에서 보낸 쿼리 파라미터(lat, lon) 받기
    const { lat, lon } = req.query;
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    try {
        // OpenWeatherMap API 호출
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;
        const response = await axios.get(url);
        
        // 필요한 데이터만 골라서 프론트엔드로 전달
        const data = response.data;
        res.json({
            temp: data.main.temp,        // 현재 기온
            feels_like: data.main.feels_like, // 체감 기온
            city: data.name,             // 도시 이름
            description: data.weather[0].description // 날씨 설명
        });
    } catch (error) {
        console.error("API 호출 에러:", error);
        res.status(500).json({ error: "날씨 정보를 가져오는 데 실패했습니다." });
    }
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});