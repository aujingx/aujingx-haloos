import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { AIStatusOrb } from "./AIStatusOrb";
import { RoomStage, UserOnSofa } from "./RoomStage";
import { AgentRobot, type RobotState } from "./AgentRobot";
import { PerceptionChannels, VoiceBubble, type Channel } from "./PerceptionChannels";

const ROBOT = { x: 600, y: 410 };
const USER = { x: 210, y: 330 };

export function ScenePresence() {
  const { t } = useT();
  const [channel, setChannel] = useState<Channel | null>(null);

  const trigger = (ch: Channel) => {
    setChannel(ch);
    window.setTimeout(() => setChannel(null), 2600);
  };

  const robotState: RobotState =
    channel === "vision" ? "listening" :
    channel === "voice" ? "listening" :
    channel === "gesture" ? "thinking" :
    "idle";

  const orbState =
    channel ? "listening" : "idle";

  const captionKey =
    channel === "vision" ? "s1.cap.vision" :
    channel === "voice" ? "s1.cap.voice" :
    channel === "gesture" ? "s1.cap.gesture" :
    "s1.cap.idle";

  return (
    <div className="relative h-[560px] w-full">
      <RoomStage
        highlight={channel ? { x: USER.x / 800, y: USER.y / 500 } : null}
        svgOverlay={
          <>
            <UserOnSofa active={!!channel} />
            <AgentRobot
              x={ROBOT.x}
              y={ROBOT.y}
              state={robotState}
              lookAt={channel ? USER : null}
              showSightLine={channel === "vision"}
            />
            {channel === "voice" && (
              <VoiceBubble x={USER.x} y={USER.y - 30} text={t("s1.voiceText")} />
            )}
            {channel === "gesture" && (
              <motion.g
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <text x={USER.x + 22} y={USER.y - 30} fontSize="22">✋</text>
              </motion.g>
            )}
          </>
        }
      />

      {/* Orb top-left */}
      <div className="absolute left-5 top-5 z-20">
        <AIStatusOrb state={orbState} />
      </div>

      {/* Perception channels top-right */}
      <div className="absolute right-5 top-5 z-20">
        <PerceptionChannels
          active={channel}
          labels={{
            vision: t("s1.ch.vision"),
            voice: t("s1.ch.voice"),
            gesture: t("s1.ch.gesture"),
          }}
        />
      </div>

      {/* Caption bottom-center */}
      <div className="pointer-events-none absolute inset-x-0 bottom-24 z-10 flex justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={captionKey}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-full bg-bg/75 px-4 py-1.5 text-[13px] text-ink backdrop-blur"
          >
            {t(captionKey)}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Action pills — bottom */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim">
          {t("s1.hint")}
        </p>
        <div className="flex gap-2">
          {([
            ["vision", "s1.try.look"],
            ["voice", "s1.try.speak"],
            ["gesture", "s1.try.wave"],
          ] as [Channel, string][]).map(([ch, key]) => (
            <button
              key={ch}
              onClick={() => trigger(ch)}
              className={`rounded-full border px-4 py-1.5 text-[12px] backdrop-blur transition ${
                channel === ch
                  ? "border-hud/70 bg-hud/15 text-ink"
                  : "border-line bg-bg/65 text-ink-dim hover:border-ink-dim hover:text-ink"
              }`}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
