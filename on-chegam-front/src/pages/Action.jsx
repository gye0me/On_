import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wind, Coffee, Lightbulb, Refrigerator, Tv, Waves, ThermometerSnowflake, TreeDeciduous } from 'lucide-react';

axios.defaults.withCredentials = true;

const ActionPage = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [loading, setLoading] = useState(true);

  const actionData = [
    { id: 1, type: '에너지', title: '에어컨 1°C 올리기', desc: '설정 온도를 26°C로 유지하면 전력 소비 7% 절감', co2: 0.5, icon: <ThermometerSnowflake size={20} />, tagColor: '#FFF4D6' },
    { id: 2, type: '생활', title: '텀블러 사용하기', desc: '일회용 컵 대신 개인 텀블러 사용', co2: 0.3, icon: <Coffee size={20} />, tagColor: '#E8F5E9' },
    { id: 3, type: '에너지', title: '불필요한 조명 끄기', desc: '사용하지 않는 공간의 조명 소등', co2: 0.1, icon: <Lightbulb size={20} />, tagColor: '#FFF4D6' },
    { id: 4, type: '에너지', title: '냉장고 적정 용량 유지', desc: '냉장실 70% 이하로 채워 효율 높이기', co2: 0.3, icon: <Refrigerator size={20} />, tagColor: '#FFF4D6' },
    { id: 5, type: '에너지', title: '가전제품 대기전력 차단', desc: '미사용 가전 플러그 뽑기', co2: 0.2, icon: <Tv size={20} />, tagColor: '#FFF4D6' },
    { id: 6, type: '생활', title: '양치컵 사용하기', desc: '양치 시 물을 틀어놓지 않고 컵 사용', co2: 0.1, icon: <Waves size={20} />, tagColor: '#E8F5E9' },
    { id: 7, type: '생활', title: '가까운 거리 걷기', desc: '차량 대신 도보나 자전거 이용', co2: 0.4, icon: <Wind size={20} />, tagColor: '#E8F5E9' },
  ];

  const fetchInitialData = async () => {
    try {
      const response = await axios.get('http://localhost:8001/action');
      const initialActions = Array.isArray(response.data) ? response.data : [];
      
      const initialCheckedState = {};
      initialActions.forEach(action => {
        const match = actionData.find(item => item.title === action.content);
        if (match) initialCheckedState[match.id] = true;
      });
      setCheckedItems(initialCheckedState);
    } catch (err) {
      console.error("Action 데이터 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInitialData(); }, []);

  const handleToggle = async (action) => {
    const isChecking = !checkedItems[action.id];
    try {
      if (isChecking) {
        await axios.post('http://localhost:8001/action', { content: action.title, reduction: action.co2 });
      } else {
        await axios.delete('http://localhost:8001/action', { data: { content: action.title } });
      }
      setCheckedItems(prev => ({ ...prev, [action.id]: isChecking }));
    } catch (err) {
      console.error(err);
      alert("서버 연결에 실패했습니다. 로그인을 다시 해주세요.");
    }
  }; // <- 이 부분 닫는 중괄호가 빠져있어서 추가했습니다.

  const totalSavedCO2 = actionData.filter(item => checkedItems[item.id]).reduce((acc, cur) => acc + cur.co2, 0);
  const daysNeeded = Math.round(totalSavedCO2 / 0.018);

  if (loading) return <div style={{ padding: '20px' }}>로딩 중...</div>;

  return (
    <div style={styles.page}>
      <header style={styles.heroCard}>
        <h2 style={styles.heroTitle}>오늘의 탄소발자국 미션</h2>
        <div style={styles.unifiedStatBox}>
          <div>
            <span style={styles.statLabel}>오늘 절감량</span>
            <div style={styles.mainValueContainer}>
              <span style={styles.mainValue}>{totalSavedCO2.toFixed(1)}</span><span style={styles.mainUnit}>Kg</span>
            </div>
            {totalSavedCO2 > 0 && (
              <div style={styles.treeInfo}>
                <TreeDeciduous size={14} color="#2D5A27" />
                <span style={styles.treeText}>나무 1그루가 <b>{daysNeeded}일</b>간 흡수할 양</span>
              </div>
            )}
          </div>
        </div>
      </header>
      <main style={styles.listContainer}>
        {actionData.map(action => (
          <div key={action.id} style={styles.actionCard}>
            <div style={styles.cardLeft}>
              <div style={styles.iconBox}>{action.icon}</div>
              <div>
                <h3 style={styles.cardTitle}>{action.title}</h3>
                <span style={styles.co2Text}>-{action.co2}kg CO2</span>
              </div>
            </div>
            <div onClick={() => handleToggle(action)} style={{...styles.switchBase, backgroundColor: checkedItems[action.id] ? '#6BAE42' : '#E0E0E0'}}>
              <div style={{...styles.switchHandle, transform: checkedItems[action.id] ? 'translateX(20px)' : 'translateX(0)'}} />
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

const styles = {
  page: { display: "flex", flexDirection: "column", gap: 14, fontFamily: '"Pretendard", sans-serif' },
  heroCard: { background: "#fff", borderRadius: 16, padding: 18, boxShadow: "0 10px 24px rgba(0,0,0,0.08)" },
  heroTitle: { fontSize: 26, fontWeight: 800, marginBottom: 6 },
  unifiedStatBox: { backgroundColor: '#D9EEF7', padding: '25px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
  statLabel: { fontSize: '14px', color: '#333', fontWeight: '800' },
  mainValueContainer: { display: 'flex', alignItems: 'baseline', gap: '2px' },
  mainValue: { fontSize: '42px', fontWeight: '900', color: '#000', lineHeight: '1' },
  mainUnit: { fontSize: '20px', fontWeight: '800', color: '#000' },
  treeInfo: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '4px 10px', borderRadius: '12px' },
  treeText: { fontSize: '11px', color: '#2D5A27', fontWeight: '600' },
  listContainer: { display: "flex", flexDirection: "column", gap: 14 },
  actionCard: { background: "#fff", borderRadius: 16, padding: 18, boxShadow: "0 10px 24px rgba(0,0,0,0.08)", display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: { display: 'flex', gap: '15px', alignItems: 'center' },
  iconBox: { backgroundColor: '#F1F3F5', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' },
  cardTitle: { fontSize: '18px', fontWeight: '800', margin: 0 },
  co2Text: { fontSize: '12px', color: '#4CAF50', fontWeight: '900' },
  switchBase: { width: '46px', height: '26px', borderRadius: '15px', padding: '3px', cursor: 'pointer', transition: '0.3s' },
  switchHandle: { width: '20px', height: '20px', backgroundColor: '#FFF', borderRadius: '50%', transition: '0.3s', boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }
};

export default ActionPage;