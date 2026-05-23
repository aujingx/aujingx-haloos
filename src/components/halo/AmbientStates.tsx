import { motion } from "framer-motion";
import { AIStatusOrb, type OrbState } from "./AIStatusOrb";

const states: { s: OrbState; title: string; body: string }[] = [
  { s: "idle", title: "Standing by", body: "A faint warm dot in the corner of vision. No light, no sound — just presence." },
  { s: "listening", title: "Listening", body: "Cyan rings breathe in. A soft tone in your earbuds confirms you've been heard." },
  { s: "thinking", title: "Understanding", body: "The dot rotates ember. Halo is parsing intent and context — the world stays unblocked." },
  { s: "acting", title: "Acting", body: "Cyan pulse, then it dissolves. Information that's done its job, leaves." },
];

export function AmbientStates() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-hud">Ambient Language</p>
          <h2 className="mt-3 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Four states.<br />That's the whole interface.
          </h2>
          <p className="mt-6 text-balance text-ink-dim">
            Halo doesn't show you a desktop. It shows you whether it's listening,
            thinking, or acting — and otherwise gets out of the way.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {states.map((st, i) => (
            <motion.div
              key={st.s}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-line bg-bg-soft p-6"
            >
              <div className="grid h-24 place-items-center">
                <AIStatusOrb state={st.s} />
              </div>
              <h3 className="mt-2 text-lg font-medium">{st.title}</h3>
              <p className="mt-2 text-sm text-ink-dim">{st.body}</p>
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-hud/5 blur-2xl transition group-hover:bg-hud/15" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
