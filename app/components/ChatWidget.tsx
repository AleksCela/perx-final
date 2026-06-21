"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "model"; text: string };

const GREETING: Msg = {
  role: "model",
  text: "Hi! I'm your Perx assistant 👋 Ask me how to build a perk combo, what Friday drops are, how approvals work, or for a suggestion within your budget.",
};

const SUGGESTIONS = [
  "How do I build a combo?",
  "What's a Friday drop?",
  "Suggest a relaxing perk under 50 PX",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, text: content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "model", text: data.reply || data.error || "Sorry, something went wrong." },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "model", text: "I couldn't reach the assistant. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Launcher button */}
      <button
        type="button"
        aria-label={open ? "Close assistant" : "Open assistant"}
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed", right: 22, bottom: 22, zIndex: 200,
          width: 60, height: 60, borderRadius: "50%", border: "none", cursor: "pointer",
          background: "var(--orange)", color: "#fff",
          boxShadow: "0 10px 30px rgba(178,60,10,.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, transition: "transform .15s ease",
        }}
      >
        <i className={`ti ${open ? "ti-x" : "ti-message-chatbot"}`} />
      </button>

      {open && (
        <div
          className="card"
          style={{
            position: "fixed", right: 22, bottom: 94, zIndex: 200,
            width: 370, maxWidth: "calc(100vw - 44px)", height: 520, maxHeight: "calc(100vh - 130px)",
            display: "flex", flexDirection: "column", overflow: "hidden",
            boxShadow: "0 24px 60px rgba(26,22,16,.25)", padding: 0,
          }}
        >
          {/* header */}
          <div style={{ background: "var(--ink)", color: "#fff", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              width: 36, height: 36, borderRadius: "50%", background: "var(--orange)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
            }}>
              <i className="ti ti-sparkles" />
            </span>
            <div style={{ lineHeight: 1.2 }}>
              <div className="d" style={{ fontWeight: 700, fontSize: 15 }}>Perx Assistant</div>
              <div style={{ fontSize: 11.5, color: "rgba(251,246,236,.65)" }}>Here to help with your perks</div>
            </div>
          </div>

          {/* messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10, background: "#fffdf8" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "82%",
                  background: m.role === "user" ? "var(--blue)" : "var(--paper)",
                  color: m.role === "user" ? "#fff" : "var(--ink)",
                  borderRadius: 14,
                  borderBottomRightRadius: m.role === "user" ? 4 : 14,
                  borderBottomLeftRadius: m.role === "user" ? 14 : 4,
                  padding: "9px 12px", fontSize: 13.5, lineHeight: 1.5, whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: "flex-start", background: "var(--paper)", borderRadius: 14, padding: "10px 14px", fontSize: 13, color: "var(--muted)" }}>
                <i className="ti ti-loader-2" style={{ animation: "spin 1s linear infinite", display: "inline-block" }} /> thinking…
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 4 }}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    style={{
                      textAlign: "left", border: "1px solid var(--line)", background: "#fff",
                      borderRadius: 12, padding: "8px 11px", fontSize: 12.5, color: "var(--ink)", cursor: "pointer",
                    }}
                  >
                    <i className="ti ti-arrow-right" style={{ color: "var(--orange)" }} /> {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid var(--line)", background: "#fffdf8" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your perks…"
              style={{
                flex: 1, border: "1px solid var(--line)", borderRadius: 12, padding: "10px 12px",
                fontSize: 13.5, fontFamily: "inherit", color: "var(--ink)", background: "#fff", outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send"
              style={{
                width: 42, borderRadius: 12, border: "none", cursor: loading || !input.trim() ? "default" : "pointer",
                background: loading || !input.trim() ? "var(--line)" : "var(--orange)", color: "#fff", fontSize: 17,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              <i className="ti ti-send" />
            </button>
          </form>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
