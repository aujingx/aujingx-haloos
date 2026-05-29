import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { AIStatusOrb, type OrbState } from "./AIStatusOrb";
import { RoomStage, UserOnSofa } from "./RoomStage";
import { AgentRobot, type RobotState } from "./AgentRobot";

type NodeId = "car" | "safety" | "hvac" | "vacuum" | "docs" | "msg";

type Task = { text: string; startAt: number; doneAt: number; warn?: boolean };
type Node = {
  id: NodeId;
  icon: string;
  labelKey: string;
  pos: { x: number; y: number };
  tasks: (t: (k: string) => string) => Task[];
};

const ROBOT = { x: 400, y: 400 };

// Six peer nodes arranged around the robot
const NODES: Node[] = [
  {
    id: "car",
    icon: "🚗",
    labelKey: "s5.n.car",
    pos: { x: 80, y: 80 },
    tasks: (t) => [
      { text: t("s5.car.1"), startAt: 600, doneAt: 2600 },
      { text: t("s5.car.2"), startAt: 1200, doneAt: 3400 },
      { text: t("s5.car.3"), startAt: 2200, doneAt: 2200, warn: true },
    ],
  },
  {
    id: "safety",
    icon: "🔒",
    labelKey: "s5.n.safety",
    pos: { x: 400, y: 70 },
    tasks: (t) => [
      { text: t("s5.safety.1"), startAt: 1000, doneAt: 2400 },
      { text: t("s5.safety.2"), startAt: 1600, doneAt: 3000 },
    ],
  },
  {
    id: "hvac",
    icon: "❄",
    labelKey: "s5.n.hvac",
    pos: { x: 720, y: 80 },
    tasks: (t) => [
      { text: t("s5.hvac.1"), startAt: 800, doneAt: 2200 },
      { text: t("s5.hvac.2"), startAt: 1400, doneAt: 3000 },
    ],
  },
  {
    id: "vacuum",
    icon: "🤖",
    labelKey: "s5.n.vacuum",
    pos: { x: 80, y: 280 },
    tasks: (t) => [
      { text: t("s5.vacuum.1"), startAt: 700, doneAt: 1800 },
      { text: t("s5.vacuum.2"), startAt: 3600, doneAt: 5800 },
    ],
  },
  {
    id: "docs",
    icon: "📄",
    labelKey: "s5.n.docs",
    pos: { x: 720, y: 280 },
    tasks: (t) => [
      { text: t("s5.docs.1"), startAt: 800, doneAt: 2400 },
      { text: t("s5.docs.2"), startAt: 1600, doneAt: 3400 },
      { text: t("s5.docs.3"), startAt: 2800, doneAt: 2800, warn: true },
    ],
  },
  {
    id: "msg",
    icon: "💬",
    labelKey: "s5.n.msg",
    pos: { x: 720, y: 420 },
    tasks: (t) => [
      { text: t("s5.msg.1"), startAt: 1800, doneAt: 3200 },
      { text: t("s5.msg.2"), startAt: 4400, doneAt: 4400 },
    ],
  },
];

const RISK_AT = 5200;

