const SkeletonCard = () => (
  <div className="animate-pulse" style={{
    backgroundColor: "white", borderRadius: 14,
    border: "1px solid #ede9fe", padding: "20px 24px",
    display: "flex", flexDirection: "column", gap: 12,
  }}>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ width: 60, height: 14, backgroundColor: "#e5e7eb", borderRadius: 6 }} />
      <div style={{ width: 140, height: 32, backgroundColor: "#e5e7eb", borderRadius: 8 }} />
    </div>
    <div style={{ height: 1, backgroundColor: "#f3f4f6" }} />
    <div style={{ width: "60%", height: 18, backgroundColor: "#e5e7eb", borderRadius: 6 }} />
    <div style={{ width: "100%", height: 14, backgroundColor: "#e5e7eb", borderRadius: 6 }} />
    <div style={{ width: "80%",  height: 14, backgroundColor: "#e5e7eb", borderRadius: 6 }} />
  </div>
);

export default SkeletonCard;
