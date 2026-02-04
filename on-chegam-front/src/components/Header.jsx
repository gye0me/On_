export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.brand}>온(On): 체감</div>
      <div style={styles.right}>
        <div style={styles.bell} />
        <div style={styles.avatar} />
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: 56,
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
  },
  brand: {
    fontWeight: 800,
    fontSize: 18,
  },
  right: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  bell: {
    width: 22,
    height: 22,
    borderRadius: 6,
    background: "#eaecef",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#d7d9dd",
  },
};