import React from "react";
import { C, body } from "../theme";

// A clean browser window the product UI lives inside, to read as a real app.
export const BrowserFrame: React.FC<{
  children: React.ReactNode;
  url?: string;
  width: number;
  height: number;
  style?: React.CSSProperties;
}> = ({ children, url = "app.perx.com", width, height, style }) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 22,
        overflow: "hidden",
        background: C.paper,
        boxShadow:
          "0 60px 120px -30px rgba(0,0,0,.65), 0 0 0 1px rgba(255,255,255,.06)",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {/* title bar */}
      <div
        style={{
          height: 52,
          flex: "none",
          background: "#efe7d7",
          borderBottom: `1px solid ${C.line}`,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", gap: 9 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div
          style={{
            marginLeft: 14,
            flex: 1,
            maxWidth: 460,
            height: 30,
            borderRadius: 999,
            background: "#fffdf8",
            border: `1px solid ${C.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontFamily: body,
            fontSize: 15,
            color: C.muted,
          }}
        >
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#28c840" }} />
          {url}
        </div>
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{children}</div>
    </div>
  );
};
