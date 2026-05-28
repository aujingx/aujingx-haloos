import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { AIStatusOrb, type OrbState } from "./AIStatusOrb";
import { RoomStage, UserOnSofa } from "./RoomStage";
import { AgentRobot, type RobotState } from "./AgentRobot";

type Case = "said" | "hinted" | "nothing";

const ROBOT = { x: 600, y: 410 };
const USER = { x: 210, y: 330 };
const WINDOW = { x: 630, y: 140 };

export function SceneTrigger() {
  const { t } = useT();
  const [c, setC] = useState<Case>("said");
  const [softVisible, setSoftVisible] = useState(true);
  const [windowClosing, setWindowClosing] = useState(false);

  useEffect(() => {
    if (c !== "hinted") return;
    setSoftVisible(true);
    const id = window.setTimeout(() => setSoftVisible(false), 3500);
    return () => window.clearTimeout(id);
  }, [c]);

  useEffect(() => {
    if (c !== "said") { setWindowClosing(false); return; }
    setWindowClosing(false);
    const id = window.setTimeout(() => setWindowClosing(true), 1200);
    return () => window.clearTimeout(id);
  }, [c]);

  const orb: OrbState = c === "said" ? "acting" : c === "hinted" ? "thinking" : "idle";
  const robotState: RobotState = c === "said" ? "acting" : c === "hinted" ? "thinking" : "idle";

  const lookAt =
    c === "said" ? WINDOW :
    c === "hinted" ? USER :
    null;

  return (
    <div className="relative h-[560px] w-full">
      <RoomStage
        highlight={c === "said" ? { x: WINDOW.x / 800, y: WINDOW.y / 500 } : null}
        svgOverlay={
          <>
            <UserOnSofa active={c !== "nothing"} />
            <AgentRobot
              x={ROBOT.x}
              y={ROBOT.y}
              state={robotState}
              lookAt={lookAt}
              showSightLine={c === "said"}
            />

            {/* Dispatch line: robot → window (smart-home command). The robot doesn't move; it tells the window. */}
            {c === "said" && (
              <>
                <motion.path
                  d={`M ${ROBOT.x} ${ROBOT.y - 30} Q ${(ROBOT.x + WINDOW.x) / 2 + 30} ${(ROBOT.y + WINDOW.y) / 2 - 60} ${WINDOW.x} ${WINDOW.y + 30}`}
                  fill="none"
                  stroke="var(--hud)"
                  strokeWidth="1.4"
                  strokeDasharray="3 5"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: [0.4, 0.9, 0.55], pathLength: 1 }}
                  transition={{ pathLength: { duration: 0.9 }, opacity: { duration: 2, repeat: Infinity } }}
                  style={{ filter: "drop-shadow(0 0 6px var(--hud))" }}
                />
                {/* tiny "smart-home" tag on the line */}
                <g>
                  <rect
                    x={(ROBOT.x + WINDOW.x) / 2 - 38}
                    y={(ROBOT.y + WINDOW.y) / 2 - 70}
                    width="76" height="18" rx="9"
                    fill="color-mix(in oklab, var(--bg) 90%, transparent)"
                    stroke="color-mix(in oklab, var(--hud) 50%, transparent)"
                    strokeWidth="0.8"
                  />
                  <text
                    x={(ROBOT.x + WINDOW.x) / 2} y={(ROBOT.y + WINDOW.y) / 2 - 57}
                    textAnchor="middle" fill="var(--hud)"
                    fontSize="9" fontFamily="ui-monospace, monospace"
                    style={{ letterSpacing: "0.15em" }}
                  >
                    SMART HOME →
                  </text>
                </g>
                {/* Window "closing" overlay */}
                <motion.rect
                  x="540" y="60" width="180" height={windowClosing ? 160 : 0}
                  fill="color-mix(in oklab, var(--hud) 18%, var(--bg))"
                  stroke="var(--hud)" strokeWidth="1.2"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: windowClosing ? 160 : 0, opacity: windowClosing ? 0.55 : 0 }}
                  transition={{ duration: 1.4, ease: "easeInOut" }}
                />
              </>
            )}
          </>
        }
      />

      <div className="absolute left-5 top-5 z-20">
        <AIStatusOrb state={orb} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-20 z-10 flex justify-center px-6">
        <AnimatePresence mode="wait">
          {c === "said" && (
            <motion.div
              key="said"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1 rounded-2xl bg-bg/85 px-5 py-3 text-center backdrop-blur"
            >
              <span className="text-[15px]">{t("s2.r1")}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">{t("s2.r1note")}</span>
            </motion.div>
          )}
          {c === "hinted" && softVisible && (
            <motion.div
              key="hinted"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="rounded-full border border-hud/40 bg-bg/85 px-5 py-2.5 text-[14px] backdrop-blur"
            >
              {t("s2.r2q")}
              <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">3s</span>
            </motion.div>
          )}
          {c === "nothing" && (
            <motion.div
              key="nothing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl bg-bg/70 px-4 py-2 text-[12px] text-ink-dim backdrop-blur"
            >
              {t("s2.r3sub")} · <button className="text-hud underline-offset-2 hover:underline">{t("s2.r3undo")}</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center gap-2 px-6">
        {(["said", "hinted", "nothing"] as Case[]).map((id) => (
          <button
            key={id}
            onClick={() => setC(id)}
            className={`rounded-full border px-4 py-2 text-[12px] backdrop-blur transition ${
              c === id
                ? "border-hud/60 bg-hud/15 text-ink"
                : "border-line bg-bg/65 text-ink-dim hover:border-ink-dim hover:text-ink"
            }`}
          >
            {t(`s2.case${id === "said" ? 1 : id === "hinted" ? 2 : 3}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
