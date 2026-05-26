import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { AIStatusOrb, type OrbState } from "./AIStatusOrb";
import homeScene from "@/assets/home-scene.jpg";

type NodeId = "glasses" | "home" | "car";

const steps: { node: NodeId; key: string; at: number; done: number }[] = [
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
  }, [t0, lowBattery]);

  const orb: OrbState = t0 == null ? "idle" : elapsed < 5500 ? "acting" : "handoff";

  return (
    <div className="relative h-[560px] w-full overflow-hidden bg-bg">
      <img src={homeScene} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-35" width={1536} height={896} />
      <div className="absolute inset-0 bg-bg/55" />

      <div className="absolute left-5 top-5 z-20">
        <AIStatusOrb state={orb} />
      </div>

      {/* Your spoken request — floats at top */}
      <AnimatePresence>
        {t0 != null && elapsed < 3500 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 top-6 z-10 mx-auto w-fit max-w-md rounded-full bg-bg/85 px-5 py-2 text-center text-[13px] backdrop-blur"
          >
            {t("s5.play")}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Three device cards floating in your view */}
      <div className="absolute inset-x-0 top-1/2 z-10 mx-auto grid max-w-3xl -translate-y-1/2 grid-cols-1 gap-3 px-6 md:grid-cols-3">
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

      {/* Low battery — surfaces from car, but spoken by glasses (one voice) */}
      <AnimatePresence>
        {lowBattery && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-6 bottom-24 z-10 mx-auto flex max-w-md flex-col gap-1 rounded-2xl border border-ember/40 bg-bg/85 px-5 py-3 backdrop-blur"
          >
            <p className="text-[14px]">{t("s5.lowbat")}</p>
            <p className="text-[11px] text-ink-dim">{t("s5.lowbatNote")}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom control */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center gap-3">
        {t0 == null ? (
          <button
            onClick={play}
            className="flex flex-col gap-0.5 rounded-2xl border border-hud/60 bg-hud/15 px-5 py-2.5 text-center backdrop-blur transition hover:bg-hud/20"
          >
            <span className="text-[13px]">🎤 {t("s5.play")}</span>
            <span className="text-[10px] text-ink-dim">{t("s4.micNote")}</span>
          </button>
        ) : (
          <button onClick={play} className="rounded-full bg-bg/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim backdrop-blur hover:text-hud">
            ↻ {t("s4.reset")}
          </button>
        )}
      </div>
    </div>
  );
}

function NodeCard({ label, steps }: { label: string; steps: { text: string; started: boolean; done: boolean }[] }) {
  return (
    <div className="rounded-2xl border border-line bg-bg/75 p-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <motion.span
          className="h-2 w-2 rounded-full bg-hud"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <span className="text-[12px] tracking-wide text-ink-dim">{label}</span>
      </div>
      <ul className="mt-3 space-y-1.5 text-[12px]">
        {steps.map((s, i) => (
          <li key={i} className={`flex items-start gap-2 ${s.started ? "text-ink" : "text-ink-dim/45"}`}>
            <span className={s.done ? "text-hud" : s.started ? "text-ember" : "text-ink-dim/40"}>
              {s.done ? "✓" : s.started ? "◐" : "○"}
            </span>
            <span>{s.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
