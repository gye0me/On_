import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, Calendar, Leaf, Award, User } from 'lucide-react';

// 포트가 다른 서버 간 쿠키(로그인 세션) 공유 설정
axios.defaults.withCredentials = true;

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    totalReduction: 0,
    missionCount: 0,
    days: 0,
    level: 1
  });
  const [loading, setLoading] = useState(true);

  const fetchMyData = async () => {
    try {
      const [userRes, actionRes] = await Promise.all([
        axios.get('http://localhost:8001/auth/me'),
        axios.get('http://localhost:8001/action')
      ]);

      const userData = userRes.data;
      const actions = Array.isArray(actionRes.data) ? actionRes.data : [];

      const totalReduction = actions.reduce((acc, cur) => acc + Number(cur.reduction || 0), 0);
      const practiceDays = userData.days || Math.ceil(actions.length / 3) || 1; 
      const calculatedLevel = Math.floor(totalReduction / 10) + 1;

      setUserInfo(userData);
      setStats({
        totalReduction: totalReduction,
        missionCount: actions.length,
        days: practiceDays,
        level: userData.level || calculatedLevel 
      });
    } catch (err) {
      console.error("데이터 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyData();
    window.addEventListener('focus', fetchMyData);
    return () => window.removeEventListener('focus', fetchMyData);
  }, []);

  if (loading) return <div style={styles.loading}>정보를 불러오는 중...</div>;

  return (
    <div style={styles.container}>
      {/* 상단 헤더(Header) 부분을 완전히 삭제했습니다 */}
      
      <main style={styles.content}>
        {/* 프로필 카드 영역 */}
        <section style={styles.profileCard}>
          <div style={styles.avatarWrapper}>
            <div style={styles.avatar}>
              <User size={40} color="#FFF" />
            </div>
            <div style={styles.levelBadge}>Lv.{stats.level}</div>
          </div>
          <div style={styles.userInfo}>
            <div style={styles.userNameRow}>
              <span style={styles.userName}>{userInfo?.nick || '사용자'}</span>
              <button style={styles.settingsBtn}>
                <Settings size={14} /> 설정
              </button>
            </div>
            <div style={styles.userEmail}>{userInfo?.email || 'user@gmail.com'}</div>
          </div>
        </section>

        {/* 통계 리스트 영역 */}
        <section style={styles.statsContainer}>
          <div style={styles.statItem}>
            <div style={{ ...styles.iconCircle, backgroundColor: '#EEF2FF' }}>
              <Calendar size={20} color="#6366F1" />
            </div>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>실천 일수</div>
              <div style={styles.statValue}>{stats.days}일</div>
            </div>
          </div>
          
          <div style={styles.divider}></div>

          <div style={styles.statItem}>
            <div style={{ ...styles.iconCircle, backgroundColor: '#ECFDF5' }}>
              <Leaf size={20} color="#10B981" />
            </div>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>탄소 절감량</div>
              <div style={styles.statValue}>{stats.totalReduction.toFixed(1)}kg</div>
            </div>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.statItem}>
            <div style={{ ...styles.iconCircle, backgroundColor: '#FFFBEB' }}>
              <Award size={20} color="#F59E0B" />
            </div>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>레벨</div>
              <div style={styles.statValue}>Lv.{stats.level}</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Pretendard, sans-serif' },
  content: { padding: '30px 16px', flex: 1 }, // 상단 여백을 살짝 늘려 안정감을 주었습니다.
  profileCard: { backgroundColor: '#FFF', borderRadius: '24px', padding: '24px', display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
  avatarWrapper: { position: 'relative' },
  avatar: { width: '72px', height: '72px', backgroundColor: '#6DC4A4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  levelBadge: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#F59E0B', color: '#FFF', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', border: '2px solid #FFF' },
  userNameRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  userName: { fontSize: '22px', fontWeight: '800', color: '#333' },
  settingsBtn: { border: '1px solid #E5E7EB', backgroundColor: '#FFF', borderRadius: '8px', fontSize: '12px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px', color: '#6B7280', cursor: 'pointer' },
  userEmail: { fontSize: '14px', color: '#9CA3AF', marginTop: '2px' },
  statsContainer: { backgroundColor: '#FFF', borderRadius: '24px', padding: '8px 0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
  statItem: { display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px' },
  iconCircle: { width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statLabel: { fontSize: '17px', fontWeight: '700', color: '#374151' },
  statValue: { fontSize: '16px', color: '#6B7280', marginTop: '2px' },
  divider: { height: '1px', backgroundColor: '#F1F3F5', margin: '0 24px', border: 'none' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '16px', color: '#666' }
};

export default MyPage;