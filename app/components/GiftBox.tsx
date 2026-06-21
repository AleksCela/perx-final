// A hand-drawn gift box in the Perx palette — used instead of the 🎁/🎉 emoji
// so the mystery box renders consistently across platforms. Pure SVG, no hooks,
// so it works in both server and client components.

function star(cx: number, cy: number, R: number, r: number): string {
  return [
    `M${cx} ${cy - R}`,
    `L${cx + r} ${cy - r}`,
    `L${cx + R} ${cy}`,
    `L${cx + r} ${cy + r}`,
    `L${cx} ${cy + R}`,
    `L${cx - r} ${cy + r}`,
    `L${cx - R} ${cy}`,
    `L${cx - r} ${cy - r}`,
    "Z",
  ].join(" ");
}

export default function GiftBox({
  size = 96,
  variant = "closed",
  style,
  className,
}: {
  size?: number;
  variant?: "closed" | "open";
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      style={style}
      role="img"
      aria-label={variant === "open" ? "Opened gift" : "Gift box"}
    >
      {variant === "open" ? (
        <>
          {/* celebratory sparkles */}
          <path d={star(50, 13, 9, 2.6)} fill="#E8B23A" />
          <path d={star(21, 26, 6, 1.8)} fill="#1F5BE0" />
          <path d={star(80, 28, 6.5, 1.9)} fill="#FF6A1F" />
          <path d={star(86, 56, 4.5, 1.4)} fill="#E8B23A" />
          <path d={star(14, 54, 4.5, 1.4)} fill="#15347E" />

          {/* open box: back rim + front face */}
          <path d="M26 52 H74 L80 62 H20 Z" fill="#B23C0A" />
          <path d="M20 62 H80 L84 92 H16 Z" fill="#FF6A1F" />
          {/* ribbon on the front face */}
          <path d="M45 62 H55 L56 92 H44 Z" fill="#1F5BE0" />

          {/* lid popped off and tilted */}
          <g transform="rotate(-14 50 41)">
            <rect x="16" y="35" width="68" height="15" rx="5" fill="#15347E" />
            <rect x="42" y="35" width="16" height="15" fill="#1F5BE0" />
          </g>
        </>
      ) : (
        <>
          {/* box body */}
          <rect x="22" y="46" width="56" height="40" rx="6" fill="#FF6A1F" />
          {/* lid */}
          <rect x="16" y="34" width="68" height="15" rx="5" fill="#B23C0A" />
          {/* vertical ribbon */}
          <rect x="44" y="46" width="12" height="40" fill="#1F5BE0" />
          <rect x="42" y="34" width="16" height="15" fill="#15347E" />
          {/* bow */}
          <ellipse cx="40" cy="28" rx="11" ry="7" fill="#1F5BE0" transform="rotate(-18 40 28)" />
          <ellipse cx="60" cy="28" rx="11" ry="7" fill="#1F5BE0" transform="rotate(18 60 28)" />
          <circle cx="50" cy="31" r="5.5" fill="#15347E" />
        </>
      )}
    </svg>
  );
}
