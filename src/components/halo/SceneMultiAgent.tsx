import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { AIStatusOrb, type OrbState } from "./AIStatusOrb";
import { RoomStage, UserOnSofa } from "./RoomStage";
import { AgentRobot, type RobotState } from "./AgentRobot";

type NodeId = "glasses" | "home" | "car";

const steps: { node: NodeId; key: string; at: number; done: number }[] = [
  { node: "home", key: "s5.home1", at: 600, done: 2000 },
  { node: "car", key: "s5.car1", at: 800, done: 3200 },
  { node: "glasses", key: "s5.glasses1", at: 1100, done: 2400 },
  { node: "home", key: "s5.home2", at: 2400, done: 3800 },
  { node: "glasses", key: "s5.glasses2", at: 2900, done: 4200 },
  { node: "car", key: "s5.car2", at: 3500, done: 5400 },
];

const ROBOT = { x: 420, y: 410 };
const USER = { x: 210, y: 330 };

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
  const robotState: RobotState = t0 == null ? "idle" : elapsed < 5500 ? "acting" : "handoff";

  // Peer device positions (on stage, near robot)
  const PHONE = { x: 130, y: 130 };
  const CAR = { x: 680, y: 130 };

  return (
    <div className="relative h-[560px] w-full">
      <RoomStage
        svgOverlay={
          <>
            <UserOnSofa active={t0 != null} />
            {/* Robot center-stage */}
            <AgentRobot
              x={ROBOT.x}
              y={ROBOT.y}
              state={robotState}
              lookAt={lowBattery ? USER : null}
              showSightLine={lowBattery}
            />
            {/* Connection lines to peer devices */}
            {t0 != null && (
              <>
                <motion.line
                  x1={ROBOT.x} y1={ROBOT.y - 30}
                  x2={PHONE.x + 30} y2={PHONE.y + 25}
                  stroke="color-mix(in oklab, var(--hud) 50%, transparent)"
                  strokeWidth="1.2"
                  strokeDasharray="3 4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
                <motion.line
                  x1={ROBOT.x} y1={ROBOT.y - 30}
                  x2={CAR.x - 30} y2={CAR.y + 25}
                  stroke="color-mix(in oklab, var(--hud) 50%, transparent)"
                  strokeWidth="1.2"
                  strokeDasharray="3 4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: 0.3 }}
                />
              </>
            )}
            {/* Speech bubble from robot (one voice) */}
            <AnimatePresence>
              {lowBattery && (
                <motion.g
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <rect
                    x={ROBOT.x - 180}
                    y={ROBOT.y - 100}
                    width="360"
                    height="38"
                    rx="19"
                    fill="color-mix(in oklab, var(--bg) 92%, transparent)"
                    stroke="color-mix(in oklab, var(--ember) 60%, transparent)"
                    strokeWidth="1"
                  />
                  <text
                    x={ROBOT.x}
                    y={ROBOT.y - 76}
                    textAnchor="middle"
                    fill="var(--ink)"
                    fontSize="12"
                    fontFamily="ui-sans-serif, system-ui"
                  >
                    {t("s5.lowbat")}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </>
        }
      />

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

      {/* Peer device cards — positioned at the line endpoints */}
      <div
        className="absolute z-10 w-[180px]"
        style={{ left: `${(PHONE.x - 60) / 800 * 100}%`, top: `${(PHONE.y - 50) / 500 * 100}%` }}
      >
        <NodeCard
          label={t("s5.glasses")}
          steps={steps
            .filter((s) => s.node === "glasses")
            .map((s) => ({ text: t(s.key), started: elapsed >= s.at, done: elapsed >= s.done }))}
        />
      </div>
      <div
        className="absolute z-10 w-[180px]"
        style={{ right: `${(800 - CAR.x - 60) / 800 * 100}%`, top: `${(CAR.y - 50) / 500 * 100}%` }}
      >
        <NodeCard
          label={t("s5.car")}
          steps={steps
            .filter((s) => s.node === "car")
            .map((s) => ({ text: t(s.key), started: elapsed >= s.at, done: elapsed >= s.done }))}
        />
      </div>
      {/* Home robot label (small) below robot */}
      <div className="absolute inset-x-0 z-10 flex justify-center" style={{ top: `${(ROBOT.y + 50) / 500 * 100}%` }}>
        <div className="rounded-full bg-bg/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim backdrop-blur">
          {t("s5.home")}
        </div>
      </div>

      {/* Caveat under the bubble */}
      <AnimatePresence>
        {lowBattery && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 z-10 mx-auto w-fit max-w-md px-6 text-center text-[11px] text-ink-dim"
            style={{ bottom: "94px" }}
          >
            {t("s5.lowbatNote")}
          </motion.p>
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
    <div className="rounded-2xl border border-line bg-bg/80 p-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <motion.span
          className="h-2 w-2 rounded-full bg-hud"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <span className="text-[11px] tracking-wide text-ink-dim">{label}</span>
      </div>
      <ul className="mt-2 space-y-1 text-[11px]">
        {steps.map((s, i) => (
          <li key={i} className={`flex items-start gap-1.5 ${s.started ? "text-ink" : "text-ink-dim/45"}`}>
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
