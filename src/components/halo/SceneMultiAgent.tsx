import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { AIStatusOrb, type OrbState } from "./AIStatusOrb";

type NodeId = "glasses" | "home" | "car";

type Step = { node: NodeId; key: string; at: number; done: number };

const steps: Step[] = [
  { node: "home", key: "s5.home1", at: 600, done: 2000 },
  { node: "car", key: "s5.car1", at: 800, done: 3200 },
  { node: "glasses", key: "s5.glasses1", at: 1100, done: 2400 },
  { node: "home", key: "s5.home2", at: 2400, done: 3800 },
  { node: "glasses", key: "s5.glasses2", at: 2900, done: 4200 },
  { node: "car", key: "s5.car2", at: 3500, done: 5400 },
];

export function SceneMultiAgent() {
  const { t } = useT();
  const [t0, setT0] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const raf = useRef<number | null>(null);
  const [lowBattery, setLowBattery] = useState(false);

  const play = () => {
    setT0(performance.now());
    setElapsed(0);
    setLowBattery(false);
  };

  useEffect(() => {
    if (t0 == null) return;
    const tick = (now: number) => {
      const e = now - t0;
      setElapsed(e);
      if (e > 5800 && !lowBattery) setLowBattery(true);
      if (e < 8000) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t0]);

  const orb: OrbState = t0 == null ? "idle" : elapsed < 5500 ? "acting" : "handoff";

  return (
    <div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-[1.4fr_1fr]">
      {/* Left: topology + tasks */}
      <div className="relative min-h-[460px] overflow-hidden border-b border-line bg-bg-soft/20 p-6 lg:border-b-0 lg:p-8">
        <div className="absolute left-4 top-4 z-10">
          <AIStatusOrb state={orb} />
        </div>

        {/* User command bar */}
        <div className="mb-6 flex justify-end">
          {t0 == null ? (
            <button
              onClick={play}
              className="flex flex-col gap-0.5 rounded-2xl border border-hud/60 bg-hud/10 px-4 py-2 text-right transition hover:bg-hud/20"
            >
              <span className="text-[12px]">🎤 {t("s5.play")}</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-dim">{t("s4.micNote")}</span>
            </button>
          ) : (
            <button onClick={play} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim hover:text-hud">
              ↻ {t("s5.reset")}
            </button>
          )}
        </div>

        {/* Topology */}
        <div className="relative mx-auto grid max-w-2xl grid-cols-3 gap-4">
          {(["glasses", "home", "car"] as NodeId[]).map((id) => {
            const nodeSteps = steps.filter((s) => s.node === id);
            return (
              <NodeCard
                key={id}
                label={t(`s5.${id}`)}
                steps={nodeSteps.map((s) => ({
                  text: t(s.key),
                  started: elapsed >= s.at,
                  done: elapsed >= s.done,
                }))}
              />
            );
          })}
        </div>

        {/* Connecting lines (decorative) */}
        <svg className="pointer-events-none absolute inset-x-0 top-1/2 -z-0 h-12 w-full" viewBox="0 0 400 40" preserveAspectRatio="none">
          <motion.line
            x1="20" y1="20" x2="380" y2="20"
            stroke="var(--hud)" strokeOpacity={0.25} strokeWidth={1}
            strokeDasharray="3 4"
            animate={{ strokeDashoffset: t0 == null ? 0 : [0, -14] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      {/* Right: aggregator (glasses) */}
      <div className="flex flex-col gap-4 border-t border-line bg-bg-soft/30 p-6 lg:border-l lg:border-t-0 lg:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-hud">{t("demo.right")} · {t("s5.glasses")}</p>
        <AnimatePresence>
          {lowBattery && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-ember/50 bg-ember/10 px-4 py-3"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ember">⚠ {t("s5.car")} → {t("s5.glasses")}</p>
              <p className="mt-2 text-[13px]">{t("s5.lowbat")}</p>
              <p className="mt-2 text-[11px] text-ink-dim">{t("s5.lowbatNote")}</p>
            </motion.div>
          )}
          {!lowBattery && (
            <p className="text-[12px] text-ink-dim">{t("s5.cap")}</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NodeCard({ label, steps }: { label: string; steps: { text: string; started: boolean; done: boolean }[] }) {
  return (
    <div className="rounded-2xl border border-line bg-bg/50 p-4">
      <div className="flex items-center gap-2">
        <motion.span
          className="h-2 w-2 rounded-full bg-hud"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">{label}</span>
      </div>
      <ul className="mt-3 space-y-1.5 font-mono text-[11px]">
        {steps.map((s, i) => (
          <li key={i} className={`flex items-start gap-2 ${s.started ? "text-ink" : "text-ink-dim/50"}`}>
            <span className={s.done ? "text-hud" : s.started ? "text-ember" : "text-ink-dim/40"}>
              {s.done ? "✓" : s.started ? "◐" : "○"}
            </span>
            <span className={s.done ? "" : ""}>{s.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
