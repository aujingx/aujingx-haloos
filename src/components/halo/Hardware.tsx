import { motion } from "framer-motion";
import glassesImg from "@/assets/product-glasses.jpg";
import earbudsImg from "@/assets/product-earbuds.jpg";
import { useT } from "@/lib/i18n";

export function Hardware() {
  const { t } = useT();
  return (
    <section id="hardware" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-hud">{t("hw.eyebrow")}</p>
            <h2 className="mt-3 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              {t("hw.title1")}<br />{t("hw.title2")}
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-dim">{t("hw.body")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ProductCard
            image={glassesImg}
            tag={t("hw.glasses.tag")}
            title={t("hw.glasses.title")}
            gen={t("hw.gen")}
            specs={[
              { k: t("hw.g1k"), v: t("hw.g1v") },
              { k: t("hw.g2k"), v: t("hw.g2v") },
              { k: t("hw.g3k"), v: t("hw.g3v") },
              { k: t("hw.g4k"), v: t("hw.g4v") },
              { k: t("hw.g5k"), v: t("hw.g5v") },
            ]}
          />
          <ProductCard
            image={earbudsImg}
            tag={t("hw.buds.tag")}
            title={t("hw.buds.title")}
            gen={t("hw.gen")}
            specs={[
              { k: t("hw.b1k"), v: t("hw.b1v") },
              { k: t("hw.b2k"), v: t("hw.b2v") },
              { k: t("hw.b3k"), v: t("hw.b3v") },
              { k: t("hw.b4k"), v: t("hw.b4v") },
              { k: t("hw.b5k"), v: t("hw.b5v") },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function ProductCard({ image, tag, title, gen, specs }: { image: string; tag: string; title: string; gen: string; specs: { k: string; v: string }[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8 }}
      className="group relative overflow-hidden rounded-3xl border border-line bg-bg-soft"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
      </div>
      <div className="p-7">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-hud">{tag}</p>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">{gen}</span>
        </div>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h3>

        <dl className="mt-6 grid grid-cols-1 gap-y-3 border-t border-line pt-5 sm:grid-cols-2 sm:gap-x-8">
          {specs.map((s) => (
            <div key={s.k} className="flex items-baseline justify-between gap-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">{s.k}</dt>
              <dd className="text-right text-xs">{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </motion.div>
  );
}
