import { motion } from "framer-motion";

export type RobotState = "idle" | "listening" | "thinking" | "acting" | "handoff";

export function AgentRobot({
  x,
  y,
  state = "idle",
  /** target the robot's eye looks at (in 0..800, 0..500 stage coords). */
  lookAt,
  scale = 1,
  showSightLine = false,
}: {
  x: number;
  y: number;
  state?: RobotState;
  lookAt?: { x: number; y: number } | null;
  scale?: number;
  showSightLine?: boolean;
}) {
  const eyeColor =
    state === "thinking" ? "var(--ember)" :
    state === "handoff" ? "var(--ember)" :
    "var(--hud)";

  // eye pupil offset toward lookAt
  let pupilDx = 0;
  let pupilDy = 0;
  if (lookAt) {
    const dx = lookAt.x - x;
    const dy = lookAt.y - (y - 30 * scale);
    const len = Math.hypot(dx, dy) || 1;
    pupilDx = (dx / len) * 3;
    pupilDy = (dy / len) * 3;
  }

  return (
    <g>
      {/* sight line */}
      {showSightLine && lookAt && (
        <motion.line
          x1={x}
          y1={y - 30 * scale}
          x2={lookAt.x}
          y2={lookAt.y}
          stroke="color-mix(in oklab, var(--hud) 45%, transparent)"
          strokeWidth="1"
          strokeDasharray="3 4"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      )}

      {/* shadow */}
      <ellipse cx={x} cy={y + 32 * scale} rx={26 * scale} ry={5 * scale} fill="color-mix(in oklab, var(--ink) 25%, transparent)" />

      {/* body — rounded Loona-like */}
      <motion.g
        animate={{ y: state === "idle" ? [0, -2, 0] : state === "acting" ? [0, -1, 0] : 0 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: `${x}px ${y}px` }}
      >
        {/* base/wheel */}
        <ellipse cx={x} cy={y + 22 * scale} rx={22 * scale} ry={7 * scale} fill="color-mix(in oklab, var(--ink) 35%, var(--bg))" stroke="color-mix(in oklab, var(--hud) 30%, transparent)" strokeWidth="1" />
        {/* dome body */}
        <path
          d={`M ${x - 28 * scale} ${y + 20 * scale}
              Q ${x - 32 * scale} ${y - 30 * scale}, ${x} ${y - 35 * scale}
              Q ${x + 32 * scale} ${y - 30 * scale}, ${x + 28 * scale} ${y + 20 * scale}
              Z`}
          fill="color-mix(in oklab, var(--ink) 18%, var(--bg-soft))"
          stroke="color-mix(in oklab, var(--hud) 35%, transparent)"
          strokeWidth="1.2"
        />
        {/* face screen */}
        <rect
          x={x - 20 * scale}
          y={y - 22 * scale}
          width={40 * scale}
          height={26 * scale}
          rx={8 * scale}
          fill="color-mix(in oklab, var(--ink) 55%, var(--bg))"
          stroke="color-mix(in oklab, var(--hud) 30%, transparent)"
          strokeWidth="1"
        />
        {/* eye */}
        <motion.circle
          cx={x + pupilDx}
          cy={y - 10 * scale + pupilDy}
          r={7 * scale}
          fill={eyeColor}
          style={{ filter: `drop-shadow(0 0 6px ${eyeColor})` }}
          animate={
            state === "listening" || state === "acting"
              ? { opacity: [0.7, 1, 0.7] }
              : state === "thinking"
              ? { opacity: [0.5, 1, 0.5] }
              : { opacity: 1 }
          }
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        {/* pupil */}
        <circle cx={x + pupilDx} cy={y - 10 * scale + pupilDy} r={2.5 * scale} fill="var(--bg)" />

        {/* state badge — thinking dots */}
        {state === "thinking" && (
          <g>
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx={x - 8 * scale + i * 8 * scale}
                cy={y - 42 * scale}
                r={1.6 * scale}
                fill="var(--ember)"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </g>
        )}
      </motion.g>
    </g>
  );
}
