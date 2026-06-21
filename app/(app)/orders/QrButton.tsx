"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export default function QrButton({ orderId, title }: { orderId: string; title: string }) {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    const url = `${window.location.origin}/provider/redeem/${orderId}`;
    QRCode.toCanvas(canvasRef.current, url, {
      width: 220,
      margin: 2,
      color: { dark: "#1a1610", light: "#ffffff" },
    });
  }, [open, orderId]);

  return (
    <>
      <button
        type="button"
        className="btn"
        style={{ padding: "7px 14px", fontSize: 13 }}
        onClick={() => setOpen(true)}
      >
        <i className="ti ti-qrcode" /> Show QR
      </button>

      {open && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(26,22,16,.55)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            className="card"
            style={{ padding: 28, maxWidth: 300, width: "100%", textAlign: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="kick" style={{ marginBottom: 4 }}>Show this at the venue</div>
            <div className="d" style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
              {title.replace(/\s*·\s*\d+[-\s]pass\b/i, "").replace(/\s*×\s*\d+/i, "").trim()}
            </div>
            <canvas
              ref={canvasRef}
              style={{ borderRadius: 12, display: "block", margin: "0 auto" }}
            />
            <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 14 }}>
              Provider scans this to confirm your booking
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ marginTop: 14, width: "100%" }}
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
