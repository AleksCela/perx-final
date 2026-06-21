import React from "react";
import { C, display } from "../theme";

export const WHEEL_PRIZES = [120, 80, 200, 40, 60, 300];
const SEG = 360 / WHEEL_PRIZES.length;
const COLORS = [C.orange, C.blue, C.ink, C.gold, C.blueD, C.orangeD];
const TEXT_ON = ["#fff", "#fff", "#fff", C.ink, "#fff", "#fff"];

function pt(r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [100 + r * Math.cos(a), 100 + r * Math.sin(a)];
}
function slicePath(i: number): string {
  const [x0, y0] = pt(96, i * SEG);
  const [x1, y1] = pt(96, (i + 1) * SEG);
  return `M100 100 L${x0.toFixed(2)} ${y0.toFixed(2)} A96 96 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

// Frame-driven version of the product's spin wheel: the scene passes a rotation.
export const Wheel: React.FC<{
  size: number;
  rotation: number;
  centerTop: string;
  centerSub: string;
}> = ({ size, rotation, centerTop, centerSub }) => (
  <div style={{ position: "relative", width: size, height: size }}>
    <div
      style={{
        position: "absolute",
        top: -4,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2,
        width: 0,
        height: 0,
        borderLeft: "16px solid transparent",
        borderRight: "16px solid transparent",
        borderTop: `24px solid ${C.ink}`,
        filter: "drop-shadow(0 2px 2px rgba(0,0,0,.3))",
      }}
    />
    <svg viewBox="0 0 200 200" width={size} height={size} style={{ filter: "drop-shadow(0 14px 30px rgba(26,22,16,.3))" }}>
      <circle cx="100" cy="100" r="99" fill="#fffdf8" />
      <g style={{ transformBox: "fill-box", transformOrigin: "center", transform: `rotate(${rotation}deg)` }}>
        {WHEEL_PRIZES.map((p, i) => {
          const [lx, ly] = pt(62, i * SEG + SEG / 2);
          return (
            <g key={i}>
              <path d={slicePath(i)} fill={COLORS[i]} stroke="#fffdf8" strokeWidth={2} />
              <text
                x={lx}
                y={ly}
                fill={TEXT_ON[i]}
                fontSize="20"
                fontWeight="800"
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily={display}
              >
                +{p}
              </text>
            </g>
          );
        })}
      </g>
      <circle cx="100" cy="100" r="31" fill="#fffdf8" stroke="rgba(26,22,16,.12)" />
    </svg>
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <span style={{ fontFamily: display, fontSize: size * 0.11, fontWeight: 800, color: C.orange, lineHeight: 1 }}>
        {centerTop}
      </span>
      <span style={{ fontSize: size * 0.045, color: C.muted, letterSpacing: ".12em" }}>{centerSub}</span>
    </div>
  </div>
);