export function SceneMultiAgent() {
  const { t } = useT();
  const [t0, setT0] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [riskAck, setRiskAck] = useState(false);
  const raf = useRef<number | null>(null);

  const play = () => {
    setT0(performance.now());
    setElapsed(0);
    setRiskAck(false);
  };

  useEffect(() => {
    if (t0 == null) return;
    const tick = (now: number) => {
      const e = now - t0;
      setElapsed(e);
      if (e < 9000) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [t0]);

  const showRisk = t0 != null && elapsed >= RISK_AT && !riskAck;

  const orb: OrbState =
    t0 == null ? "idle" :
    showRisk ? "handoff" :
    elapsed < 4500 ? "acting" : "acting";

  const robotState: RobotState =
    t0 == null ? "idle" :
    showRisk ? "handoff" : "acting";

  return (
    <div className="relative h-[640px] w-full">
      <RoomStage
        svgOverlay={
          <>
            <UserOnSofa active={t0 != null} />

            {/* Connection lines from robot to each active node */}
            {t0 != null && NODES.map((node) => {
              const hasStarted = node.tasks(t).some((task) => elapsed >= task.startAt);
              if (!hasStarted) return null;
              return (
                <motion.line
                  key={node.id}
                  x1={ROBOT.x}
                  y1={ROBOT.y - 30}
                  x2={node.pos.x}
                  y2={node.pos.y + 30}
                  stroke="color-mix(in oklab, var(--hud) 45%, transparent)"
                  strokeWidth="1.1"
                  strokeDasharray="3 5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.35, 0.8, 0.35] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              );
            })}

            <AgentRobot
              x={ROBOT.x}
              y={ROBOT.y}
              state={robotState}
              lookAt={showRisk ? { x: 210, y: 330 } : null}
              showSightLine={showRisk}
            />
          </>
        }
      />

      <div className="absolute left-5 top-5 z-20">
        <AIStatusOrb state={orb} />
      </div>

      {/* Your spoken request — floats briefly */}
      <AnimatePresence>
        {t0 != null && elapsed < 2800 && (
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

      {/* Node cards positioned over stage */}
      {NODES.map((node) => {
        const tasks = node.tasks(t);
        const active = t0 != null && tasks.some((task) => elapsed >= task.startAt);
        return (
          <div
            key={node.id}
            className="absolute z-10 w-[180px]"
            style={{
              left: `${(node.pos.x - 90) / 800 * 100}%`,
              top: `${(node.pos.y - 40) / 500 * 100}%`,
            }}
          >
            <NodeCard
              icon={node.icon}
              label={t(node.labelKey)}
              active={active}
              tasks={tasks.map((task) => ({
                text: task.text,
                started: t0 != null && elapsed >= task.startAt,
                done: t0 != null && elapsed >= task.doneAt && !task.warn,
                warn: task.warn && t0 != null && elapsed >= task.startAt,
              }))}
            />
          </div>
        );
      })}

      {/* Home robot label below robot */}
      <div
        className="absolute inset-x-0 z-10 flex justify-center"
        style={{ top: `${(ROBOT.y + 50) / 500 * 100}%` }}
      >
        <div className="rounded-full bg-bg/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim backdrop-blur">
          {t("orb.brand")}
        </div>
      </div>

      {/* Risk bubble — only thing that interrupts */}
      <AnimatePresence>
        {showRisk && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 z-30 w-[340px] -translate-x-1/2 rounded-2xl border border-ember/60 bg-bg/95 p-4 backdrop-blur"
            style={{ top: "44%", boxShadow: "0 12px 40px color-mix(in oklab, var(--ember) 25%, transparent)" }}
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-ember" style={{ boxShadow: "0 0 8px var(--ember)" }} />
              <span className="text-[12px] font-medium text-ink">{t("s5.risk.title")}</span>
            </div>
            <ul className="mt-3 space-y-1.5 text-[12px] text-ink-dim">
              <li className="flex gap-2"><span className="text-ember">·</span>{t("s5.risk.1")}</li>
              <li className="flex gap-2"><span className="text-ember">·</span>{t("s5.risk.2")}</li>
            </ul>
            <button
              onClick={() => setRiskAck(true)}
              className="mt-4 w-full rounded-full bg-ember/80 px-4 py-2 text-[12px] text-bg transition hover:bg-ember"
            >
              {t("s5.risk.ok")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tagline */}
      {t0 != null && (
        <p className="absolute inset-x-0 bottom-20 z-10 text-center text-[11px] text-ink-dim">
          {t("s5.tagline")}
        </p>
      )}

      {/* Bottom control */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center gap-3">
        {t0 == null ? (
          <button
            onClick={play}
            className="flex flex-col gap-0.5 rounded-2xl border border-hud/60 bg-hud/15 px-5 py-2.5 text-center backdrop-blur transition hover:bg-hud/20"
          >
            <span className="text-[13px]">🎤 {t("s5.play")}</span>
            <span className="text-[10px] text-ink-dim">{t("s5.mic")}</span>
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

function NodeCard({
  icon,
  label,
  active,
  tasks,
}: {
  icon: string;
  label: string;
  active: boolean;
  tasks: { text: string; started: boolean; done: boolean; warn?: boolean }[];
}) {
  return (
    <div className={`rounded-2xl border bg-bg/85 p-3 backdrop-blur transition ${active ? "border-hud/40" : "border-line"}`}>
      <div className="flex items-center gap-2">
        <span className="text-[14px]">{icon}</span>
        <span className="text-[11px] tracking-wide text-ink-dim">{label}</span>
        {active && (
          <motion.span
            className="ml-auto h-1.5 w-1.5 rounded-full bg-hud"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        )}
      </div>
      <ul className="mt-2 space-y-1 text-[11px]">
        {tasks.map((s, i) => (
          <li key={i} className={`flex items-start gap-1.5 ${s.started ? (s.warn ? "text-ember" : "text-ink") : "text-ink-dim/45"}`}>
            <span className={s.warn ? "text-ember" : s.done ? "text-hud" : s.started ? "text-ember" : "text-ink-dim/40"}>
              {s.warn ? "!" : s.done ? "✓" : s.started ? "◐" : "○"}
            </span>
            <span>{s.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
