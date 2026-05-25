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

export function DemoStage() {
  const { t } = useT();
  const [scene, setScene] = useState<SceneId>("presence");

  const labelKey: Record<SceneId, string> = {
    presence: "s1.label",
    trigger: "s2.label",
    emergence: "s3.label",
    action: "s4.label",
    multi: "s5.label",
  };
  const capKey: Record<SceneId, string> = {
    presence: "s1.cap",
    trigger: "s2.cap",
    emergence: "s3.cap",
    action: "s4.cap",
    multi: "s5.cap",
  };
  const answerKey: Record<SceneId, string> = {
    presence: "s1.answer",
    trigger: "s2.answer",
    emergence: "s3.answer",
    action: "s4.answer",
    multi: "s5.answer",
  };

  return (
    <section id="demo" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-hud">{t("demo.eyebrow")}</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              {NUM[scene]} · {t(labelKey[scene])}
            </h2>
            <p className="mt-3 max-w-xl text-[14px] text-ink-dim">{t(capKey[scene])}</p>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-dim">
            {ORDER.indexOf(scene) + 1} / {ORDER.length}
          </div>
        </div>

        {/* anchors for FiveQuestions deep links */}
        {ORDER.map((id) => (
          <div key={id} id={ANCHOR[id]} className="relative -top-24" />
        ))}

        <div className="relative overflow-hidden rounded-[24px] border border-line bg-bg-soft/40">
          <AnimatePresence mode="wait">
            <motion.div
              key={scene}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="min-h-[520px]"
            >
              {scene === "presence" && <ScenePresence />}
              {scene === "trigger" && <SceneTrigger />}
              {scene === "emergence" && <SceneEmergence />}
              {scene === "action" && <SceneAction />}
              {scene === "multi" && <SceneMultiAgent />}
            </motion.div>
          </AnimatePresence>

          {/* Answer strip */}
          <div className="flex items-center gap-3 border-t border-line bg-bg/70 px-6 py-3 backdrop-blur">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-hud">{t("demo.answer")}</span>
            <span className="text-[13px] text-ink">{t(answerKey[scene])}</span>
          </div>
        </div>

        {/* Scene picker */}
        <div className="mt-6 flex flex-wrap gap-2">
          {ORDER.map((id) => (
            <button
              key={id}
              onClick={() => setScene(id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs transition ${
                scene === id
                  ? "border-hud/60 bg-hud/10 text-ink"
                  : "border-line text-ink-dim hover:text-ink"
              }`}
            >
              <span className="font-mono text-[10px] tracking-[0.2em]">{NUM[id]}</span>
              <span>{t(labelKey[id])}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
