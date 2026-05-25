import { AnimatePresence, motion } from "framer-motion";

export type NarrationLine = {
  id: string;
  text: string;
  /** If true, this line replaces a previous line with strike-through. */
  strikePrev?: string;
  tone?: "default" | "muted" | "warn";
};

export function NarrationStream({
  lines,
  strikes = [],
}: {
  lines: NarrationLine[];
  /** ids of lines that should be shown with strike-through */
  strikes?: string[];
}) {
  return (
    <div className="flex flex-col gap-2 font-mono text-[12px] leading-relaxed">
      <AnimatePresence initial={false}>
        {lines.map((l) => {
          const struck = strikes.includes(l.id);
          const color =
            l.tone === "warn" ? "text-ember" :
            l.tone === "muted" ? "text-ink-dim" :
            "text-ink";
          return (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: struck ? 0.45 : 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-2 ${color}`}
            >
              <span className="text-hud/60">›</span>
              <span className={struck ? "line-through" : ""}>{l.text}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
