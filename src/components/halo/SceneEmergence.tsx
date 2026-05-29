import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { AIStatusOrb } from "./AIStatusOrb";
import { RoomStage, UserOnSofa } from "./RoomStage";
import { AgentRobot, type RobotState } from "./AgentRobot";

type Surface = "none" | "glasses" | "watch";
type EventId = "m1" | "m2" | "filtered";

const schedule: { id: EventId; at: number; duration: number }[] = [
  { id: "m1", at: 1500, duration: 4000 },
  { id: "m2", at: 7000, duration: 4500 },
  { id: "filtered", at: 13000, duration: 99000 },
];

const ROBOT = { x: 600, y: 410 };
const USER = { x: 210, y: 330 };
const DOOR = { x: 105, y: 180 };

export function SceneEmergence() {
  const { t } = useT();
  const [surface, setSurface] = useState<Surface>("none");
  const [t0, setT0] = useState<number | null>(null);
  const [active, setActive] = useState<Record<EventId, boolean>>({ m1: false, m2: false, filtered: false });
  const [elapsed, setElapsed] = useState(0);
  const raf = useRef<number | null>(null);

  const play = () => {
    setActive({ m1: false, m2: false, filtered: false });
    setT0(performance.now());
    setElapsed(0);
  };

  useEffect(() => {
    if (t0 == null) return;
    const tick = (now: number) => {
      const e = now - t0;
      setElapsed(e);
      const next: Record<EventId, boolean> = { m1: false, m2: false, filtered: false };
      for (const s of schedule) {
        if (e >= s.at && e < s.at + s.duration) next[s.id] = true;
      }
      setActive(next);
      if (e < 18000) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [t0]);

  // Robot behavior depends on surface + message
  const robotState: RobotState = (() => {
    if (surface !== "none") return active.m1 || active.m2 ? "listening" : "idle";
    // No device → robot is the channel: glows + turns when delivering
    if (active.m1 || active.m2) return "acting";
    return "idle";
  })();

  const lookAt = surface === "none" && active.m1 ? DOOR : surface === "none" && active.m2 ? USER : null;

  // For glasses surface, fade halo on robot when message is on glasses
  const robotHalo = surface === "none" && (active.m1 || active.m2);

  return (
    <div className="relative h-[560px] w-full">
      <RoomStage
        svgOverlay={
          <>
            <UserOnSofa active={t0 != null} />

            {/* Glow halo behind robot — only the "no device" surface uses light to notify */}
            {robotHalo && (
              <motion.circle
                cx={ROBOT.x}
                cy={ROBOT.y - 15}
                r={50}
                fill="none"
                stroke="color-mix(in oklab, var(--hud) 80%, transparent)"
                strokeWidth="1.5"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0.3, 0.85, 0.3], scale: [0.85, 1.15, 0.85] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.2, repeat: Infinity }}
                style={{ filter: "drop-shadow(0 0 16px var(--hud))", transformOrigin: `${ROBOT.x}px ${ROBOT.y - 15}px` }}
              />
            )}

            <AgentRobot
              x={ROBOT.x}
              y={ROBOT.y}
              state={robotState}
              lookAt={lookAt}
              showSightLine={!!lookAt && surface === "none"}
            />

            {/* Sound wave from robot when speaking (no-device surface only) */}
            {surface === "none" && active.m2 && (
              <g>
                {[0, 1, 2].map((i) => (
                  <motion.circle
                    key={i}
                    cx={ROBOT.x}
                    cy={ROBOT.y - 30}
                    r={10 + i * 8}
                    fill="none"
                    stroke="color-mix(in oklab, var(--hud) 50%, transparent)"
                    strokeWidth="0.8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </g>
            )}
          </>
        }
      />

      <div className="absolute left-5 top-5 z-20">
        <AIStatusOrb state={Object.values(active).some(Boolean) ? "acting" : "idle"} />
      </div>

      {/* Surface picker */}
      <div className="absolute right-5 top-5 z-20 flex flex-col items-end gap-1.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink-dim">{t("s3.hint")}</span>
        <div className="flex gap-1.5 rounded-full border border-line bg-bg/80 p-1 backdrop-blur">
          {(["none", "glasses", "watch"] as Surface[]).map((s) => (
            <button
              key={s}
              onClick={() => setSurface(s)}
              className={`rounded-full px-3 py-1 text-[11px] transition ${
                surface === s ? "bg-hud/20 text-ink" : "text-ink-dim hover:text-ink"
              }`}
            >
              {s === "none" && "○"} {s === "glasses" && "👓"} {s === "watch" && "⌚"} {t(`s3.surface.${s}`)}
            </button>
          ))}
        </div>
        <span className="max-w-[260px] text-right text-[11px] leading-snug text-ink-dim">
          {surface === "none" ? t("s3.none.idle") : surface === "glasses" ? t("s3.glasses.idle") : t("s3.watch.idle")}
        </span>
      </div>

      {/* Surface-specific overlays */}
      {/* Glasses: card at the edge of vision (top-left quadrant) */}
      {surface === "glasses" && (
        <div className="pointer-events-none absolute inset-0 z-10">
          {/* Subtle frame to suggest field-of-view edge */}
          <div className="absolute inset-6 rounded-[20px] border border-hud/15" />
          <div className="absolute left-3 top-3 font-mono text-[10px] tracking-[0.2em] text-ink-dim/70">
            👓 POV
          </div>
          <AnimatePresence>
            {active.m1 && (
              <GlassesCard key="g1" text={t("s3.m1.glasses")} delay={0} />
            )}
            {active.m2 && (
              <GlassesCard key="g2" text={t("s3.m2.glasses")} delay={0} />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Watch: bottom-right device with text */}
      {surface === "watch" && (
        <div className="pointer-events-none absolute bottom-24 right-8 z-10">
          <AnimatePresence>
            {(active.m1 || active.m2) && (
              <WatchFace key={active.m1 ? "w1" : "w2"} text={active.m1 ? t("s3.m1.watch") : t("s3.m2.watch")} />
            )}
            {!active.m1 && !active.m2 && t0 != null && (
              <WatchFace key="idle" text="" />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* No device: caption near robot */}
      {surface === "none" && (
        <AnimatePresence>
          {(active.m1 || active.m2) && (
            <motion.div
              key={active.m1 ? "n1" : "n2"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute z-10 max-w-[240px] text-[12px] leading-relaxed text-ink"
              style={{
                right: "6%",
                top: "50%",
              }}
            >
              {active.m1 ? t("s3.none.m1") : t("s3.none.m2")}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Filtered indicator — same across surfaces */}
      <AnimatePresence>
        {active.filtered && (
          <motion.div
            key="filt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-20 left-5 z-10 flex items-center gap-2 rounded-full bg-bg/65 px-3 py-1.5 text-[11px] text-ink-dim backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-ink-dim" />
            {t("s3.m3.note")}
          </motion.div>
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

function GlassesCard({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: [0, 0.95, 0.95, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3.6, times: [0, 0.15, 0.7, 1], delay }}
      className="absolute right-12 top-16 rounded-xl border border-hud/30 bg-bg/40 px-4 py-2.5 backdrop-blur-md"
      style={{ boxShadow: "0 0 30px color-mix(in oklab, var(--hud) 20%, transparent)" }}
    >
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-hud/70">notify</div>
      <div className="mt-0.5 text-[13px] text-ink">{text}</div>
    </motion.div>
  );
}

function WatchFace({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative"
    >
      {/* Watch body */}
      <div
        className="flex h-[120px] w-[110px] flex-col items-center justify-center rounded-3xl border border-line bg-bg p-3 text-center"
        style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.4), inset 0 0 0 2px color-mix(in oklab, var(--hud) 10%, transparent)" }}
      >
        {text ? (
          <>
            <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-hud">notify</div>
            <div className="mt-1 text-[12px] leading-tight text-ink">{text}</div>
          </>
        ) : (
          <div className="font-mono text-[18px] text-ink-dim">9:41</div>
        )}
      </div>
      {/* Haptic ripple when text shows */}
      {text && (
        <>
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-3xl border border-hud/40"
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: 1.25, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </>
      )}
      {/* Wrist strap suggestion */}
      <div className="absolute -bottom-3 left-1/2 h-3 w-16 -translate-x-1/2 rounded-b-lg bg-bg-soft" />
      <div className="absolute -top-3 left-1/2 h-3 w-16 -translate-x-1/2 rounded-t-lg bg-bg-soft" />
    </motion.div>
  );
}
