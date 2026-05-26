import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { AIStatusOrb } from "./AIStatusOrb";
import homeScene from "@/assets/home-scene.jpg";

type EventId = "boil" | "msg" | "pkg" | "filtered";

const schedule: { id: EventId; at: number; duration: number }[] = [
  { id: "boil", at: 1500, duration: 3000 },
  { id: "msg", at: 7000, duration: 3000 },
  { id: "filtered", at: 12000, duration: 99000 },
  { id: "pkg", at: 16000, duration: 3500 },
];

export function SceneEmergence() {
  const { t } = useT();
  const [t0, setT0] = useState<number | null>(null);
  const [active, setActive] = useState<Record<EventId, boolean>>({ boil: false, msg: false, pkg: false, filtered: false });
  const [elapsed, setElapsed] = useState(0);
  const raf = useRef<number | null>(null);

  const play = () => {
    setActive({ boil: false, msg: false, pkg: false, filtered: false });
    setT0(performance.now());
    setElapsed(0);
  };

  useEffect(() => {
    if (t0 == null) return;
    const tick = (now: number) => {
      const e = now - t0;
      setElapsed(e);
      const next: Record<EventId, boolean> = { boil: false, msg: false, pkg: false, filtered: false };
      for (const s of schedule) {
        if (e >= s.at && e < s.at + s.duration) next[s.id] = true;
      }
      setActive(next);
      if (e < 22000) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [t0]);

  return (
    <div className="relative h-[560px] w-full overflow-hidden bg-bg">
      <img src={homeScene} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-60" width={1536} height={896} />
      <div className="absolute inset-0 bg-bg/30" />

      <div className="absolute left-5 top-5 z-20">
        <AIStatusOrb state={Object.values(active).some(Boolean) ? "acting" : "idle"} />
      </div>

      {/* Ambient: warm tint over kitchen direction */}
      <AnimatePresence>
        {active.boil && (
          <motion.div
            key="warm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none absolute inset-y-0 right-0 w-2/3"
            style={{ background: "radial-gradient(circle at 80% 50%, color-mix(in oklab, var(--ember) 35%, transparent), transparent 70%)" }}
          />
        )}
        {active.boil && (
          <motion.span
            key="boil-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 text-[12px] tracking-wide text-ember/90"
          >
            {t("s3.t1")}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Soft message — bottom of view */}
      <AnimatePresence>
        {active.msg && (
          <motion.div
            key="msg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute inset-x-0 bottom-24 mx-auto w-fit max-w-md rounded-full bg-bg/80 px-5 py-2 text-[13px] backdrop-blur"
          >
            {t("s3.t2")}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Acted — quiet top bar with undo */}
      <AnimatePresence>
        {active.pkg && (
          <motion.div
            key="pkg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-6 top-20 mx-auto flex w-fit items-center gap-4 rounded-xl border border-hud/40 bg-bg/85 px-4 py-2.5 backdrop-blur"
          >
            <span className="text-[13px]">✓ {t("s3.t3")}</span>
            <button className="font-mono text-[10px] uppercase tracking-[0.25em] text-hud hover:underline">Undo · 3s</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtered — faint chip bottom-left */}
      <AnimatePresence>
        {active.filtered && (
          <motion.button
            key="filt"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 0.7, x: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-24 left-6 flex items-center gap-2 rounded-full bg-bg/60 px-3 py-1.5 text-[11px] text-ink-dim backdrop-blur transition hover:opacity-100 hover:text-ink"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-ink-dim" />
            {t("s3.filtered")}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Play control */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-3">
        {t0 == null ? (
          <button
            onClick={play}
            className="rounded-full bg-hud px-6 py-2.5 text-[12px] tracking-wide text-bg transition hover:brightness-110"
          >
            ▶ {t("s3.play")}
          </button>
        ) : (
          <div className="flex items-center gap-4 rounded-full bg-bg/70 px-4 py-1.5 font-mono text-[10px] text-ink-dim backdrop-blur">
            <span>{(elapsed / 1000).toFixed(1)}s</span>
            <button onClick={play} className="text-hud hover:underline">{t("s3.replay")}</button>
          </div>
        )}
      </div>
    </div>
  );
}
