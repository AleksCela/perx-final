"use client";

import { useState } from "react";
import CountUp from "./CountUp";

export type StepEntry = {
  id: string;
  name: string;
  initials: string;
  color: string;
  dept: string;
  steps: number;
  isMe: boolean;
};

const GOAL = 70000; // weekly step goal
const MEDAL = ["#E8B23A", "#A7AEB8", "#C08457"]; // gold / silver / bronze
const SOURCES = [
  { name: "Apple Health", icon: "ti-heart" },
  { name: "Google Fit", icon: "ti-activity-heartbeat" },
  { name: "Fitbit", icon: "ti-run" },
];

export default function StepChallenge({ entries }: { entries: StepEntry[] }) {
  const [status, setStatus] = useState<"idle" | "connecting" | "connected">("idle");
  const connected = status === "connected";

  const top = entries[0]?.steps || 1;
  const myIndex = entries.findIndex((e) => e.isMe);
  const me = myIndex >= 0 ? entries[myIndex] : null;

  function connect() {
    if (status !== "idle") return;
    setStatus("connecting");
    setTimeout(() => setStatus("connected"), 1500);
  }

  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 10, flexWrap: "wrap" }}>
        <span className="kick">Step challenge · this week</span>
        <span className="pill" style={{ background: "rgba(255,106,31,.14)", color: "var(--orange-d)" }}>
          <i className="ti ti-trophy" /> Top walker wins +300 pts
        </span>
      </div>
      <div className="d" style={{ fontSize: 22, fontWeight: 700, marginBottom: 14 }}>
        Who racks up the most steps?
      </div>

      {/* Connect-your-health-app panel */}
      {!connected && (
        <div
          style={{
            background: "linear-gradient(135deg, var(--ink) 0%, #2c2616 100%)",
            color: "#FBF6EC",
            borderRadius: 16,
            padding: 18,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "var(--orange)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              flex: "none",
              animation: status === "connecting" ? "bob 1s ease-in-out infinite" : "none",
            }}
          >
            <i className={`ti ${status === "connecting" ? "ti-loader-2" : "ti-heart-rate-monitor"}`} />
          </span>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div className="d" style={{ fontSize: 18, fontWeight: 700 }}>Connect your health app</div>
            <div style={{ fontSize: 12.5, color: "rgba(251,246,236,.7)", marginTop: 2 }}>
              {status === "connecting" ? "Syncing your steps…" : "Sync steps to join this week's leaderboard."}
            </div>
            <div style={{ display: "flex", gap: 7, marginTop: 10, flexWrap: "wrap" }}>
              {SOURCES.map((s) => (
                <span key={s.name} className="pill" style={{ background: "rgba(255,255,255,.1)", color: "#FBF6EC" }}>
                  <i className={`ti ${s.icon}`} /> {s.name}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={connect}
            disabled={status === "connecting"}
            className="btn btn-orange"
            style={{ flex: "none" }}
          >
            {status === "connecting" ? "Connecting…" : <><i className="ti ti-plug-connected" /> Connect</>}
          </button>
        </div>
      )}

      {/* Synced summary */}
      {connected && me && (
        <div
          className="pop"
          style={{
            background: "rgba(31,91,224,.08)",
            border: "1px solid rgba(31,91,224,.2)",
            borderRadius: 14,
            padding: "12px 16px",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span className="pill" style={{ background: "var(--blue)", color: "#fff" }}>
            <i className="ti ti-circle-check" /> Synced
          </span>
          <span style={{ fontSize: 14 }}>
            You logged <b className="d"><CountUp value={me.steps} /></b> steps — that&apos;s rank{" "}
            <b>#{myIndex + 1}</b> of {entries.length}.
          </span>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>
            Goal {GOAL.toLocaleString("en-US")} · {Math.round((me.steps / GOAL) * 100)}%
          </span>
        </div>
      )}

      {/* Leaderboard */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 11,
          filter: connected ? "none" : "blur(4px)",
          opacity: connected ? 1 : 0.5,
          transition: "filter .4s ease, opacity .4s ease",
          pointerEvents: connected ? "auto" : "none",
        }}
      >
        {entries.map((e, i) => (
          <div
            key={e.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              padding: "8px 10px",
              borderRadius: 12,
              background: e.isMe ? "rgba(255,106,31,.1)" : "transparent",
              border: e.isMe ? "1px solid rgba(255,106,31,.35)" : "1px solid transparent",
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                flex: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: i < 3 ? "#fff" : "var(--muted)",
                background: i < 3 ? MEDAL[i] : "rgba(26,22,16,.07)",
              }}
            >
              {i + 1}
            </span>
            <span className="av" style={{ width: 30, height: 30, background: e.color, fontSize: 11 }}>{e.initials}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: e.isMe ? 700 : 500 }}>
                {e.name.split(" ")[0]} {e.name.split(" ")[1]?.[0]}.{e.isMe ? " (you)" : ""}
                <span style={{ color: "var(--muted)", fontWeight: 400 }}> · {e.dept}</span>
              </div>
              <div className="meter" style={{ height: 7, marginTop: 5 }}>
                <span style={{ width: `${Math.round((e.steps / top) * 100)}%`, background: i % 2 ? "var(--blue)" : "var(--orange)" }} />
              </div>
            </div>
            <span className="d tnum" style={{ fontSize: 14, fontWeight: 700, flex: "none" }}>
              {e.steps.toLocaleString("en-US")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
