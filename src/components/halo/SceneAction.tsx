import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { AIStatusOrb, type OrbState } from "./AIStatusOrb";
import { NarrationStream, type NarrationLine } from "./NarrationStream";
import { RoomStage, UserOnSofa } from "./RoomStage";
import { AgentRobot, type RobotState } from "./AgentRobot";

type Phase = "idle" | "speaking" | "confirm" | "scanning" | "signal" | "located" | "pointing" | "done" | "stopped";

// Stage positions
const HOME = { x: 700, y: 420 };
const SOFA_EDGE = { x: 280, y: 415 };
const PHONE = { x: 175, y: 360 }; // tucked under left cushion of sofa
const USER = { x: 210, y: 330 };

// Search zones (rectangles on stage)
const ZONES = [
  { id: "sofa", x: 70, y: 350, w: 300, h: 60 },
  { id: "table", x: 380, y: 395, w: 140, h: 30 },
  { id: "entry", x: 60, y: 80, w: 90, h: 200 },
  { id: "bedroom", x: 540, y: 60, w: 180, h: 160 },
] as const;

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

export function SceneAction() {
  const { t } = useT();
  const [phase, setPhase] = useState<Phase>("idle");
  const [robotPos, setRobotPos] = useState(HOME);
  const [lines, setLines] = useState<NarrationLine[]>([]);
  const [showRequest, setShowRequest] = useState(false);
  const [scanIdx, setScanIdx] = useState(-1);
  const [revealPhone, setRevealPhone] = useState(false);
  const timers = useRef<number[]>([]);
  const rafId = useRef<number | null>(null);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    if (rafId.current) cancelAnimationFrame(rafId.current);
  };
  const after = (ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };
  useEffect(() => () => clearTimers(), []);

  const reset = () => {
    clearTimers();
    setPhase("idle");
    setRobotPos(HOME);
    setLines([]);
    setShowRequest(false);
    setScanIdx(-1);
    setRevealPhone(false);
  };

  const animateTo = (target: { x: number; y: number }, duration: number, onDone?: () => void) => {
    const start = performance.now();
    const from = { ...robotPosRef.current };
    const tick = (now: number) => {
      const u = Math.min(1, (now - start) / duration);
      const pos = { x: lerp(from.x, target.x, u), y: lerp(from.y, target.y, u) };
      setRobotPos(pos);
      robotPosRef.current = pos;
      if (u < 1) rafId.current = requestAnimationFrame(tick);
      else onDone?.();
    };
    rafId.current = requestAnimationFrame(tick);
  };

  // Keep a ref for animation start positions
  const robotPosRef = useRef(HOME);
  useEffect(() => { robotPosRef.current = robotPos; }, [robotPos]);

  const run = () => {
    reset();
    setPhase("speaking");
    setShowRequest(true);
    after(1800, () => setShowRequest(false));

    after(700, () => {
      setPhase("confirm");
      setLines((l) => [...l, { id: "n1", text: t("s4.n1") }]);
    });

    after(1500, () => {
      setPhase("scanning");
      setLines((l) => [...l, { id: "n2", text: t("s4.n2") }]);
      // Sweep through zones
      [0, 1, 2, 3].forEach((i) => after(i * 600, () => setScanIdx(i)));
    });

    after(4200, () => {
      setScanIdx(-1);
      setPhase("signal");
      setLines((l) => [...l, { id: "n3", text: t("s4.n3") }]);
      animateTo(SOFA_EDGE, 1600);
    });

    after(6200, () => {
      setPhase("located");
      setLines((l) => [...l, { id: "n4", text: t("s4.n4") }]);
      setRevealPhone(true);
    });

    after(7400, () => {
      setPhase("pointing");
      setLines((l) => [...l, { id: "n5", text: t("s4.n5") }]);
    });

    after(8800, () => {
      setLines((l) => [...l, { id: "done", text: t("s4.done"), tone: "muted" }]);
      setPhase("done");
    });
  };

  const interrupt = () => {
    clearTimers();
    setPhase("stopped");
    setLines((l) => [...l, { id: "stop", text: t("s4.stopped"), tone: "warn" }]);
  };

  const orb: OrbState =
    phase === "speaking" ? "listening" :
    phase === "confirm" ? "thinking" :
    phase === "scanning" || phase === "signal" ? "acting" :
    phase === "located" || phase === "pointing" ? "acting" :
    phase === "done" ? "idle" :
    phase === "stopped" ? "handoff" : "idle";

  const robotState: RobotState =
    phase === "confirm" ? "thinking" :
    phase === "scanning" || phase === "signal" || phase === "pointing" || phase === "located" ? "acting" :
    phase === "stopped" ? "handoff" : "idle";

  const lookAt =
    phase === "located" || phase === "pointing" ? PHONE :
    phase === "signal" || phase === "scanning" ? PHONE :
    phase === "confirm" ? USER : null;

  return (
    <div className="relative h-[560px] w-full">
      <RoomStage
        svgOverlay={
          <>
            <UserOnSofa active={phase !== "idle"} />

            {/* Search zone sweeps */}
            {ZONES.map((z, i) => (
              <motion.rect
                key={z.id}
                x={z.x}
                y={z.y}
                width={z.w}
                height={z.h}
                rx="6"
                fill="none"
                stroke="color-mix(in oklab, var(--hud) 60%, transparent)"
                strokeWidth="1.2"
                strokeDasharray="3 4"
                initial={{ opacity: 0 }}
                animate={{ opacity: scanIdx === i ? [0.3, 0.9, 0.3] : 0 }}
                transition={{ duration: 0.6, repeat: scanIdx === i ? Infinity : 0 }}
              />
            ))}

            {/* Signal ping near sofa when "signal" phase */}
            {(phase === "signal" || phase === "located" || phase === "pointing") && (
              <g>
                {[0, 1, 2].map((i) => (
                  <motion.circle
                    key={i}
                    cx={PHONE.x}
                    cy={PHONE.y}
                    r={10 + i * 8}
                    fill="none"
                    stroke="color-mix(in oklab, var(--ember) 70%, transparent)"
                    strokeWidth="0.9"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.35 }}
                  />
                ))}
              </g>
            )}

            {/* Phone reveal (small rectangle peeking from under cushion) */}
            {revealPhone && (
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <rect
                  x={PHONE.x - 8}
                  y={PHONE.y - 12}
                  width="16"
                  height="24"
                  rx="3"
                  fill="color-mix(in oklab, var(--ink) 70%, var(--bg))"
                  stroke="var(--hud)"
                  strokeWidth="1.2"
                  style={{ filter: "drop-shadow(0 0 8px var(--hud))" }}
                />
                <rect x={PHONE.x - 5} y={PHONE.y - 9} width="10" height="14" rx="1" fill="color-mix(in oklab, var(--hud) 40%, var(--bg))" />
              </motion.g>
            )}

            {/* Light cone from robot to phone in "pointing" phase */}
            {phase === "pointing" && (
              <motion.polygon
                points={`${robotPos.x - 8},${robotPos.y - 30} ${robotPos.x + 8},${robotPos.y - 30} ${PHONE.x + 14},${PHONE.y + 8} ${PHONE.x - 14},${PHONE.y + 8}`}
                fill="color-mix(in oklab, var(--hud) 18%, transparent)"
                stroke="color-mix(in oklab, var(--hud) 45%, transparent)"
                strokeWidth="0.6"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            )}

            <AgentRobot
              x={robotPos.x}
              y={robotPos.y}
              state={robotState}
              lookAt={lookAt}
              scale={0.85}
              showSightLine={phase === "located" || phase === "pointing"}
            />
          </>
        }
      />

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

      {/* Narration — top-right of stage */}
      {lines.length > 0 && (
        <div className="absolute right-5 top-20 z-10 max-w-xs rounded-xl bg-bg/70 px-4 py-3 backdrop-blur">
          <NarrationStream lines={lines} />
        </div>
      )}

      {/* Zone labels — only when scanning */}
      <AnimatePresence>
        {phase === "scanning" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-[5]"
          >
            {ZONES.map((z, i) => (
              <div
                key={z.id}
                className="absolute font-mono text-[10px] uppercase tracking-[0.18em] transition"
                style={{
                  left: `${(z.x + z.w / 2) / 800 * 100}%`,
                  top: `${(z.y + z.h / 2) / 500 * 100}%`,
                  transform: "translate(-50%, -50%)",
                  color: scanIdx === i ? "var(--hud)" : "color-mix(in oklab, var(--ink-dim) 50%, transparent)",
                }}
              >
                {t(`s4.zone.${z.id}`)}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
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
