import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AIStatusOrb, type OrbState } from "./AIStatusOrb";

type SceneId = "schedule" | "message" | "navigate";

const scenes: { id: SceneId; label: string; caption: string }[] = [
  { id: "schedule", label: "Schedule", caption: "Glance to expand. Swipe to commit." },
  { id: "message", label: "Message", caption: "Notifications breathe. Voice replies." },
  { id: "navigate", label: "Navigate", caption: "Turn your head. Labels travel with you." },
];

export function DemoStage() {
  const [scene, setScene] = useState<SceneId>("schedule");
  const [orb, setOrb] = useState<OrbState>("idle");
  const stageRef = useRef<HTMLDivElement>(null);
  const [gaze, setGaze] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setGaze({ x: e.clientX - r.left, y: e.clientY - r.top });
    };
    const onLeave = () => setGaze(null);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section id="demo" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-hud">Live Demo · 03 Acts</p>
            <h2 className="mt-3 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              See the interface<br />you don't touch.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-dim">
            Hover your gaze (cursor) on a card to dwell-select.
            Halo responds in 800 ms — same as a glance.
          </p>
        </div>

        <div
          ref={stageRef}
          className="relative aspect-[16/9] w-full overflow-hidden rounded-[28px] border border-line bg-bg-soft"
        >
          {/* Grid backdrop */}
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="absolute inset-0 scanline opacity-30" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ember/10 via-transparent to-hud/15" />

          {/* Top HUD bar */}
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-4">
            <AIStatusOrb state={orb} />
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim">
              <span>Halo OS · v0.1</span>
              <span className="h-1 w-1 rounded-full bg-hud" />
              <span>FOV 110°</span>
            </div>
          </div>

          {/* Scene */}
          <AnimatePresence mode="wait">
            <motion.div
              key={scene}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {scene === "schedule" && <SceneSchedule onActivity={setOrb} />}
              {scene === "message" && <SceneMessage onActivity={setOrb} />}
              {scene === "navigate" && <SceneNavigate onActivity={setOrb} />}
            </motion.div>
          </AnimatePresence>

          {/* Gaze cursor */}
          {gaze && (
            <div
              className="pointer-events-none absolute z-20"
              style={{ left: gaze.x, top: gaze.y, transform: "translate(-50%, -50%)" }}
            >
              <div className="relative h-10 w-10">
                <div className="absolute inset-0 rounded-full border border-hud/60" />
                <div className="absolute inset-2 rounded-full border border-hud/40" />
                <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-hud" style={{ boxShadow: "0 0 10px var(--hud)" }} />
              </div>
            </div>
          )}

          {/* Progress / scene picker */}
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 px-6 py-4">
            <div className="flex gap-2">
              {scenes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setScene(s.id); setOrb("idle"); }}
                  className={`group flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                    scene === s.id
                      ? "border-hud/60 bg-hud/10 text-ink"
                      : "border-line text-ink-dim hover:text-ink"
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em]">{s.id}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim md:block">
              {scenes.find((s) => s.id === scene)?.caption}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Schedule ---------------- */
function SceneSchedule({ onActivity }: { onActivity: (s: OrbState) => void }) {
  const [dwell, setDwell] = useState<number | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const tasks = [
    { t: "09:30", title: "Stand-up · Engineering", place: "Halo Studio" },
    { t: "11:00", title: "Coffee with Mira", place: "Blue Bottle" },
    { t: "14:00", title: "Design review · Frames v3", place: "Room Aurora" },
  ];

  const onEnter = (i: number) => {
    onActivity("listening");
    setDwell(i);
    timerRef.current = window.setTimeout(() => {
      setExpanded(i);
      onActivity("thinking");
    }, 800);
  };
  const onLeave = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setDwell(null);
  };
  const complete = (i: number) => {
    onActivity("acting");
    setCompleted((c) => [...c, i]);
    setExpanded(null);
    setTimeout(() => onActivity("idle"), 900);
  };

  return (
    <div className="absolute inset-0 grid place-items-center px-12">
      <div className="w-full max-w-xl">
        <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.35em] text-hud">
          Tuesday · Morning
        </p>
        <div className="space-y-3">
          {tasks.map((task, i) => {
            const done = completed.includes(i);
            return (
              <motion.div
                key={i}
                layout
                onMouseEnter={() => !done && onEnter(i)}
                onMouseLeave={onLeave}
                className={`group relative overflow-hidden rounded-2xl border bg-bg/60 backdrop-blur transition ${
                  expanded === i ? "border-hud/60 hud-ring" : "border-line"
                } ${done ? "opacity-40" : ""}`}
              >
                <div className="flex items-center gap-4 px-5 py-4">
                  <span className="font-mono text-xs text-hud">{task.t}</span>
                  <div className="flex-1">
                    <p className={`text-sm ${done ? "line-through" : ""}`}>{task.title}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">{task.place}</p>
                  </div>
                  {dwell === i && expanded !== i && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8 }}
                      className="absolute bottom-0 left-0 h-px bg-hud"
                    />
                  )}
                </div>
                <AnimatePresence>
                  {expanded === i && !done && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-line"
                    >
                      <div className="flex items-center justify-between gap-4 px-5 py-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                          Swipe right → mark done
                        </p>
                        <button
                          onClick={() => complete(i)}
                          className="rounded-full bg-hud px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-bg transition hover:brightness-110"
                        >
                          Gesture: Swipe →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Message ---------------- */
function SceneMessage({ onActivity }: { onActivity: (s: OrbState) => void }) {
  const [opened, setOpened] = useState(false);
  const [reply, setReply] = useState(false);

  return (
    <div className="absolute inset-0">
      {!opened && (
        <motion.button
          onMouseEnter={() => { onActivity("listening"); setTimeout(() => { setOpened(true); onActivity("thinking"); }, 700); }}
          className="absolute right-12 top-1/3 flex items-center gap-3 rounded-full glass px-4 py-2.5 hud-ring"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <span className="h-2 w-2 rounded-full bg-hud" style={{ boxShadow: "0 0 12px var(--hud)" }} />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em]">Mira · just now</span>
        </motion.button>
      )}

      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 grid place-items-center px-12"
          >
            <div className="grid w-full max-w-4xl grid-cols-3 gap-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                className="rounded-2xl border border-line bg-bg/60 p-5 backdrop-blur">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">Mira</p>
                <p className="mt-3 text-sm leading-relaxed">
                  Coffee at 11 still good? I'm grabbing a corner table.
                </p>
                <p className="mt-4 font-mono text-[10px] text-ink-dim">10:42</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="grid place-items-center rounded-2xl border border-hud/40 bg-bg/40 p-5 backdrop-blur hud-ring">
                <p className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-hud">
                  Look + Speak
                </p>
                <p className="mt-3 text-center text-sm text-ink-dim">
                  "On my way, two minutes."
                </p>
                <button
                  onClick={() => { onActivity("acting"); setReply(true); setTimeout(() => onActivity("idle"), 1200); }}
                  className="mt-4 rounded-full bg-ember px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-bg"
                >
                  Voice reply
                </button>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                className="space-y-2 rounded-2xl border border-line bg-bg/60 p-5 backdrop-blur">
                <button className="block w-full rounded-lg border border-line px-3 py-2 text-left text-xs text-ink-dim transition hover:text-ink">Dismiss</button>
                <button className="block w-full rounded-lg border border-line px-3 py-2 text-left text-xs text-ink-dim transition hover:text-ink">Mute Mira · 1h</button>
                <button className="block w-full rounded-lg border border-line px-3 py-2 text-left text-xs text-ink-dim transition hover:text-ink">Share location</button>
              </motion.div>
            </div>

            <AnimatePresence>
              {reply && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full border border-hud/40 bg-bg/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-hud"
                >
                  Sent · "On my way, two minutes."
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Navigate ---------------- */
function SceneNavigate({ onActivity }: { onActivity: (s: OrbState) => void }) {
  const [heading, setHeading] = useState(0); // -180..180
  const dragging = useRef(false);
  const startX = useRef(0);
  const startH = useRef(0);

  const pois = [
    { name: "Blue Bottle Coffee", dist: "120 m", at: -40 },
    { name: "Halo Studio", dist: "480 m", at: 10 },
    { name: "Aurora Park", dist: "1.2 km", at: 80 },
  ];

  return (
    <div
      className="absolute inset-0 cursor-grab select-none active:cursor-grabbing"
      onMouseDown={(e) => { dragging.current = true; startX.current = e.clientX; startH.current = heading; onActivity("listening"); }}
      onMouseMove={(e) => {
        if (!dragging.current) return;
        const next = Math.max(-180, Math.min(180, startH.current + (e.clientX - startX.current) * 0.4));
        setHeading(next);
      }}
      onMouseUp={() => { dragging.current = false; onActivity("idle"); }}
      onMouseLeave={() => { dragging.current = false; }}
    >
      <motion.div className="absolute inset-0" style={{ x: -heading * 4 }}>
        <img src={new URL("../../assets/scene-navigate.jpg", import.meta.url).href}
          alt="" className="h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-bg/30" />
      </motion.div>

      {/* POI labels */}
      {pois.map((p) => {
        const dx = (p.at - heading) * 6;
        const visible = Math.abs(p.at - heading) < 60;
        return (
          <motion.div
            key={p.name}
            animate={{ x: dx, opacity: visible ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="rounded-2xl border border-hud/50 bg-bg/60 px-4 py-2.5 backdrop-blur hud-ring">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-hud">{p.dist}</p>
              <p className="mt-0.5 text-sm">{p.name}</p>
            </div>
          </motion.div>
        );
      })}

      {/* Compass */}
      <div className="absolute left-1/2 top-6 -translate-x-1/2">
        <div className="flex items-center gap-4 rounded-full border border-line bg-bg/60 px-4 py-1.5 backdrop-blur">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim">Heading</span>
          <span className="font-mono text-xs text-hud">{heading >= 0 ? "+" : ""}{Math.round(heading)}°</span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-16 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-dim">
          Drag to turn your head
        </p>
      </div>
    </div>
  );
}
