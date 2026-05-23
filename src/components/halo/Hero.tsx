import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImg from "@/assets/hero-pov.jpg";
import { useT } from "@/lib/i18n";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useT();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={ref} className="relative h-[110vh] w-full overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img
          src={heroImg}
          alt="First-person view through Halo smart glasses at dawn"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/30 to-bg" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-mono text-[10px] uppercase tracking-[0.35em] text-hud"
        >
          {t("hero.eyebrow")}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl md:text-[8.5rem]"
        >
          {t("hero.title1")}<br />
          <span className="italic text-ink-dim">{t("hero.title2")}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-8 max-w-xl text-balance text-base text-ink-dim sm:text-lg"
        >
          {t("hero.body")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <a
            href="#listens"
            className="group flex flex-col items-center gap-2 text-ink-dim transition hover:text-ink"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]">{t("hero.scroll")}</span>
            <span className="h-10 w-px bg-gradient-to-b from-hud to-transparent" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
