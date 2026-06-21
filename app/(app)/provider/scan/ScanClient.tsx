"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ScanState = "idle" | "scanning" | "error";

export default function ScanClient() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<ScanState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);

  function stop() {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function startScan() {
    setState("scanning");
    setErrorMsg("");
    try {
      if (!("BarcodeDetector" in window)) {
        throw new Error("QR scanning is not supported in this browser. Try Chrome or Edge.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();

      // @ts-expect-error BarcodeDetector is not in TS lib yet
      const detector = new BarcodeDetector({ formats: ["qr_code"] });

      function tick() {
        if (!streamRef.current) return;
        detector.detect(video).then((codes: { rawValue: string }[]) => {
          if (codes.length > 0) {
            const raw = codes[0].rawValue;
            stop();
            // extract orderId from URL or use raw value directly
            const match = raw.match(/\/provider\/redeem\/([^/?#]+)/);
            if (match) {
              router.push(`/provider/redeem/${match[1]}`);
            } else {
              setErrorMsg("QR code is not a valid Perx redemption code.");
              setState("error");
            }
          } else {
            rafRef.current = requestAnimationFrame(tick);
          }
        }).catch(() => {
          rafRef.current = requestAnimationFrame(tick);
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    } catch (e: unknown) {
      stop();
      setErrorMsg(e instanceof Error ? e.message : "Could not access camera.");
      setState("error");
    }
  }

  useEffect(() => () => stop(), []);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
      <div className="kick" style={{ color: "var(--orange-d)", marginBottom: 8 }}>Provider tools</div>
      <h1 className="d" style={{ fontSize: 32, fontWeight: 700, margin: "0 0 8px" }}>Scan customer QR</h1>
      <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: 14 }}>
        Ask the customer to open their order and tap "Show QR". Point your camera at the code.
      </p>

      <div
        style={{
          position: "relative", width: "100%", aspectRatio: "1/1",
          borderRadius: 20, overflow: "hidden",
          background: "var(--surface-2)",
          border: "2px solid var(--line)",
          marginBottom: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            display: state === "scanning" ? "block" : "none",
          }}
        />
        {state !== "scanning" && (
          <div style={{ padding: 32 }}>
            <i className="ti ti-qrcode" style={{ fontSize: 72, color: "var(--muted)", opacity: .4 }} />
          </div>
        )}
        {state === "scanning" && (
          <div style={{
            position: "absolute", inset: 0,
            border: "3px solid var(--orange)",
            borderRadius: 18,
            pointerEvents: "none",
          }}>
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              width: "55%", aspectRatio: "1/1",
              border: "2px solid rgba(255,106,31,.7)",
              borderRadius: 12,
            }} />
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="card" style={{ padding: 14, marginBottom: 16, background: "rgba(178,60,10,.08)", color: "var(--orange-d)", fontSize: 13 }}>
          <i className="ti ti-alert-triangle" /> {errorMsg}
        </div>
      )}

      {state !== "scanning" ? (
        <button className="btn" style={{ width: "100%", padding: "13px 0", fontSize: 15 }} onClick={startScan}>
          <i className="ti ti-camera" /> Start scanning
        </button>
      ) : (
        <button className="btn btn-ghost" style={{ width: "100%", padding: "13px 0" }} onClick={() => { stop(); setState("idle"); }}>
          <i className="ti ti-x" /> Stop
        </button>
      )}

      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 14 }}>
        Requires camera permission · Works in Chrome & Edge
      </p>
    </div>
  );
}
