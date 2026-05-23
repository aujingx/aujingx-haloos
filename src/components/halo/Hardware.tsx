import { motion } from "framer-motion";
import glassesImg from "@/assets/product-glasses.jpg";
import earbudsImg from "@/assets/product-earbuds.jpg";

export function Hardware() {
  return (
    <section id="hardware" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-hud">The Hardware</p>
            <h2 className="mt-3 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Two devices.<br />One ambient surface.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-dim">
            Halo OS runs on commodity hardware: a pair of waveguide smart glasses
            and any Bluetooth earbuds. No new ecosystem required.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ProductCard
            image={glassesImg}
            tag="Halo Frames"
            title="Smart Glasses"
            specs={[
              { k: "Display", v: "Stereo waveguide · 1080p" },
              { k: "FOV", v: "110°" },
              { k: "Weight", v: "62 g" },
              { k: "Battery", v: "8 h mixed use" },
              { k: "Input", v: "Gaze · Voice · Gesture" },
            ]}
          />
          <ProductCard
            image={earbudsImg}
            tag="Halo Buds"
            title="Wireless Audio"
            specs={[
              { k: "Driver", v: "11 mm dynamic" },
              { k: "Latency", v: "< 60 ms" },
              { k: "Codec", v: "LC3 · aptX Adaptive" },
              { k: "Battery", v: "6 h + 24 h case" },
              { k: "Mic", v: "Beam-forming dual" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function ProductCard({ image, tag, title, specs }: { image: string; tag: string; title: string; specs: { k: string; v: string }[] }) {
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
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">Gen 01</span>
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
