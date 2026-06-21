"use client";

// Lightweight, temporary World Cup 2026 prediction game. Demo only: picks live
// in localStorage, nothing hits the server. Flags are real images from flagcdn.

import { useEffect, useState } from "react";

type Team = { code: string; name: string };
type Fixture = { id: string; a: Team; b: Team };

const TEAMS: Record<string, Team> = {
  ar: { code: "ar", name: "Argentina" },
  mx: { code: "mx", name: "Mexico" },
  fr: { code: "fr", name: "France" },
  us: { code: "us", name: "USA" },
  br: { code: "br", name: "Brazil" },
  ca: { code: "ca", name: "Canada" },
  "gb-eng": { code: "gb-eng", name: "England" },
  es: { code: "es", name: "Spain" },
  pt: { code: "pt", name: "Portugal" },
  nl: { code: "nl", name: "Netherlands" },
  de: { code: "de", name: "Germany" },
  hr: { code: "hr", name: "Croatia" },
};

const FIXTURES: Fixture[] = [
  { id: "m1", a: TEAMS.ar, b: TEAMS.mx },
  { id: "m2", a: TEAMS.fr, b: TEAMS.us },
  { id: "m3", a: TEAMS.br, b: TEAMS.ca },
  { id: "m4", a: TEAMS["gb-eng"], b: TEAMS.es },
  { id: "m5", a: TEAMS.pt, b: TEAMS.nl },
  { id: "m6", a: TEAMS.de, b: TEAMS.hr },
];

const flag = (code: string, w = 80) => `https://flagcdn.com/w${w}/${code}.png`;

export default function WorldCup() {
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [champ, setChamp] = useState("");
  const [locked, setLocked] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("wc26-picks") || "{}");
      if (raw && typeof raw === "object") setPicks(raw);
      setChamp(localStorage.getItem("wc26-champ") || "");
      setLocked(localStorage.getItem("wc26-locked") === "1");
    } catch {
      /* ignore malformed storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("wc26-picks", JSON.stringify(picks));
  }, [picks, loaded]);
  useEffect(() => {
    if (loaded) localStorage.setItem("wc26-champ", champ);
  }, [champ, loaded]);

  function pick(fid: string, code: string) {
    if (locked) return;
    setPicks((p) => ({ ...p, [fid]: code }));
  }
  function lock() {
    if (!champ || Object.keys(picks).length < FIXTURES.length) return;
    setLocked(true);
    localStorage.setItem("wc26-locked", "1");
  }
  function reset() {
    setPicks({});
    setChamp("");
    setLocked(false);
    localStorage.setItem("wc26-locked", "0");
  }

  const made = Object.keys(picks).length;
  const ready = made === FIXTURES.length && !!champ;

  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
        <span className="kick">
          <i className="ti ti-ball-football" style={{ color: "var(--orange)" }} /> World Cup 2026 · predictor
        </span>
        <span className="pill" style={{ background: "rgba(26,22,16,.06)", color: "var(--muted)" }}>Demo · temporary</span>
      </div>
      <div className="d" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Call the knockouts</div>
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
        {locked ? "Your bracket is locked in — good luck!" : `Tap a winner for each tie (${made}/${FIXTURES.length}), then pick your champion.`}
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {FIXTURES.map((f) => {
          const sel = picks[f.id];
          return (
            <div key={f.id} className="card" style={{ padding: 8, display: "flex", alignItems: "center", gap: 6, background: "#fffdf8" }}>
              {[f.a, f.b].map((t, idx) => {
                const active = sel === t.code;
                return (
                  <button
                    key={t.code}
                    onClick={() => pick(f.id, t.code)}
                    disabled={locked}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 5,
                      padding: "9px 4px",
                      borderRadius: 11,
                      cursor: locked ? "default" : "pointer",
                      border: active ? "2px solid var(--orange)" : "2px solid transparent",
                      background: active ? "rgba(255,106,31,.12)" : "transparent",
                      opacity: sel && !active ? 0.5 : 1,
                      transition: "all .15s ease",
                      order: idx === 0 ? 0 : 2,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={flag(t.code)}
                      alt={t.name}
                      width={40}
                      height={27}
                      style={{ borderRadius: 4, objectFit: "cover", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }}
                    />
                    <span style={{ fontSize: 11.5, fontWeight: active ? 700 : 500, textAlign: "center", lineHeight: 1.1 }}>{t.name}</span>
                  </button>
                );
              })}
              <span style={{ order: 1, fontSize: 10, fontWeight: 700, color: "var(--muted)", flex: "none" }}>VS</span>
            </div>
          );
        })}
      </div>

      {/* champion + lock */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="kick" style={{ color: "var(--blue-d)" }}>
            <i className="ti ti-trophy" style={{ color: "#E8B23A" }} /> Champion
          </span>
          {champ && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={flag(champ, 40)} alt="" width={28} height={19} style={{ borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,.2)" }} />
          )}
          <select
            value={champ}
            onChange={(e) => setChamp(e.target.value)}
            disabled={locked}
            className="input"
            style={{ width: "auto", padding: "8px 12px" }}
          >
            <option value="" disabled>Pick a winner…</option>
            {Object.values(TEAMS).map((t) => (
              <option key={t.code} value={t.code}>{t.name}</option>
            ))}
          </select>
        </div>
        {locked ? (
          <button onClick={reset} className="btn btn-ghost" style={{ marginLeft: "auto" }}>
            <i className="ti ti-refresh" /> Redo bracket
          </button>
        ) : (
          <button onClick={lock} disabled={!ready} className="btn btn-ink" style={{ marginLeft: "auto" }}>
            <i className="ti ti-lock" /> Lock in predictions
          </button>
        )}
      </div>

      {locked && (
        <div className="pop" style={{ marginTop: 12, fontSize: 12.5, color: "var(--blue-d)", display: "flex", alignItems: "center", gap: 7 }}>
          <i className="ti ti-confetti" /> Locked {made} picks · champion: <b>{TEAMS[champ]?.name ?? "—"}</b>. Come back after matchday to see how you did.
        </div>
      )}
    </div>
  );
}
