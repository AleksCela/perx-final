import React from "react";
import { C, display, body } from "../theme";
import { Icon } from "./Icon";
import { Avatar } from "./ui";

const LINKS = ["Discover", "Planner", "Drops", "Play", "Wallet"];

// A slim recreation of the product's top navigation for scene continuity.
export const AppTopNav: React.FC<{ active?: string; px?: number; points?: number; wallet?: boolean }> = ({
  active = "Discover",
  px = 600,
  points = 2140,
  wallet = true,
}) => (
  <div
    style={{
      height: 64,
      flex: "none",
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "0 26px",
      background: "rgba(255,253,248,.7)",
      borderBottom: `1px solid ${C.line}`,
    }}
  >
    <div style={{ fontFamily: display, fontSize: 28, fontWeight: 800, marginRight: 14, color: C.ink }}>
      perx<span style={{ color: C.orange }}>.</span>
    </div>
    {LINKS.map((l) => (
      <div
        key={l}
        style={{
          fontFamily: body,
          fontSize: 17,
          fontWeight: 600,
          color: l === active ? C.ink : C.muted,
          background: l === active ? "rgba(26,22,16,.07)" : "transparent",
          padding: "8px 15px",
          borderRadius: 999,
        }}
      >
        {l}
      </div>
    ))}
    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
      {wallet && (
        <>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 15px",
              borderRadius: 999,
              background: "rgba(31,91,224,.12)",
              color: C.blueD,
              fontFamily: body,
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            <Icon name="bolt" size={17} fill color={C.blue} /> {points.toLocaleString("en-US")}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 15px",
              borderRadius: 999,
              background: C.orange,
              color: "#fff",
              fontFamily: body,
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            <Icon name="ticket" size={17} color="#fff" /> {px.toLocaleString("en-US")} PX
          </span>
        </>
      )}
      <Avatar initials="KK" color={C.blue} size={38} />
    </div>
  </div>
);
