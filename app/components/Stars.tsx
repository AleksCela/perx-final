export default function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.round(rating);
  return (
    <span style={{ color: "var(--orange)", fontSize: size, letterSpacing: 1 }} aria-label={`${rating} out of 5`}>
      {"★★★★★".split("").map((s, i) => (
        <span key={i} style={{ color: i < full ? "var(--orange)" : "rgba(26,22,16,.2)" }}>
          ★
        </span>
      ))}
    </span>
  );
}
