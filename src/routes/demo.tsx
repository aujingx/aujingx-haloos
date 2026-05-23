import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/halo/Nav";
import { DemoStage } from "@/components/halo/DemoStage";
import { Footer } from "@/components/halo/Footer";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Demo — Halo OS" },
      { name: "description", content: "Try the Halo OS ambient interface: gaze to select, voice to reply, drag to turn your head. Three scenes — schedule, message, navigate." },
      { property: "og:title", content: "Halo OS · Live Demo" },
      { property: "og:description", content: "Three scenes — schedule, message, navigate. Gaze to select. No tap needed." },
    ],
  }),
  component: DemoPage,
});

function DemoPage() {
  return (
    <main className="relative">
      <Nav />
      <div className="pt-32">
        <div className="mx-auto mb-8 max-w-7xl px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-hud">Interactive Prototype</p>
          <h1 className="mt-3 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            Halo OS · Demo
          </h1>
          <p className="mt-5 max-w-xl text-ink-dim">
            Your mouse is your gaze. Hover for 800 ms to dwell-select.
            Use the scene picker below the stage to switch between Schedule, Message, and Navigate.
          </p>
        </div>
        <DemoStage />
      </div>
      <Footer />
    </main>
  );
}
