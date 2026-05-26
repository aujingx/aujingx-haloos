import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { AIStatusOrb, type OrbState } from "./AIStatusOrb";
import homeScene from "@/assets/home-scene.jpg";

type ObjId = "cup" | "window" | "robot";
const objects: { id: ObjId; left: string; top: string; size: number; labelKey: string }[] = [
  { id: "cup", left: "32%", top: "62%", size: 60, labelKey: "s1.obj1" },
  { id: "window", left: "70%", top: "30%", size: 130, labelKey: "s1.obj2" },
  { id: "robot", left: "82%", top: "70%", size: 90, labelKey: "s1.obj3" },
];

export function ScenePresence() {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [gaze, setGaze] = useState<{ x: number; y: number } | null>(null);
  const [focused, setFocused] = useState<ObjId | null>(null);
  const [moved, setMoved] = useState(false);
  const dwellTimer = useRef<number | null>(null);
  const lastHover = useRef<ObjId | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      if (!moved) setMoved(true);
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      setGaze({ x, y });

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
  }, [moved]);

  const orbState: OrbState = focused ? "listening" : "idle";

  return (
    <div
      ref={ref}
      className="relative h-[560px] w-full cursor-none overflow-hidden bg-bg-soft"
    >
      <img src={homeScene} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" width={1536} height={896} />
      <div className="absolute inset-0 bg-bg/35" />

      {/* corner orb */}
      <div className="absolute left-5 top-5 z-20">
        <AIStatusOrb state={orbState} />
      </div>

      {/* ambient corner glow */}
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
            <AnimatePresence>
              {isFocus && (
                <motion.span
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-bg/85 px-2.5 py-1 text-[11px] tracking-wide text-ink backdrop-blur"
                >
                  {t(o.labelKey)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* gaze cursor */}
      {gaze && (
        <div className="pointer-events-none absolute z-20" style={{ left: gaze.x, top: gaze.y, transform: "translate(-50%, -50%)" }}>
          <div className="relative h-9 w-9 rounded-full border border-hud/60">
            <div className="absolute inset-2 rounded-full border border-hud/40" />
          </div>
        </div>
      )}

      {/* first-time hint, fades after first move */}
      <AnimatePresence>
        {!moved && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute inset-x-0 bottom-8 text-center text-[12px] tracking-wide text-ink-dim"
          >
            {t("s1.firstHint")}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
