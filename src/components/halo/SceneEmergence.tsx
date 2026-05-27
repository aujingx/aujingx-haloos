import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { AIStatusOrb } from "./AIStatusOrb";
import { RoomStage, UserOnSofa } from "./RoomStage";
import { AgentRobot, type RobotState } from "./AgentRobot";

type EventId = "boil" | "msg" | "pkg" | "filtered";

const schedule: { id: EventId; at: number; duration: number }[] = [
  { id: "boil", at: 1500, duration: 3500 },
  { id: "msg", at: 7000, duration: 3500 },
  { id: "filtered", at: 12000, duration: 99000 },
  { id: "pkg", at: 16000, duration: 4000 },
];

const ROBOT = { x: 600, y: 410 };
const USER = { x: 210, y: 330 };

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

  // Robot turns toward user when delivering a message
  const facingUser = active.msg || active.pkg;
  const robotState: RobotState = Object.values(active).some(Boolean) ? "acting" : "idle";

  // Active speech bubble content from robot
  const bubble =
    active.msg ? t("s3.t2") :
    active.pkg ? t("s3.t3") :
    active.boil ? t("s3.t1") :
    null;

  return (
    <div className="relative h-[560px] w-full">
      <RoomStage
        svgOverlay={
          <>
            <UserOnSofa active={facingUser} />
            <AgentRobot
              x={ROBOT.x}
              y={ROBOT.y}
              state={robotState}
              lookAt={facingUser ? USER : null}
              showSightLine={facingUser}
            />
            {/* Speech bubble from robot */}
            <AnimatePresence>
              {bubble && (
                <motion.g
                  key={bubble}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <rect
                    x={ROBOT.x - 130}
                    y={ROBOT.y - 90}
                    width="260"
                    height="34"
                    rx="17"
                    fill="color-mix(in oklab, var(--bg) 90%, transparent)"
                    stroke="color-mix(in oklab, var(--hud) 45%, transparent)"
                    strokeWidth="1"
                  />
                  <text
                    x={ROBOT.x}
                    y={ROBOT.y - 68}
                    textAnchor="middle"
                    fill="var(--ink)"
                    fontSize="13"
                    fontFamily="ui-sans-serif, system-ui"
                  >
                    {bubble}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </>
        }
      />

      <div className="absolute left-5 top-5 z-20">
        <AIStatusOrb state={Object.values(active).some(Boolean) ? "acting" : "idle"} />
      </div>

      {/* Filtered — faint chip top-right (the robot held it back) */}
      <AnimatePresence>
        {active.filtered && (
          <motion.button
            key="filt"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 0.7, x: 0 }}
            exit={{ opacity: 0 }}
            className="absolute right-5 top-5 z-20 flex items-center gap-2 rounded-full bg-bg/65 px-3 py-1.5 text-[11px] text-ink-dim backdrop-blur transition hover:opacity-100 hover:text-ink"
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
