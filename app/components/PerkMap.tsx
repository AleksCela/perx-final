"use client";

import { useState } from "react";
import Link from "next/link";
import { money } from "@/lib/money";

export type MapOffer = { id: string; title: string; price: number; icon: string; category: string };
export type MapSpot = {
  id: string;
  name: string;
  color: string;
  city: string;
  distanceKm: number | null;
  location: string;
  offers: MapOffer[];
};

// Deterministic angle (degrees) from an id, so a spot always sits in the same place.
function angleOf(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 360;
}
// Map a real distance to a radius (% of half the map). Near perks spread out; far
// ones are pushed toward the edge on a gentle sqrt scale.
function radiusOf(km: number): number {
  return Math.min(44, 7 + Math.sqrt(Math.max(km, 0.3)) * 6);
}

export default function PerkMap({ spots }: { spots: MapSpot[] }) {
  const placed = spots.filter((s) => s.distanceKm != null);
  const online = spots.filter((s) => s.distanceKm == null);
  const [selected, setSelected] = useState<string | null>(placed[0]?.id ?? null);

  const positions = new Map<string, { x: number; y: number }>();
  for (const s of placed) {
    const a = (angleOf(s.id) * Math.PI) / 180;
    const r = radiusOf(s.distanceKm as number);
    positions.set(s.id, { x: 50 + r * Math.cos(a), y: 50 + r * Math.sin(a) });
  }

  const sel = spots.find((s) => s.id === selected) ?? null;
  const selPos = sel ? positions.get(sel.id) : null;

  return (
    <div className="grid" style={{ gridTemplateColumns: "1.15fr .85fr", alignItems: "start" }}>
      {/* MAP */}
      <div className="card" style={{ padding: 0, overflow: "hidden", position: "relative", aspectRatio: "1 / 1" }}>
        {/* stylised city background */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <rect width="100" height="100" fill="#eef3ea" />
          {/* parks */}
          <ellipse cx="22" cy="28" rx="13" ry="10" fill="#dcebd2" />
          <ellipse cx="78" cy="74" rx="16" ry="12" fill="#dcebd2" />
          {/* river */}
          <path d="M-5 64 C 25 56, 40 80, 65 70 S 95 58, 110 66 L110 78 L-5 80 Z" fill="#cfe3f2" />
          {/* roads */}
          {[18, 38, 58, 78].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#e3dccb" strokeWidth="2.4" />
          ))}
          {[20, 44, 68, 88].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" stroke="#e3dccb" strokeWidth="2.4" />
          ))}
          <line x1="0" y1="6" x2="100" y2="40" stroke="#e3dccb" strokeWidth="3" />
          {/* distance rings */}
          {[20, 32, 44].map((r) => (
            <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="rgba(26,22,16,.14)" strokeDasharray="1.4 2.4" strokeWidth="0.4" />
          ))}
        </svg>

        {/* you-are-here */}
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--blue)", border: "3px solid #fff", boxShadow: "0 0 0 6px rgba(31,91,224,.18)", margin: "0 auto" }} />
          <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--blue-d)", marginTop: 3, background: "rgba(255,255,255,.7)", borderRadius: 6, padding: "1px 5px" }}>You</div>
        </div>

        {/* pins */}
        {placed.map((s) => {
          const p = positions.get(s.id)!;
          const active = selected === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              title={s.name}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: `translate(-50%,-100%) scale(${active ? 1.18 : 1})`,
                zIndex: active ? 6 : 3,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50% 50% 50% 2px",
                  transform: "rotate(45deg)",
                  background: s.color,
                  border: "2px solid #fff",
                  boxShadow: active ? "0 8px 18px -4px rgba(0,0,0,.5)" : "0 4px 10px -3px rgba(0,0,0,.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className={`ti ${s.offers[0]?.icon ?? "ti-map-pin"}`} style={{ transform: "rotate(-45deg)", color: "#fff", fontSize: 16 }} />
              </div>
            </button>
          );
        })}

        {/* selected popup */}
        {sel && selPos && sel.distanceKm != null && (
          <div
            style={{
              position: "absolute",
              left: `${Math.min(72, Math.max(4, selPos.x - 14))}%`,
              top: `${Math.min(74, Math.max(2, selPos.y - 30))}%`,
              width: 200,
              zIndex: 8,
              background: "#fffdf8",
              border: "1px solid var(--line)",
              borderRadius: 12,
              padding: 11,
              boxShadow: "0 16px 36px -12px rgba(26,22,16,.45)",
            }}
          >
            <div className="d" style={{ fontSize: 14.5, fontWeight: 700 }}>{sel.name}</div>
            <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 7 }}>
              {sel.location || sel.city} · {sel.distanceKm}km away
            </div>
            <div style={{ fontSize: 12, display: "flex", justifyContent: "space-between", gap: 6 }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sel.offers[0]?.title}</span>
              <b className="d">{money(sel.offers[0]?.price ?? 0)}</b>
            </div>
            <Link href={`/offer/${sel.offers[0]?.id}`} className="btn btn-ink" style={{ width: "100%", marginTop: 9, padding: "8px 0", fontSize: 13 }}>
              View perk
            </Link>
          </div>
        )}

        <div className="pill" style={{ position: "absolute", left: 12, top: 12, background: "rgba(255,253,248,.9)", color: "var(--ink)" }}>
          <i className="ti ti-map-pin" style={{ color: "var(--orange)" }} /> Perks near you · Tirana
        </div>
      </div>

      {/* SIDEBAR — nearest list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <div className="section-label" style={{ margin: "2px 0 2px 4px" }}>Nearest to you</div>
        {placed.map((s) => {
          const active = selected === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              className="card hover-lift"
              style={{
                textAlign: "left",
                padding: 12,
                display: "flex",
                alignItems: "center",
                gap: 11,
                cursor: "pointer",
                border: active ? "1px solid var(--orange)" : "1px solid var(--line)",
                background: active ? "rgba(255,106,31,.07)" : "#fffdf8",
                fontFamily: "inherit",
              }}
            >
              <span style={{ width: 38, height: 38, borderRadius: 11, background: s.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                <i className={`ti ${s.offers[0]?.icon ?? "ti-map-pin"}`} style={{ fontSize: 18 }} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="d" style={{ fontSize: 15, fontWeight: 700 }}>{s.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {s.offers.length} perk{s.offers.length === 1 ? "" : "s"} · from {money(Math.min(...s.offers.map((o) => o.price)))}
                </div>
              </div>
              <span className="pill" style={{ background: "rgba(31,91,224,.12)", color: "var(--blue-d)", flex: "none" }}>
                <i className="ti ti-map-pin" /> {s.distanceKm}km
              </span>
            </button>
          );
        })}
        {online.length > 0 && (
          <>
            <div className="section-label" style={{ margin: "8px 0 2px 4px" }}>Available anywhere</div>
            {online.map((s) => (
              <Link key={s.id} href={`/offer/${s.offers[0]?.id}`} className="card hover-lift" style={{ padding: 12, display: "flex", alignItems: "center", gap: 11 }}>
                <span style={{ width: 38, height: 38, borderRadius: 11, background: s.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                  <i className={`ti ${s.offers[0]?.icon ?? "ti-world"}`} style={{ fontSize: 18 }} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="d" style={{ fontSize: 15, fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--muted)" }}>Online · {s.offers.length} perk{s.offers.length === 1 ? "" : "s"}</div>
                </div>
                <i className="ti ti-world" style={{ color: "var(--muted)" }} />
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
