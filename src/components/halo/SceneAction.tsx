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
  const [showRequest, setShowRequest] = useState(false);
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
    setShowRequest(false);
  };

  const run = () => {
    reset();
    setPhase("speaking");
    setShowRequest(true);
    after(2400, () => setShowRequest(false));
    after(900, () => {
      setPhase("thinking");
      setLines((l) => [...l, { id: "n1", text: t("s4.n1") }]);
      after(700, () => setLines((l) => [...l, { id: "n2", text: t("s4.n2") }]));
      after(1500, () => {
        setLines((l) => [...l, { id: "n3", text: t("s4.n3") }, { id: "n4o", text: t("s4.n4old") }]);
        setPhase("moving");
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(50, ((now - start) / 2200) * 50);
          setProgress(p);
          if (p < 50) requestAnimationFrame(tick);
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
    "idle";

  return (
    <div className="relative h-[560px] w-full overflow-hidden bg-bg">
      <img src={robotPov} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" width={1536} height={896} />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/35 to-bg/10" />

      <div className="absolute left-5 top-5 z-20">
        <AIStatusOrb state={orb} />
      </div>

      {/* Your spoken request — floats briefly */}
      <AnimatePresence>
        {showRequest && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 top-6 z-10 mx-auto w-fit max-w-md rounded-full bg-bg/85 px-5 py-2 text-center text-[13px] backdrop-blur"
          >
            {t("s4.youText")}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Narration — top-left of POV, like glasses HUD */}
      {lines.length > 0 && (
        <div className="absolute left-6 top-20 z-10 max-w-sm rounded-xl bg-bg/55 px-4 py-3 backdrop-blur">
          <NarrationStream lines={lines} strikes={strikes} />
        </div>
      )}

      {/* Path bar */}
      <div className="absolute inset-x-12 bottom-28 z-10">
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-line/60">
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

      {/* Controls — bottom */}
      <div className="absolute inset-x-6 bottom-6 z-10 flex flex-wrap items-end justify-between gap-3">
        {phase === "idle" || phase === "done" || phase === "stopped" ? (
          <button
            onClick={run}
            className="flex flex-col gap-0.5 rounded-2xl border border-hud/60 bg-hud/10 px-5 py-2.5 text-left backdrop-blur transition hover:bg-hud/20"
          >
            <span className="text-[13px]">🎤 {t("s4.mic")}</span>
            <span className="text-[10px] text-ink-dim">{t("s4.micNote")}</span>
          </button>
        ) : (
          <button
            onClick={interrupt}
            className="flex flex-col gap-0.5 rounded-2xl border border-ember/60 bg-ember/10 px-5 py-2.5 text-left backdrop-blur transition hover:bg-ember/20"
          >
            <span className="text-[13px]">✋ {t("s4.stop")}</span>
            <span className="text-[10px] text-ink-dim">{t("s4.stopNote")}</span>
          </button>
        )}
        {(phase === "done" || phase === "stopped") && (
          <button onClick={reset} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim hover:text-hud">
            ↻ {t("s4.reset")}
          </button>
        )}
      </div>
    </div>
  );
}
