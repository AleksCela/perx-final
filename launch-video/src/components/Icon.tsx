import React from "react";

// A tiny inline-SVG icon set (the product uses an icon font we can't load in the
// renderer, so we draw the few glyphs we need). Stroke-based, 24x24 viewBox.
const PATHS: Record<string, React.ReactNode> = {
  sparkles: (
    <path d="M12 3l1.8 4.7L18.5 9l-4.7 1.8L12 15l-1.8-4.2L5.5 9l4.7-1.3L12 3zM18 14l.9 2.2 2.1.8-2.1.9L18 20l-.9-2.1-2.1-.9 2.1-.8L18 14z" />
  ),
  bolt: <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />,
  ticket: (
    <path d="M3 8a2 2 0 012-2h14a2 2 0 012 2 2 2 0 000 8 2 2 0 01-2 2H5a2 2 0 01-2-2 2 2 0 000-8zM14 7v10" />
  ),
  trophy: (
    <path d="M7 4h10v3a5 5 0 01-10 0V4zM7 6H4v1a3 3 0 003 3M17 6h3v1a3 3 0 01-3 3M10 14h4v3h-4zM8 20h8" />
  ),
  heart: (
    <path d="M12 20s-7-4.3-7-9.3A3.7 3.7 0 0112 8a3.7 3.7 0 017 2.7C19 15.7 12 20 12 20z" />
  ),
  plug: <path d="M9 2v6M15 2v6M7 8h10v3a5 5 0 01-10 0V8zM12 16v6" />,
  lock: (
    <path d="M6 11h12v9H6v-9zM8 11V8a4 4 0 018 0v3" />
  ),
  check: <path d="M5 12l4.5 4.5L19 7" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  ball: <path d="M12 3a9 9 0 100 18 9 9 0 000-18zM12 8l3.5 2.5-1.3 4h-4.4l-1.3-4L12 8z" />,
  activity: <path d="M3 12h4l2 6 4-14 2 8h6" />,
  gift: (
    <path d="M4 11h16v9H4v-9zM2 7h20v4H2V7zM12 7v13M12 7S9 3 7 5s1 2 5 2zM12 7s3-4 5-2-1 2-5 2z" />
  ),
  flame: <path d="M12 3c2 4-3 5-1 9 .5 1 .5 2 0 3M12 21a6 6 0 006-6c0-4-4-5-3-9-4 2-9 5-9 9a6 6 0 006 6z" />,
  star: <path d="M12 3l2.6 6 6.4.5-4.9 4.2 1.5 6.3L12 17l-5.6 3 1.5-6.3L3 9.5 9.4 9 12 3z" />,
  pin: <path d="M12 21s-7-7-7-12a7 7 0 0114 0c0 5-7 12-7 12zM12 11a2 2 0 100-4 2 2 0 000 4z" />,
  refresh: <path d="M4 12a8 8 0 0114-5l2-2M20 4v4h-4M20 12a8 8 0 01-14 5l-2 2M4 20v-4h4" />,
  compass: <path d="M12 21a9 9 0 100-18 9 9 0 000 18zM15 9l-2 5-5 2 2-5 5-2z" />,
  up: <path d="M6 15l6-6 6 6" />,
  bulb: <path d="M9 18h6M10 21h4M12 3a6 6 0 014 10.5c-.7.7-1 1.2-1 2.5H9c0-1.3-.3-1.8-1-2.5A6 6 0 0112 3z" />,
  send: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />,
  map: <path d="M9 4L3 6v15l6-2 6 2 6-2V4l-6 2-6-2zM9 4v15M15 6v15" />,
  building: <path d="M4 21V5a1 1 0 011-1h9a1 1 0 011 1v16M15 21V9h4a1 1 0 011 1v11M3 21h18M8 8h3M8 12h3M8 16h3" />,
  world: <path d="M12 3a9 9 0 100 18 9 9 0 000-18zM3.5 9h17M3.5 15h17M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18" />,
};

export const Icon: React.FC<{
  name: keyof typeof PATHS | string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: boolean;
  style?: React.CSSProperties;
}> = ({ name, size = 22, color = "currentColor", strokeWidth = 2, fill = false, style }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? color : "none"}
      stroke={fill ? "none" : color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: "none", ...style }}
    >
      {PATHS[name] ?? PATHS.sparkles}
    </svg>
  );
};
