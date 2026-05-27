import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Shared third-person stage for all scenes.
 * viewBox is 800x500 — children pass absolute % positions or SVG coords through.
 *
 * Children render two layers:
 *  - svgOverlay: drawn inside the SVG (paths, sight-lines, robot)
 *  - children:   regular HTML overlays positioned via `top/left` in % over the stage
 */
export function RoomStage({
  children,
  svgOverlay,
  highlight,
}: {
  children?: ReactNode;
  svgOverlay?: ReactNode;
  /** Optional radial highlight position in 0..1 (e.g. where the robot is attending) */
  highlight?: { x: number; y: number } | null;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-bg-soft">
      {/* Ambient background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 110%, color-mix(in oklab, var(--hud) 6%, transparent), transparent 60%), linear-gradient(180deg, var(--bg) 0%, var(--bg-soft) 100%)",
        }}
      />

      {/* Stage SVG */}
      <svg
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="color-mix(in oklab, var(--hud) 5%, var(--bg-soft))" />
            <stop offset="100%" stopColor="var(--bg)" />
          </linearGradient>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="color-mix(in oklab, var(--hud) 4%, var(--bg))" />
            <stop offset="100%" stopColor="var(--bg-soft)" />
          </linearGradient>
        </defs>

        {/* Wall */}
        <rect x="0" y="0" width="800" height="280" fill="url(#wall)" />
        {/* Floor */}
        <polygon points="0,280 800,280 800,500 0,500" fill="url(#floor)" />
        {/* Floor perspective lines */}
        <line x1="0" y1="280" x2="800" y2="280" stroke="color-mix(in oklab, var(--hud) 15%, transparent)" strokeWidth="1" />
        <line x1="120" y1="500" x2="320" y2="280" stroke="color-mix(in oklab, var(--hud) 8%, transparent)" strokeWidth="1" />
        <line x1="680" y1="500" x2="480" y2="280" stroke="color-mix(in oklab, var(--hud) 8%, transparent)" strokeWidth="1" />

        {/* Window — back wall */}
        <g>
          <rect x="540" y="60" width="180" height="160" fill="color-mix(in oklab, var(--hud) 12%, var(--bg))" stroke="color-mix(in oklab, var(--hud) 30%, transparent)" strokeWidth="1.5" rx="2" />
          <line x1="630" y1="60" x2="630" y2="220" stroke="color-mix(in oklab, var(--hud) 30%, transparent)" strokeWidth="1" />
          <line x1="540" y1="140" x2="720" y2="140" stroke="color-mix(in oklab, var(--hud) 30%, transparent)" strokeWidth="1" />
        </g>

        {/* Door — back wall left */}
        <rect x="60" y="80" width="90" height="200" fill="none" stroke="color-mix(in oklab, var(--hud) 22%, transparent)" strokeWidth="1.5" rx="2" />

        {/* Sofa — front-left */}
        <g>
          {/* back */}
          <rect x="80" y="300" width="280" height="60" rx="10" fill="color-mix(in oklab, var(--hud) 8%, var(--bg-soft))" stroke="color-mix(in oklab, var(--hud) 25%, transparent)" strokeWidth="1.2" />
          {/* seat */}
          <rect x="70" y="350" width="300" height="50" rx="12" fill="color-mix(in oklab, var(--hud) 12%, var(--bg-soft))" stroke="color-mix(in oklab, var(--hud) 30%, transparent)" strokeWidth="1.2" />
          {/* armrests */}
          <rect x="60" y="330" width="20" height="70" rx="6" fill="color-mix(in oklab, var(--hud) 10%, var(--bg-soft))" stroke="color-mix(in oklab, var(--hud) 25%, transparent)" strokeWidth="1" />
          <rect x="360" y="330" width="20" height="70" rx="6" fill="color-mix(in oklab, var(--hud) 10%, var(--bg-soft))" stroke="color-mix(in oklab, var(--hud) 25%, transparent)" strokeWidth="1" />
        </g>

        {/* Coffee table — center-front */}
        <g>
          <ellipse cx="450" cy="430" rx="90" ry="14" fill="color-mix(in oklab, var(--ink) 8%, transparent)" />
          <rect x="380" y="395" width="140" height="30" rx="4" fill="color-mix(in oklab, var(--hud) 14%, var(--bg-soft))" stroke="color-mix(in oklab, var(--hud) 30%, transparent)" strokeWidth="1.2" />
        </g>

        {/* Attention highlight */}
        {highlight && (
          <motion.circle
            cx={highlight.x * 800}
            cy={highlight.y * 500}
            r="55"
            fill="none"
            stroke="color-mix(in oklab, var(--hud) 55%, transparent)"
            strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
        )}

        {svgOverlay}
      </svg>

      {/* HTML overlays */}
      {children}
    </div>
  );
}

/** Static user silhouette sitting on the sofa. */
export function UserOnSofa({ active = false }: { active?: boolean }) {
  return (
    <g>
      {/* body */}
      <path
        d="M 180 360 q 30 -45 60 0 l 0 30 l -60 0 z"
        fill="color-mix(in oklab, var(--ink) 70%, var(--bg))"
      />
      {/* head */}
      <circle
        cx="210"
        cy="320"
        r="16"
        fill="color-mix(in oklab, var(--ink) 80%, var(--bg))"
      />
      {/* attention ring */}
      {active && (
        <motion.circle
          cx="210"
          cy="335"
          r="40"
          fill="none"
          stroke="color-mix(in oklab, var(--hud) 60%, transparent)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ transformOrigin: "210px 335px" }}
        />
      )}
    </g>
  );
}

/** A small object on the coffee table (cup, etc.) */
export function StageObject({
  x,
  y,
  label,
  highlighted = false,
  onHover,
  onLeave,
}: {
  x: number;
  y: number;
  label?: string;
  highlighted?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
}) {
  return (
    <g
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{ cursor: onHover ? "pointer" : "default" }}
    >
      {/* cup */}
      <rect
        x={x - 8}
        y={y - 14}
        width="16"
        height="18"
        rx="2"
        fill="color-mix(in oklab, var(--ink) 50%, var(--bg))"
        stroke={highlighted ? "var(--hud)" : "color-mix(in oklab, var(--hud) 35%, transparent)"}
        strokeWidth={highlighted ? 1.6 : 1}
      />
      <ellipse
        cx={x}
        cy={y - 14}
        rx="8"
        ry="2.5"
        fill="color-mix(in oklab, var(--hud) 30%, var(--bg))"
      />
      {highlighted && (
        <motion.circle
          cx={x}
          cy={y - 6}
          r="22"
          fill="none"
          stroke="color-mix(in oklab, var(--hud) 60%, transparent)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          style={{ transformOrigin: `${x}px ${y - 6}px` }}
        />
      )}
      {label && highlighted && (
        <text
          x={x}
          y={y - 30}
          textAnchor="middle"
          fill="color-mix(in oklab, var(--ink) 95%, transparent)"
          fontSize="11"
          fontFamily="ui-monospace, monospace"
          style={{ letterSpacing: "0.05em" }}
        >
          {label}
        </text>
      )}
    </g>
  );
}
