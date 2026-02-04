import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function formatMD(date = new Date()) {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${m}/${d}`;
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

export default function Home() {
  const todayMD = useMemo(() => formatMD(new Date()), []);

  const [data, setData] = useState({ processedData: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [locationName, setLocationName] = useState("확인 중...");

  const fetchWeather = async (lat, lon) => {
    const res = await axios.get("http://localhost:8001/api/weather", {
      params: { lat, lon },
    });
    setData(res.data ?? { processedData: [] });
  };

  const reverseGeocode = async (lat, lon) => {
    const res = await axios.get("http://localhost:8001/api/geocode/reverse", {
      params: { lat, lon },
    });
    setLocationName(res.data?.name || "지역명을 가져오지 못했습니다.");
  };

  const loadByLatLon = async (lat, lon, fallbackLabel = null) => {
    setLoading(true);
    setError("");
    if (fallbackLabel) setLocationName(fallbackLabel);

    try {
      await Promise.all([reverseGeocode(lat, lon), fetchWeather(lat, lon)]);
    } catch (e) {
      console.error(e);
      setError("데이터를 불러오지 못했습니다.");
      setData({ processedData: [] });
      if (!fallbackLabel) setLocationName("지역명을 가져오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const askLocation = () => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보를 사용할 수 없습니다. 기본 위치(서울)로 표시합니다.");
      loadByLatLon(37.5665, 126.9780, "서울특별시(기본)");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        loadByLatLon(position.coords.latitude, position.coords.longitude);
      },
      () => {
        alert("위치 정보 활용 승인이 거절되었습니다. 기본 위치(서울)로 표시합니다.");
        loadByLatLon(37.5665, 126.9780, "서울특별시(기본)");
      }
    );
  };

  useEffect(() => {
    askLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div style={{ padding: 8 }}>Loading...</div>;

  const processed = Array.isArray(data?.processedData) ? data.processedData : [];
  const sorted = [...processed].sort((a, b) => a.year - b.year);

  const noData = sorted.length === 0;

  const first = sorted[0] ?? null; // “5년 전”
  const last = sorted[sorted.length - 1] ?? null; // “현재”
  const todayTemp = last?.temp != null ? Number(last.temp) : null;
  const prevTemp = first?.temp != null ? Number(first.temp) : null;
  const diff = todayTemp != null && prevTemp != null ? todayTemp - prevTemp : null;

  const avg =
    sorted.length > 0
      ? sorted.reduce((sum, d) => sum + Number(d.temp), 0) / sorted.length
      : null;

  const chartData = {
    labels: sorted.map((d) => d.year),
    datasets: [
      {
        label: "오늘 날짜 기온 (°C)",
        data: sorted.map((d) => Number(d.temp)),
        backgroundColor: "rgba(122, 92, 166, 0.75)",
        borderRadius: 10,
        barThickness: 16,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => `${ctx.raw}°C` } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#777" } },
      y: {
        grid: { color: "rgba(0,0,0,0.06)" },
        ticks: { display: false },
        border: { display: false },
      },
    },
  };

  return (
    <div style={styles.page}>
      {/* 상단 인사 카드 */}
      <div style={styles.heroCard}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={styles.heroTitle}>사용자님,</div>

            <div style={styles.heroText}>
              오늘 기온은{" "}
              <span style={styles.heroStrong}>
                {todayTemp == null ? "-" : `${round1(todayTemp)}°C`}
              </span>
            </div>

            <div style={styles.heroText}>
              5년 전보다{" "}
              <span
                style={
                  diff == null
                    ? styles.heroStrong
                    : {
                        ...styles.heroStrong,
                        color: diff >= 0 ? "#ff4d4f" : "#1677ff",
                      }
                }
              >
                {diff == null ? "-" : `${round1(Math.abs(diff))}°C`}
              </span>{" "}
              {diff == null ? "" : diff >= 0 ? "높습니다" : "낮습니다"}
            </div>

            <div style={styles.subText}>({todayMD} 기준 · {locationName})</div>
            {error && <div style={styles.error}>⚠️ {error}</div>}
          </div>

          <div style={styles.sunWrap}>
            <div style={styles.sun} />
          </div>
        </div>
      </div>

      {/* 차트 카드 */}
      <div style={styles.chartCard}>
        <div style={styles.chartTitle}>5년간 기온 변화 추이</div>
        <div style={styles.locationLabel}>{locationName}</div>

        {noData ? (
          <>
            <p style={{ marginTop: 10 }}>⚠️ 오늘({todayMD}) 날짜 데이터가 없습니다.</p>
            <p style={{ marginTop: 4, color: "#666" }}>
              Tip: weather.js를 실행해서 데이터를 먼저 수집해 주세요!
            </p>
          </>
        ) : (
          <>
            <div style={{ height: 240, marginTop: 10 }}>
              <Bar data={chartData} options={chartOptions} />
            </div>

            <div style={styles.summaryRow}>
              <div style={{ ...styles.summaryChip, background: "#DFF2DF" }}>
                <div style={styles.summaryTop}>{first?.year ?? "-"}년</div>
                <div style={styles.summaryBottom}>
                  {prevTemp == null ? "-" : `${round1(prevTemp)}°C`}
                </div>
              </div>

              <div style={{ ...styles.summaryChip, background: "#FFF1D9" }}>
                <div style={styles.summaryTop}>5년 평균</div>
                <div style={styles.summaryBottom}>
                  {avg == null ? "-" : `${round1(avg)}°C`}
                </div>
              </div>

              <div style={{ ...styles.summaryChip, background: "#FFE3D9" }}>
                <div style={styles.summaryTop}>{last?.year ?? "-"}년</div>
                <div style={styles.summaryBottom}>
                  {todayTemp == null ? "-" : `${round1(todayTemp)}°C`}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <button onClick={askLocation} style={styles.refreshBtn}>
        위치 다시 요청/갱신
      </button>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  heroCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
  },
  heroTitle: { fontSize: 26, fontWeight: 800, marginBottom: 6 },
  heroText: { fontSize: 22, fontWeight: 700, lineHeight: 1.25 },
  heroStrong: { fontWeight: 900 },
  subText: { marginTop: 8, color: "#666", fontSize: 13 },
  error: { marginTop: 8, color: "#d4380d", fontSize: 13 },

  sunWrap: { width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center" },
  sun: {
    width: 58,
    height: 58,
    borderRadius: "50%",
    background: "radial-gradient(circle at 30% 30%, #FFECA6 0%, #FFC83D 45%, #FFB300 100%)",
    boxShadow: "0 10px 22px rgba(255, 179, 0, 0.35)",
  },

  chartCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
  },
  chartTitle: { fontSize: 20, fontWeight: 800 },
  locationLabel: { marginTop: 8, color: "#666", fontWeight: 600 },

  summaryRow: {
    marginTop: 14,
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 10,
  },
  summaryChip: {
    borderRadius: 14,
    padding: 12,
    textAlign: "center",
  },
  summaryTop: { fontSize: 13, color: "#666", fontWeight: 800 },
  summaryBottom: { marginTop: 6, fontSize: 20, fontWeight: 900 },

  refreshBtn: {
    width: "100%",
    height: 44,
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "#fff",
    fontWeight: 800,
  },
};