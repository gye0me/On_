import { Routes, Route, NavLink } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Outfit from "./pages/Outfit";
import Action from "./pages/Action";
import Login from "./pages/Login";

function TabLink({ to, label }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...styles.tabItem,
        ...(isActive ? styles.tabActive : null),
      })}
    >
      {label}
    </NavLink>
  );
}

function App() {
  return (
    <div style={styles.appShell}>
      <Header />

      <main style={styles.main}>
        <div style={styles.pageContainer}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/outfit" element={<Outfit />} />
            <Route path="/action" element={<Action />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </main>

      <nav style={styles.tabBar}>
        <TabLink to="/" label="홈" />
        <TabLink to="/outfit" label="옷차림" />
        <TabLink to="/action" label="Action" />
        <TabLink to="/login" label="마이페이지" />
      </nav>
    </div>
  );
}

export default App;

const styles = {
  appShell: {
    minHeight: "100vh",
    background: "#f5f6f7",
    display: "flex",
    flexDirection: "column",
  },

  main: {
    flex: 1,
    padding: "12px 16px 76px", // 하단 탭바 높이만큼 bottom padding
  },

  pageContainer: {
    maxWidth: 520,
    width: "100%",
    margin: "0 auto",
  },

  tabBar: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    background: "#fff",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    alignItems: "center",
    boxShadow: "0 -1px 0 rgba(0,0,0,0.08)",
    paddingBottom: "env(safe-area-inset-bottom)", // iOS 대응
    zIndex: 50,
  },

  tabItem: {
    textDecoration: "none",
    color: "#222",
    fontWeight: 700,
    textAlign: "center",
    height: 44,
    margin: "0 10px",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  tabActive: {
    background: "#DFF2DF",
  },
};