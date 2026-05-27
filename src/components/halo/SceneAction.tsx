import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { AIStatusOrb, type OrbState } from "./AIStatusOrb";
import { NarrationStream, type NarrationLine } from "./NarrationStream";
import { RoomStage, UserOnSofa, StageObject } from "./RoomStage";
import { AgentRobot, type RobotState } from "./AgentRobot";

type Phase = "idle" | "speaking" | "thinking" | "moving" | "rerouting" | "delivering" | "done" | "stopped";

// Path waypoints
const HOME = { x: 700, y: 420 };
const VIA = { x: 540, y: 440 };
const CUP = { x: 450, y: 395 };
const HAND_RIGHT = { x: 270, y: 360 };
const HAND_LEFT = { x: 160, y: 360 };
const USER = { x: 210, y: 330 };

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function pointAt(path: { x: number; y: number }[], p: number) {
  // p ∈ [0, 1] along the polyline
  const segs = path.length - 1;
  const f = p * segs;
  const i = Math.min(segs - 1, Math.floor(f));
  const local = f - i;
  return { x: lerp(path[i].x, path[i + 1].x, local), y: lerp(path[i].y, path[i + 1].y, local) };
}

export function SceneAction() {
  const { t } = useT();
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [robotPos, setRobotPos] = useState(HOME);
  const [reroute, setReroute] = useState(false);
  const [handed, setHanded] = useState(false);
  const [lines, setLines] = useState<NarrationLine[]>([]);
  const [strikes, setStrikes] = useState<string[]>([]);
  const [showRequest, setShowRequest] = useState(false);
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
    setProgress(0);
    setRobotPos(HOME);
    setReroute(false);
    setHanded(false);
    setLines([]);
    setStrikes([]);
    setShowRequest(false);
  };

  const animatePath = (
    path: { x: number; y: number }[],
    duration: number,
    onDone?: () => void
  ) => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setRobotPos(pointAt(path, t));
      if (t < 1) rafId.current = requestAnimationFrame(tick);
      else onDone?.();
    };
    rafId.current = requestAnimationFrame(tick);
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
        animatePath([HOME, VIA, CUP], 2200, () => {
          setProgress(50);
        });
        const start = performance.now();
        const pTick = (now: number) => {
          const p = Math.min(50, ((now - start) / 2200) * 50);
          setProgress(p);
          if (p < 50) requestAnimationFrame(pTick);
        };
        requestAnimationFrame(pTick);
      });
      after(4200, () => {
        setStrikes((s) => [...s, "n4o"]);
        setLines((l) => [...l, { id: "n4n", text: t("s4.n4new"), tone: "warn" }]);
        setPhase("rerouting");
        setReroute(true);
        // Robot picks up cup and reroutes to user's left hand
        animatePath([CUP, { x: 320, y: 410 }, HAND_LEFT], 2400);
        const start = performance.now();
        const pTick = (now: number) => {
          const p = Math.min(90, 50 + ((now - start) / 2400) * 40);
          setProgress(p);
          if (p < 90) requestAnimationFrame(pTick);
        };
        requestAnimationFrame(pTick);
      });
      after(7200, () => {
        setLines((l) => [...l, { id: "n5", text: t("s4.n5") }]);
        setPhase("delivering");
        setProgress(100);
        setHanded(true);
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

  const robotState: RobotState =
    phase === "thinking" ? "thinking" :
    phase === "moving" || phase === "rerouting" || phase === "delivering" ? "acting" :
    phase === "stopped" ? "handoff" :
    "idle";

  // Robot looks at where it's going / what it's doing
  const lookAt =
    phase === "moving" ? CUP :
    phase === "rerouting" || phase === "delivering" ? USER :
    phase === "thinking" ? USER :
    null;

  // Path preview (current planned route)
  const plannedPath =
    phase === "idle" ? null :
    reroute ? [CUP, { x: 320, y: 410 }, HAND_LEFT] :
    [HOME, VIA, CUP];

  const pathD = plannedPath
    ? plannedPath.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
    : "";

  return (
    <div className="relative h-[560px] w-full">
      <RoomStage
        svgOverlay={
          <>
            <UserOnSofa active={phase !== "idle"} />
            {/* Cup on table (hides once robot picks it up after rerouting begins) */}
            {!reroute && (
              <StageObject x={CUP.x} y={CUP.y} highlighted={phase === "thinking" || phase === "moving"} label="cup" />
            )}
            {/* Planned path */}
            {pathD && (
              <motion.path
                d={pathD}
                fill="none"
                stroke={phase === "stopped" ? "var(--ember)" : "var(--hud)"}
                strokeWidth="1.5"
                strokeDasharray="4 5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.55 }}
                style={{ filter: `drop-shadow(0 0 6px ${phase === "stopped" ? "var(--ember)" : "var(--hud)"})` }}
              />
            )}
            <AgentRobot
              x={robotPos.x}
              y={robotPos.y}
              state={robotState}
              lookAt={lookAt}
              scale={0.85}
              showSightLine={!!lookAt}
            />
            {/* Cup in robot's "hand" while delivering */}
            {reroute && (
              <g>
                <rect
                  x={robotPos.x - 6}
                  y={robotPos.y - 35}
                  width="12"
                  height="14"
                  rx="2"
                  fill="color-mix(in oklab, var(--ink) 50%, var(--bg))"
                  stroke="var(--hud)"
                  strokeWidth="1"
                />
              </g>
            )}
            {/* Delivered cup near user */}
            {handed && (
              <StageObject x={HAND_LEFT.x + 10} y={HAND_LEFT.y - 10} highlighted={false} />
            )}
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
          <NarrationStream lines={lines} strikes={strikes} />
        </div>
      )}

      {/* Path progress bar */}
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
