import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImg from "@/assets/home-scene.jpg";
import { useT } from "@/lib/i18n";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useT();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={ref} className="relative h-[100vh] w-full overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img
          src={heroImg}
          alt=""
          className="h-full w-full object-cover"
          width={1536}
          height={896}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/50 to-bg" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-mono text-[10px] uppercase tracking-[0.35em] text-hud"
        >
          {t("hero.eyebrow")}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl md:text-8xl"
        >
          {t("hero.title1")}<br />
          <span className="italic text-ink-dim">{t("hero.title2")}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.9 }}
          className="mt-8 max-w-2xl text-balance text-[15px] leading-relaxed text-ink-dim sm:text-base"
        >
          {t("hero.body")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="mt-10 flex items-center gap-4"
        >
          <a
            href="#demo"
            className="rounded-full bg-ember px-6 py-2.5 text-sm font-medium uppercase tracking-wider text-bg transition hover:brightness-110"
          >
            {t("hero.cta")} →
          </a>
          <a
            href="#five"
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-dim transition hover:text-ink"
          >
            ↓ {t("fq.eyebrow")}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
