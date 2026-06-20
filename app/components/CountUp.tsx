"use client";

import { useEffect, useRef, useState } from "react";

export default function CountUp({
  value,
  prefix = "",
  duration = 1100,
}: {
  value: number;
  prefix?: string;
  duration?: number;
}) {
  const [n, setN] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(value * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);

  return (
    <span className="tnum">
      {prefix}
      {n.toLocaleString("en-US")}
    </span>
  );
}
