import React from "react";

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

// Ported from the product's GiftBox — closed wrapped present / opened + sparkles.
export const GiftBox: React.FC<{ size?: number; variant?: "closed" | "open"; style?: React.CSSProperties }> = ({
  size = 200,
  variant = "closed",
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={style}>
    {variant === "open" ? (
      <>
        <path d={star(50, 13, 9, 2.6)} fill="#e8b23a" />
        <path d={star(21, 26, 6, 1.8)} fill="#1f5be0" />
        <path d={star(80, 28, 6.5, 1.9)} fill="#ff6a1f" />
        <path d={star(86, 56, 4.5, 1.4)} fill="#e8b23a" />
        <path d={star(14, 54, 4.5, 1.4)} fill="#15347e" />
        <path d="M26 52 H74 L80 62 H20 Z" fill="#b23c0a" />
        <path d="M20 62 H80 L84 92 H16 Z" fill="#ff6a1f" />
        <path d="M45 62 H55 L56 92 H44 Z" fill="#1f5be0" />
        <g transform="rotate(-14 50 41)">
          <rect x="16" y="35" width="68" height="15" rx="5" fill="#15347e" />
          <rect x="42" y="35" width="16" height="15" fill="#1f5be0" />
        </g>
      </>
    ) : (
      <>
        <rect x="22" y="46" width="56" height="40" rx="6" fill="#ff6a1f" />
        <rect x="16" y="34" width="68" height="15" rx="5" fill="#b23c0a" />
        <rect x="44" y="46" width="12" height="40" fill="#1f5be0" />
        <rect x="42" y="34" width="16" height="15" fill="#15347e" />
        <ellipse cx="40" cy="28" rx="11" ry="7" fill="#1f5be0" transform="rotate(-18 40 28)" />
        <ellipse cx="60" cy="28" rx="11" ry="7" fill="#1f5be0" transform="rotate(18 60 28)" />
        <circle cx="50" cy="31" r="5.5" fill="#15347e" />
      </>
    )}
  </svg>
);
