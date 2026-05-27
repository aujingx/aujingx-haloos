import { motion, AnimatePresence } from "framer-motion";

export type Channel = "vision" | "voice" | "gesture";

const ICON: Record<Channel, string> = {
  vision: "◉",
  voice: "▮",
  gesture: "✋",
};

export function PerceptionChannels({
  active,
  labels,
}: {
  active: Channel | null;
  labels: Record<Channel, string>;
}) {
  return (
    <div className="flex items-center gap-2">
      {(["vision", "voice", "gesture"] as Channel[]).map((ch) => {
        const on = active === ch;
        return (
          <div
            key={ch}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] transition ${
              on
                ? "border-hud/70 bg-hud/15 text-ink"
                : "border-line bg-bg/60 text-ink-dim/70"
            }`}
          >
            <motion.span
              animate={on ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.5 }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ color: on ? "var(--hud)" : undefined }}
            >
              {ICON[ch]}
            </motion.span>
            <span>{labels[ch]}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Floating voice waveform above a point (used for "user speaks") */
export function VoiceBubble({ x, y, text }: { x: number; y: number; text?: string }) {
  return (
    <AnimatePresence>
      <motion.g
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        {text && (
          <g>
            <rect
              x={x - 70}
              y={y - 28}
              width="140"
              height="22"
              rx="11"
              fill="color-mix(in oklab, var(--bg) 85%, transparent)"
              stroke="color-mix(in oklab, var(--hud) 40%, transparent)"
              strokeWidth="1"
            />
            <text
              x={x}
              y={y - 13}
              textAnchor="middle"
              fill="var(--ink)"
              fontSize="11"
              fontFamily="ui-sans-serif, system-ui"
            >
              {text}
            </text>
          </g>
        )}
      </motion.g>
    </AnimatePresence>
  );
}
