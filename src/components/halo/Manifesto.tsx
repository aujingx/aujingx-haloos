import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";

export function Manifesto() {
  const { t } = useT();
  const lines = [t("manifesto.l1"), t("manifesto.l2"), t("manifesto.l3")];
  return (
    <section className="relative py-44">
      <div className="mx-auto max-w-5xl px-6">
        {lines.map((l, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0.1, y: 20 }}
            whileInView={{ opacity: i === lines.length - 1 ? 1 : 0.55, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.9, delay: i * 0.15 }}
            className="text-balance text-3xl font-light leading-[1.2] tracking-tight sm:text-5xl md:text-6xl"
          >
            {l}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
