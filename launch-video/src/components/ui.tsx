import React from "react";
import { C, body, display } from "../theme";
import { Icon } from "./Icon";

export const Pill: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, bg = "rgba(26,22,16,.06)", color = C.muted, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 16px",
      borderRadius: 999,
      fontSize: 17,
      fontWeight: 600,
      lineHeight: 1,
      fontFamily: body,
      background: bg,
      color,
      ...style,
    }}
  >
    {children}
  </span>
);

export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: C.card,
      border: `1px solid ${C.line}`,
      borderRadius: 22,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Meter: React.FC<{ pct: number; color: string; height?: number }> = ({
  pct,
  color,
  height = 12,
}) => (
  <div style={{ height, background: "#ede4d2", borderRadius: 9, overflow: "hidden" }}>
    <div style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height: "100%", background: color, borderRadius: 9 }} />
  </div>
);

export const Avatar: React.FC<{ initials: string; color: string; size?: number }> = ({
  initials,
  color,
  size = 40,
}) => (
  <span
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      color: "#fff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: size * 0.36,
      fontFamily: body,
      flex: "none",
    }}
  >
    {initials}
  </span>
);

export const Stars: React.FC<{ rating: number; size?: number }> = ({ rating, size = 18 }) => (
  <span style={{ display: "inline-flex", gap: 2 }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <Icon key={i} name="star" size={size} fill color={i < Math.round(rating) ? C.orange : "rgba(26,22,16,.18)"} />
    ))}
  </span>
);

export const PX: React.FC<{ amount: number; style?: React.CSSProperties }> = ({ amount, style }) => (
  <span style={{ fontFamily: display, fontWeight: 700, ...style }}>
    {Math.round(amount).toLocaleString("en-US")} PX
  </span>
);
