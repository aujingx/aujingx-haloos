const rows = [
  { k: "Input", v: "Gaze tracking · Voice · Micro-gesture · Subtle nod" },
  { k: "Output", v: "Stereo waveguide HUD · Spatial audio · Haptic temple" },
  { k: "Latency", v: "Wake to render: 110 ms · Dwell select: 800 ms" },
  { k: "Privacy", v: "On-device ASR · Encrypted relay · Camera shutter LED" },
  { k: "Runtime", v: "Halo Core · 4B params · Quantized for edge inference" },
  { k: "SDK", v: "TypeScript · Native intents · Ambient cards API" },
];

export function TechSpecs() {
  return (
    <section className="relative border-y border-line bg-bg-soft py-28">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-hud">System · 01</p>
        <h2 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          Engineered for the corner of your eye.
        </h2>

        <dl className="mt-16 divide-y divide-line border-y border-line">
          {rows.map((r) => (
            <div key={r.k} className="grid grid-cols-12 gap-6 py-6">
              <dt className="col-span-12 font-mono text-[10px] uppercase tracking-[0.25em] text-hud md:col-span-3">{r.k}</dt>
              <dd className="col-span-12 text-lg md:col-span-9">{r.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
