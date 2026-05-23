import { motion } from "framer-motion";
import { AIStatusOrb, type OrbState } from "./AIStatusOrb";
import { useT } from "@/lib/i18n";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  orb?: OrbState;
  bullets?: { k: string; v: string }[];
};

export function FeatureSection({ id, eyebrow, title, body, image, imageAlt, reverse, orb = "listening", bullets }: Props) {
  const { t } = useT();
  return (
    <section id={id} className="relative py-32">
      <div className={`mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2 ${reverse ? "md:[&>div:first-child]:order-2" : ""}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[4/5] overflow-hidden rounded-3xl"
        >
          <img src={image} alt={imageAlt} className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
          <div className="absolute left-5 top-5">
            <div className="glass rounded-full px-3 py-1.5">
              <AIStatusOrb state={orb} />
            </div>
          </div>
          <div className="absolute bottom-5 right-5 flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-hud">{t("demo.fov").replace(/^FOV\s*/i, "").replace(/^视场\s*/, "")}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-hud" style={{ boxShadow: "0 0 8px var(--hud)" }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-hud">{eyebrow}</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            {title}
          </h2>
          <p className="mt-6 max-w-md text-balance text-ink-dim sm:text-lg">{body}</p>

          {bullets && (
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-8">
              {bullets.map((b) => (
                <div key={b.k}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">{b.k}</dt>
                  <dd className="mt-1.5 text-sm text-ink">{b.v}</dd>
                </div>
              ))}
            </dl>
          )}
        </motion.div>
      </div>
    </section>
  );
}
