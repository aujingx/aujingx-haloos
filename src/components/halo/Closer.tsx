import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";

export function Closer() {
  const { t } = useT();
  return (
    <section className="relative border-t border-line py-32">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="text-balance font-display text-5xl font-light tracking-[-0.02em] text-ink-dim sm:text-7xl md:text-8xl"
          style={{ letterSpacing: "-0.01em" }}
        >
          {t("closer.line")}
        </motion.h2>
      </div>
    </section>
  );
}
