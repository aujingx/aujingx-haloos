import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { AIStatusOrb, type OrbState } from "./AIStatusOrb";
import homeScene from "@/assets/home-scene.jpg";

type ObjId = "cup" | "window" | "robot";
const objects: { id: ObjId; left: string; top: string; size: number }[] = [
  { id: "cup", left: "32%", top: "62%", size: 60 },
  { id: "window", left: "70%", top: "30%", size: 130 },
  { id: "robot", left: "82%", top: "70%", size: 90 },
];

export function ScenePresence() {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [gaze, setGaze] = useState<{ x: number; y: number } | null>(null);
  const [focused, setFocused] = useState<ObjId | null>(null);
  const dwellTimer = useRef<number | null>(null);
  const lastHover = useRef<ObjId | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      setGaze({ x, y });

      // Check which object the gaze is closest to
      let hit: ObjId | null = null;
      for (const o of objects) {
        const ox = (parseFloat(o.left) / 100) * r.width;
        const oy = (parseFloat(o.top) / 100) * r.height;
        const dx = x - ox;
        const dy = y - oy;
        if (Math.sqrt(dx * dx + dy * dy) < o.size) { hit = o.id; break; }
      }
      if (hit !== lastHover.current) {
        if (dwellTimer.current) window.clearTimeout(dwellTimer.current);
        lastHover.current = hit;
        if (hit) {
          dwellTimer.current = window.setTimeout(() => setFocused(hit), 900);
        } else {
          setFocused(null);
        }
      }
    };
    const onLeave = () => {
      setGaze(null);
      setFocused(null);
      lastHover.current = null;
      if (dwellTimer.current) window.clearTimeout(dwellTimer.current);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const orbState: OrbState = focused ? "listening" : "idle";

  return (
    <div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-5">
      {/* Left: gaze view */}
      <div
        ref={ref}
        className="relative h-[460px] cursor-none overflow-hidden bg-bg-soft lg:h-auto"
      >
        <img src={homeScene} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" width={1536} height={896} />
        <div className="absolute inset-0 bg-bg/40" />
        {/* corner glow that pulses always */}
        <motion.div
          className="pointer-events-none absolute right-6 top-6 h-2 w-2 rounded-full bg-hud"
          style={{ boxShadow: "0 0 18px var(--hud)" }}
          animate={{ opacity: focused ? [0.9, 1, 0.9] : [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />

        {/* object hotspots */}
        {objects.map((o) => {
          const isFocus = focused === o.id;
          return (
            <div
              key={o.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: o.left, top: o.top, width: o.size, height: o.size }}
            >
              <motion.div
                className="absolute inset-0 rounded-full border"
                animate={{
                  borderColor: isFocus
                    ? "color-mix(in oklab, var(--hud) 80%, transparent)"
                    : "color-mix(in oklab, var(--hud) 12%, transparent)",
                  scale: isFocus ? [1, 1.06, 1] : 1,
                }}
                transition={{ duration: 1.4, repeat: isFocus ? Infinity : 0 }}
                style={{ boxShadow: isFocus ? "0 0 30px color-mix(in oklab, var(--hud) 50%, transparent)" : "none" }}
              />
              {isFocus && (
                <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-bg/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-hud">
                  {t(`s1.obj${o.id === "cup" ? "1" : o.id === "window" ? "2" : "3"}`)}
                </span>
              )}
            </div>
          );
        })}

        {/* gaze cursor */}
        {gaze && (
          <div className="pointer-events-none absolute z-20" style={{ left: gaze.x, top: gaze.y, transform: "translate(-50%, -50%)" }}>
            <div className="h-9 w-9 rounded-full border border-hud/60">
              <div className="absolute inset-2 rounded-full border border-hud/40" />
            </div>
          </div>
        )}

        <div className="absolute left-4 top-4 z-10">
          <AIStatusOrb state={orbState} />
        </div>
      </div>

      {/* Right: explanation */}
      <div className="flex flex-col justify-between gap-6 border-t border-line bg-bg-soft/30 p-6 lg:border-l lg:border-t-0 lg:p-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-hud">{t("demo.right")}</p>
          <h3 className="mt-3 text-2xl font-semibold">{focused ? t("s1.listening") : t("s1.idle")}</h3>
          <p className="mt-4 text-[13px] leading-relaxed text-ink-dim">{t("s1.hint")}</p>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={focused ?? "idle"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-line bg-bg/40 px-4 py-3 font-mono text-[11px] text-ink-dim"
          >
            {focused ? `↳ ${t(`s1.obj${focused === "cup" ? "1" : focused === "window" ? "2" : "3"}`)}` : "—"}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
