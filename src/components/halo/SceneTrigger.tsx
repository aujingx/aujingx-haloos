import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { AIStatusOrb, type OrbState } from "./AIStatusOrb";
import homeScene from "@/assets/home-scene.jpg";

type Mode = "say" | "hint" | "idle";

export function SceneTrigger() {
  const { t } = useT();
  const [mode, setMode] = useState<Mode>("say");
  const [softVisible, setSoftVisible] = useState(true);

  useEffect(() => {
    if (mode !== "hint") return;
    setSoftVisible(true);
    const id = window.setTimeout(() => setSoftVisible(false), 3500);
    return () => window.clearTimeout(id);
  }, [mode]);

  const orb: OrbState = mode === "say" ? "acting" : mode === "hint" ? "thinking" : "idle";

  return (
    <div className="flex min-h-[520px] flex-col lg:flex-row">
      {/* Left: user side */}
      <div className="relative min-h-[460px] overflow-hidden border-b border-line bg-bg-soft/20 lg:border-b-0">
        <img src={homeScene} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40" width={1536} height={896} />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />

        <div className="absolute left-4 top-4">
          <AIStatusOrb state={orb} />
        </div>

        {/* Mode selector pinned mid */}
        <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-dim">{t("demo.left")}</p>
          {(["say", "hint", "idle"] as Mode[]).map((m, i) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`group flex w-full flex-col rounded-2xl border px-4 py-3 text-left transition ${
                mode === m
                  ? "border-hud/60 bg-hud/10"
                  : "border-line bg-bg/40 hover:border-ink-dim"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-hud">0{i + 1}</span>
                <span className="text-sm font-medium">{t(`s2.mode${i + 1}`)}</span>
              </div>
              <span className="mt-1 text-[12px] text-ink-dim">{t(`s2.mode${i + 1}d`)}</span>
            </button>
          ))}
        </div>

        {/* Soft inline prompt in mode 2 */}
        <AnimatePresence>
          {mode === "hint" && softVisible && (
            <motion.div
              key="soft"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-full border border-hud/40 bg-bg/80 px-4 py-2.5 backdrop-blur"
            >
              <span className="text-sm">{t("s2.r2q")}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim">⏱ 3s</span>
            </motion.div>
          )}
          {mode === "idle" && (
            <motion.div
              key="silent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-6 bottom-6 flex items-center justify-between gap-3 rounded-xl border border-line bg-bg/70 px-3 py-2 backdrop-blur"
            >
              <span className="text-[12px] text-ink-dim">{t("s2.r3sub")}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: agent side */}
      <div className="flex flex-col gap-5 border-t border-line bg-bg-soft/30 p-6 lg:border-l lg:border-t-0 lg:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-hud">{t("demo.right")}</p>

        <AnimatePresence mode="wait">
          {mode === "say" && (
            <motion.div key="say" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="rounded-2xl border border-hud/40 bg-hud/5 px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-hud">→ {t("orb.acting")}</p>
                <p className="mt-2 text-base">{t("s2.r1")}</p>
              </div>
              <p className="text-[12px] text-ink-dim">{t("s2.r1note")}</p>
            </motion.div>
          )}
          {mode === "hint" && (
            <motion.div key="hint" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="rounded-2xl border border-line bg-bg/40 px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ember">≈ {t("orb.thinking")}</p>
                <p className="mt-2 text-base">{t("s2.r2q")}</p>
                <p className="mt-2 text-[12px] text-ink-dim">{t("s2.r2hint")}</p>
              </div>
              <p className="text-[12px] text-ink-dim">{t("s2.r2note")}</p>
            </motion.div>
          )}
          {mode === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="rounded-2xl border border-line bg-bg/40 px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim">∅ {t("orb.idle")}</p>
                <p className="mt-2 text-base text-ink-dim">{t("s2.r3")}</p>
                <p className="mt-3 rounded-lg border border-line bg-bg/40 px-3 py-2 text-[12px]">{t("s2.r3sub")}</p>
              </div>
              <p className="text-[12px] text-ink-dim">{t("s2.r3note")}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
