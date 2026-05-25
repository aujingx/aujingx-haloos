import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";

const ids = ["q1", "q2", "q3", "q4", "q5"] as const;
const anchors: Record<typeof ids[number], string> = {
  q1: "scene-presence",
  q2: "scene-trigger",
  q3: "scene-emergence",
  q4: "scene-action",
  q5: "scene-multi",
};
const nums = ["01", "02", "03", "04", "05"];

export function FiveQuestions() {
  const { t } = useT();
  return (
    <section id="five" className="relative border-t border-line py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-hud">{t("fq.eyebrow")}</p>
        <h2 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          {t("fq.title")}
        </h2>

        <div className="mt-12 grid gap-3 md:grid-cols-5">
          {ids.map((id, i) => (
            <motion.a
              key={id}
              href={`#${anchors[id]}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="group relative flex flex-col rounded-2xl border border-line bg-bg-soft/40 p-5 backdrop-blur transition hover:border-hud/40"
            >
              <span className="font-mono text-[10px] tracking-[0.3em] text-hud">{nums[i]}</span>
              <h3 className="mt-4 text-lg font-semibold">{t(`fq.${id}.t`)}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">{t(`fq.${id}.b`)}</p>
              <span className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim transition group-hover:text-hud">
                ↓ {t("demo.answer")}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
