# On-Chegam

## 1. pull을 처음 받고 난 뒤
- npm install 콘솔에 입력
- MySQL Workbench를 설치한 뒤 My Connections에 추가한 뒤 CREATE DATABASE on_chegam_db; 입력해서 개별 로컬 DB 생
- .env 파일 업데이트
  - 필수 내용 : DATA_SERVICE_KEY=... (기상청 인증키 - 단톡방에 공유, 유출 금지) / COOKIE_SECRET=... (세션 비밀키 - 아무 문자열 사용 가능) / DB_PASSWORD=... (본인 MySQL 워크벤치 비밀번호)
  - .env.example 참고
  - .env 파일을 고쳤다면 반드시 서버를 껐다가(Ctrl + C) 다시 켜야 적용됨
 

## 2. 서버 켜기
- npx nodemon app.js 명령어 콘솔에 입력
- 워크벤치에서 climatedatas 테이블이 생겼는지 확인(왼쪽)


## 3. 로컬 DB에 데이터 저장
- 워크벤치를 설치하여 개인 DB 생성(이름은 반드시 on_chegam_db로 해야 함)
- 콘솔에서 node weather.js 입력
- ✅ 2025년 데이터 (365건) 저장 완료 << 이런 메시지들이 콘솔에 2021년도부터 2025년까지 순서대로 떠야 함


## 4. 워크벤치에 생성되야야 하는 테이블 : 4개
<img width="200" alt="image" src="https://github.com/user-attachments/assets/274522d3-5b88-45fe-9b79-e49be97af8a2" />
- npm start로 서버를 켠 뒤 워크벤치에서 테이블이 모두 존재하는 확인






## 참고 사항
- 반드시 작업은 개인 브랜치 생성 후 작업해야 함(develop 브랜치는 개인 각각의 코드를 통합하는 브랜치)  
- config/config.js에 비밀번호를 직접 적지 말고 반드시 .env를 통해서만 관리해야 함
- node weather.js를 실행하면 현재는 가짜 데이터(Mock Data)가 DB에 저장됨 (인증키 승인 대기 중이라 임시 조치, 추후에 수정할 예정)
- 브라우저에서 localhost:8001/weather 접속 시, 저장된 날씨와 옷차림 정보가 출력되면 성공
