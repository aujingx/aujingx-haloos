import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { ScenePresence } from "./ScenePresence";
import { SceneTrigger } from "./SceneTrigger";
import { SceneEmergence } from "./SceneEmergence";
import { SceneAction } from "./SceneAction";
import { SceneMultiAgent } from "./SceneMultiAgent";

type SceneId = "presence" | "trigger" | "emergence" | "action" | "multi";

const ORDER: SceneId[] = ["presence", "trigger", "emergence", "action", "multi"];
const NUM: Record<SceneId, string> = {
  presence: "01", trigger: "02", emergence: "03", action: "04", multi: "05",
};
const ANCHOR: Record<SceneId, string> = {
  presence: "scene-presence",
  trigger: "scene-trigger",
  emergence: "scene-emergence",
  action: "scene-action",
  multi: "scene-multi",
};
const LABEL: Record<SceneId, string> = {
  presence: "s1.label",
  trigger: "s2.label",
  emergence: "s3.label",
  action: "s4.label",
  multi: "s5.label",
};

export function DemoStage() {
  const { t } = useT();
  const [scene, setScene] = useState<SceneId>("presence");

  return (
    <section id="demo" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Anchors for FiveQuestions deep links */}
        {ORDER.map((id) => (
          <div key={id} id={ANCHOR[id]} className="relative -top-24" />
        ))}

        {/* Compact scene picker — first, so the stage takes the eye */}
        <div className="mb-5 flex flex-wrap items-center gap-1.5">
          {ORDER.map((id) => (
            <button
              key={id}
              onClick={() => setScene(id)}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12px] transition ${
                scene === id
                  ? "border-hud/60 bg-hud/10 text-ink"
                  : "border-line text-ink-dim hover:text-ink"
              }`}
            >
              <span className="font-mono text-[10px] tracking-[0.2em] opacity-70">{NUM[id]}</span>
              <span>{t(LABEL[id])}</span>
            </button>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-[24px] border border-line bg-bg">
          <AnimatePresence mode="wait">
            <motion.div
              key={scene}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="min-h-[560px]"
            >
              {scene === "presence" && <ScenePresence />}
              {scene === "trigger" && <SceneTrigger />}
              {scene === "emergence" && <SceneEmergence />}
              {scene === "action" && <SceneAction />}
              {scene === "multi" && <SceneMultiAgent />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
