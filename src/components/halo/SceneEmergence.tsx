import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { AIStatusOrb } from "./AIStatusOrb";
import homeScene from "@/assets/home-scene.jpg";

type EventId = "boil" | "msg" | "pkg" | "filtered";

const schedule: { id: EventId; at: number; duration: number }[] = [
  { id: "boil", at: 1500, duration: 3000 },
  { id: "msg", at: 7000, duration: 3000 },
  { id: "filtered", at: 12000, duration: 99000 }, // persists
  { id: "pkg", at: 16000, duration: 3500 },
];

export function SceneEmergence() {
  const { t } = useT();
  const [t0, setT0] = useState<number | null>(null);
  const [active, setActive] = useState<Record<EventId, boolean>>({ boil: false, msg: false, pkg: false, filtered: false });
  const [elapsed, setElapsed] = useState(0);
  const raf = useRef<number | null>(null);

  const play = () => {
    setActive({ boil: false, msg: false, pkg: false, filtered: false });
    setT0(performance.now());
    setElapsed(0);
  };
  const stop = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setT0(null);
  };

  useEffect(() => {
    if (t0 == null) return;
    const tick = (now: number) => {
      const e = now - t0;
      setElapsed(e);
      const next: Record<EventId, boolean> = { boil: false, msg: false, pkg: false, filtered: false };
      for (const s of schedule) {
        if (e >= s.at && e < s.at + s.duration) next[s.id] = true;
      }
      setActive(next);
      if (e < 22000) {
        raf.current = requestAnimationFrame(tick);
      } else {
        stop();
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t0]);

  return (
    <div className="flex min-h-[520px] flex-col lg:flex-row">
      {/* Left: glasses HUD view */}
      <div className="relative min-h-[460px] w-full overflow-hidden border-b border-line bg-bg lg:w-3/5 lg:border-b-0">
        <img src={homeScene} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-50" width={1536} height={896} />
        {/* warm tint over kitchen direction */}
        <AnimatePresence>
          {active.boil && (
            <motion.div
              key="warm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-y-0 right-0 w-1/2"
              style={{ background: "radial-gradient(circle at 80% 50%, color-mix(in oklab, var(--ember) 35%, transparent), transparent 70%)" }}
            />
          )}
        </AnimatePresence>

        <div className="absolute left-4 top-4 z-10">
          <AIStatusOrb state={Object.values(active).some(Boolean) ? "acting" : "idle"} />
        </div>

        {/* Filtered chip (left bottom) */}
        <AnimatePresence>
          {active.filtered && (
            <motion.button
              key="filt"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full border border-line bg-bg/70 px-3 py-1.5 text-[11px] text-ink-dim backdrop-blur transition hover:text-ink"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ink-dim" />
              {t("s3.filtered")}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Msg toast (bottom center) */}
        <AnimatePresence>
          {active.msg && (
            <motion.div
              key="msg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute inset-x-0 bottom-12 mx-auto w-fit max-w-md rounded-full border border-line bg-bg/80 px-4 py-2 text-[13px] backdrop-blur"
            >
              {t("s3.t2")}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pkg actionable bar (top) */}
        <AnimatePresence>
          {active.pkg && (
            <motion.div
              key="pkg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-6 top-16 flex items-center justify-between rounded-xl border border-hud/40 bg-bg/85 px-4 py-2.5 backdrop-blur"
            >
              <span className="text-[13px]">✓ {t("s3.t3how")}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-hud">Undo 3s</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* timer / play */}
        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-3">
          {t0 == null ? (
            <button
              onClick={play}
              className="rounded-full bg-hud px-5 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-bg transition hover:brightness-110"
            >
              ▶ {t("s3.play")}
            </button>
          ) : (
            <div className="flex items-center gap-3 rounded-full border border-line bg-bg/80 px-4 py-1.5 font-mono text-[10px] text-ink-dim">
              <span>{(elapsed / 1000).toFixed(1)}s / 22s</span>
              <button onClick={play} className="text-hud hover:underline">{t("s3.replay")}</button>
            </div>
          )}
        </div>
      </div>

      {/* Right: explanation */}
      <div className="flex w-full flex-col gap-3 border-t border-line bg-bg-soft/30 p-6 lg:w-2/5 lg:border-l lg:border-t-0 lg:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-hud">{t("demo.right")}</p>
        <div className="space-y-3">
          <EventCard active={active.boil} num="01" title={t("s3.t1")} body={t("s3.t1how")} tone="ember" />
          <EventCard active={active.msg} num="02" title={t("s3.t2")} body={t("s3.t2how")} tone="hud" />
          <EventCard active={active.pkg} num="03" title={t("s3.t3")} body={t("s3.t3how")} tone="hud" />
          <EventCard active={active.filtered} num="—" title={t("s3.filtered")} body={t("s3.t1how").length > 0 ? "" : ""} tone="muted" subtle />
        </div>
      </div>
    </div>
  );
}

function EventCard({
  active,
  num,
  title,
  body,
  tone,
  subtle,
}: {
  active: boolean;
  num: string;
  title: string;
  body: string;
  tone: "ember" | "hud" | "muted";
  subtle?: boolean;
}) {
  const color = tone === "ember" ? "text-ember" : tone === "hud" ? "text-hud" : "text-ink-dim";
  return (
    <motion.div
      animate={{
        borderColor: active ? "color-mix(in oklab, var(--hud) 60%, transparent)" : "color-mix(in oklab, var(--ink) 12%, transparent)",
        opacity: active || subtle ? 1 : 0.5,
      }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border bg-bg/40 px-4 py-3"
    >
      <div className="flex items-center gap-2">
        <span className={`font-mono text-[10px] ${color}`}>{num}</span>
        <span className="text-[13px] font-medium">{title}</span>
      </div>
      {body && <p className="mt-1 text-[12px] leading-relaxed text-ink-dim">{body}</p>}
    </motion.div>
  );
}
