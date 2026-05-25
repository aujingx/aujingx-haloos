import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { AIStatusOrb, type OrbState } from "./AIStatusOrb";
import { NarrationStream, type NarrationLine } from "./NarrationStream";
import robotPov from "@/assets/robot-pov.jpg";

type Phase = "idle" | "speaking" | "thinking" | "moving" | "rerouting" | "delivering" | "done" | "stopped";

export function SceneAction() {
  const { t } = useT();
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState<NarrationLine[]>([]);
  const [strikes, setStrikes] = useState<string[]>([]);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const after = (ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };

  useEffect(() => () => clearTimers(), []);

  const reset = () => {
    clearTimers();
    setPhase("idle");
    setProgress(0);
    setLines([]);
    setStrikes([]);
  };

  const run = () => {
    reset();
    setPhase("speaking");
    after(900, () => {
      setPhase("thinking");
      setLines((l) => [...l, { id: "n1", text: t("s4.n1") }]);
      after(700, () => setLines((l) => [...l, { id: "n2", text: t("s4.n2") }]));
      after(1500, () => {
        setLines((l) => [...l, { id: "n3", text: t("s4.n3") }, { id: "n4o", text: t("s4.n4old") }]);
        setPhase("moving");
        // progress 0 → 50
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(50, ((now - start) / 2200) * 50);
          setProgress(p);
          if (p < 50 && phase !== "stopped") requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      after(4200, () => {
        setStrikes((s) => [...s, "n4o"]);
        setLines((l) => [...l, { id: "n4n", text: t("s4.n4new"), tone: "warn" }]);
        setPhase("rerouting");
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(90, 50 + ((now - start) / 2400) * 40);
          setProgress(p);
          if (p < 90) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      after(7200, () => {
        setLines((l) => [...l, { id: "n5", text: t("s4.n5") }]);
        setPhase("delivering");
        setProgress(100);
      });
      after(8400, () => {
        setLines((l) => [...l, { id: "done", text: t("s4.done"), tone: "muted" }]);
        setPhase("done");
      });
    });
  };

  const interrupt = () => {
    clearTimers();
    setPhase("stopped");
    setLines((l) => [...l, { id: "stop", text: t("s4.stopped"), tone: "warn" }]);
  };

  const orb: OrbState =
    phase === "speaking" ? "listening" :
    phase === "thinking" ? "thinking" :
    phase === "moving" || phase === "rerouting" || phase === "delivering" ? "acting" :
    phase === "stopped" ? "handoff" :
    phase === "done" ? "idle" :
    "idle";

  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-[1.3fr_1fr]">
      {/* Left: user controls + robot POV */}
      <div className="relative min-h-[460px] overflow-hidden border-b border-line bg-bg lg:border-b-0">
        <img src={robotPov} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80" width={1536} height={896} />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />

        <div className="absolute left-4 top-4 z-10">
          <AIStatusOrb state={orb} />
        </div>

        {/* Path / progress overlay */}
        <div className="absolute inset-x-12 bottom-32 z-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-hud">PATH</div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full"
              style={{
                background: phase === "stopped" ? "var(--ember)" : "var(--hud)",
                width: `${progress}%`,
                boxShadow: `0 0 12px ${phase === "stopped" ? "var(--ember)" : "var(--hud)"}`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="absolute inset-x-6 bottom-6 z-10 flex flex-wrap items-center justify-between gap-3">
          {phase === "idle" || phase === "done" || phase === "stopped" ? (
            <button
              onClick={run}
              className="flex flex-col gap-0.5 rounded-2xl border border-hud/60 bg-hud/10 px-5 py-2.5 text-left transition hover:bg-hud/20"
            >
              <span className="text-[13px] font-medium">🎤 {t("s4.mic")}</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-dim">{t("s4.micNote")}</span>
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={interrupt}
                className="flex flex-col gap-0.5 rounded-2xl border border-ember/60 bg-ember/10 px-4 py-2 text-left transition hover:bg-ember/20"
              >
                <span className="text-[12px] font-medium">✋ {t("s4.stop")}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-dim">{t("s4.stopNote")}</span>
              </button>
              <button
                onClick={interrupt}
                className="flex flex-col gap-0.5 rounded-2xl border border-line bg-bg/60 px-4 py-2 text-left transition hover:border-ember/60"
              >
                <span className="text-[12px] font-medium">⏹ {t("s4.sayStop")}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-dim">{t("s4.sayStopNote")}</span>
              </button>
            </div>
          )}
          {(phase === "done" || phase === "stopped") && (
            <button onClick={reset} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim hover:text-hud">
              ↻ {t("s4.reset")}
            </button>
          )}
        </div>
      </div>

      {/* Right: narration */}
      <div className="flex flex-col gap-4 border-t border-line bg-bg-soft/30 p-6 lg:border-l lg:border-t-0 lg:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-hud">{t("demo.right")}</p>

        <AnimatePresence>
          {(phase === "speaking" || lines.length > 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-line bg-bg/40 px-4 py-3"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim">{t("s4.you")}</p>
              <p className="mt-1 text-[13px]">{t("s4.youText")}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="min-h-[160px] rounded-xl border border-line bg-bg/40 p-4">
          <NarrationStream lines={lines} strikes={strikes} />
        </div>
      </div>
    </div>
  );
}
