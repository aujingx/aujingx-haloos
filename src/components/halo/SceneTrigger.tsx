import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { AIStatusOrb, type OrbState } from "./AIStatusOrb";
import homeScene from "@/assets/home-scene.jpg";

type Case = "said" | "hinted" | "nothing";

export function SceneTrigger() {
  const { t } = useT();
  const [c, setC] = useState<Case>("said");
  const [softVisible, setSoftVisible] = useState(true);

  useEffect(() => {
    if (c !== "hinted") return;
    setSoftVisible(true);
    const id = window.setTimeout(() => setSoftVisible(false), 3500);
    return () => window.clearTimeout(id);
  }, [c]);

  const orb: OrbState = c === "said" ? "acting" : c === "hinted" ? "thinking" : "idle";

  return (
    <div className="relative h-[560px] w-full overflow-hidden">
      <img src={homeScene} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" width={1536} height={896} />
      <div className="absolute inset-0 bg-bg/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />

      {/* corner orb */}
      <div className="absolute left-5 top-5 z-20">
        <AIStatusOrb state={orb} />
      </div>

      {/* Agent voice — overlaid in the field of view */}
      <div className="pointer-events-none absolute inset-x-0 top-1/3 z-10 flex justify-center px-6">
        <AnimatePresence mode="wait">
          {c === "said" && (
            <motion.div
              key="said"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl bg-bg/80 px-5 py-3 text-center text-[15px] backdrop-blur"
            >
              {t("s2.r1")}
            </motion.div>
          )}
          {c === "hinted" && softVisible && (
            <motion.div
              key="hinted"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="rounded-full border border-hud/40 bg-bg/80 px-5 py-2.5 text-[14px] backdrop-blur"
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
              className="rounded-xl bg-bg/60 px-4 py-2 text-[12px] text-ink-dim backdrop-blur"
            >
              {t("s2.r3sub")} · <button className="text-hud underline-offset-2 hover:underline">{t("s2.r3undo")}</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* You did this — three pills along the bottom (no labels, just the scenario) */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center gap-2 px-6">
        {(["said", "hinted", "nothing"] as Case[]).map((id) => (
          <button
            key={id}
            onClick={() => setC(id)}
            className={`rounded-full border px-4 py-2 text-[12px] backdrop-blur transition ${
              c === id
                ? "border-hud/60 bg-hud/15 text-ink"
                : "border-line bg-bg/60 text-ink-dim hover:border-ink-dim hover:text-ink"
            }`}
          >
            {t(`s2.case${id === "said" ? 1 : id === "hinted" ? 2 : 3}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
