export type BadgeItem = { slug: string; name: string; icon: string; description?: string };

export default function BadgeWall({
  badges,
  earned,
  columns = 8,
}: {
  badges: BadgeItem[];
  earned: Set<string>;
  columns?: number;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 9 }}>
      {badges.map((b, i) => {
        const has = earned.has(b.slug);
        return (
          <div
            key={b.slug}
            title={b.description || b.name}
            style={{
              aspectRatio: "1",
              borderRadius: 14,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              fontSize: 9.5,
              textAlign: "center",
              padding: 5,
              background: has ? (i % 2 ? "var(--blue)" : "var(--orange)") : "#EDE4D2",
              color: has ? "#fff" : "var(--muted)",
            }}
          >
            <i className={`ti ${has ? b.icon : "ti-lock"}`} style={{ fontSize: 20 }} />
            {b.name}
          </div>
        );
      })}
    </div>
  );
}
