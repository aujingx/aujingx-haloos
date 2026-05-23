import { motion } from "framer-motion";

export type OrbState = "idle" | "listening" | "thinking" | "acting";

const labels: Record<OrbState, string> = {
  idle: "待机",
  listening: "在听",
  thinking: "理解中",
  acting: "执行中",
};

export function AIStatusOrb({ state = "idle", className = "" }: { state?: OrbState; className?: string }) {
  const color =
    state === "listening" ? "var(--hud)" :
    state === "thinking" ? "var(--ember)" :
    state === "acting" ? "var(--hud)" :
    "var(--ink-dim)";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative grid h-9 w-9 place-items-center">
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: color, opacity: 0.15 }}
          animate={state === "idle" ? { scale: 1 } : { scale: [1, 1.6, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute inset-1 rounded-full"
          style={{ background: color, opacity: 0.25 }}
          animate={state === "idle" ? { scale: 1 } : { scale: [1, 1.3, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.span
          className="relative h-3 w-3 rounded-full"
          style={{ background: color, boxShadow: `0 0 14px ${color}` }}
          animate={state === "thinking" ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">Halo</span>
        <span className="font-mono text-xs text-ink">{labels[state]}</span>
      </div>
    </div>
  );
}
