import { useT } from "@/lib/i18n";

export function TechSpecs() {
  const { t } = useT();
  const rows = [
    { k: t("ts.r1k"), v: t("ts.r1v") },
    { k: t("ts.r2k"), v: t("ts.r2v") },
    { k: t("ts.r3k"), v: t("ts.r3v") },
    { k: t("ts.r4k"), v: t("ts.r4v") },
    { k: t("ts.r5k"), v: t("ts.r5v") },
    { k: t("ts.r6k"), v: t("ts.r6v") },
  ];
  return (
    <section className="relative border-y border-line bg-bg-soft py-28">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-hud">{t("ts.eyebrow")}</p>
        <h2 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          {t("ts.title")}
        </h2>

        <dl className="mt-16 divide-y divide-line border-y border-line">
          {rows.map((r) => (
            <div key={r.k} className="grid grid-cols-12 gap-6 py-6">
              <dt className="col-span-12 font-mono text-[10px] uppercase tracking-[0.25em] text-hud md:col-span-3">{r.k}</dt>
              <dd className="col-span-12 text-lg md:col-span-9">{r.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
