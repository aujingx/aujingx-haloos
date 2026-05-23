import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/halo/Nav";
import { Hero } from "@/components/halo/Hero";
import { Manifesto } from "@/components/halo/Manifesto";
import { FeatureSection } from "@/components/halo/FeatureSection";
import { DemoStage } from "@/components/halo/DemoStage";
import { Hardware } from "@/components/halo/Hardware";
import { AmbientStates } from "@/components/halo/AmbientStates";
import { TechSpecs } from "@/components/halo/TechSpecs";
import { CTA } from "@/components/halo/CTA";
import { Footer } from "@/components/halo/Footer";
import lifestyleImg from "@/assets/lifestyle-listen.jpg";
import messageImg from "@/assets/scene-message.jpg";
import navigateImg from "@/assets/scene-navigate.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Halo OS — The Ambient Operating System for Smart Glasses" },
      { name: "description", content: "Halo OS is a tap-free, AI-native operating system designed for smart glasses and wireless audio. Speak, glance, gesture — the world stays in view." },
      { property: "og:title", content: "Halo OS — No tap. Just look." },
      { property: "og:description", content: "An ambient operating system for smart glasses and wireless audio. Speak, glance, gesture." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Manifesto />

      <FeatureSection
        id="listens"
        eyebrow="01 · It Listens"
        title="The mic is open. The world is still there."
        body="Say a sentence and Halo picks up where your attention left off. On-device speech, beam-formed by your earbuds, parsed by an edge model — no wake word, no awkward pause."
        image={lifestyleImg}
        imageAlt="Person wearing Halo Frames on a city street at sunset"
        orb="listening"
        bullets={[
          { k: "Wake to render", v: "110 ms" },
          { k: "Recognition", v: "On-device · 28 languages" },
          { k: "Confirmation", v: "Soft tone + cyan dot" },
          { k: "Privacy LED", v: "Always on when capturing" },
        ]}
      />

      <FeatureSection
        id="sees"
        eyebrow="02 · It Sees"
        title="Your gaze is the cursor. Your dwell is the click."
        body="Look at a card for 800 ms and it expands. Look away and it dissolves. There is no pointer, no menu — only attention and intent, the two things you were already paying."
        image={messageImg}
        imageAlt="Halo HUD message bubble overlaid in cafe scene"
        orb="thinking"
        reverse
        bullets={[
          { k: "Tracking", v: "Foveated · 240 Hz" },
          { k: "Dwell select", v: "800 ms · adjustable" },
          { k: "Confirm gesture", v: "Subtle thumb tap" },
          { k: "Reading mode", v: "Auto-pause on text" },
        ]}
      />

      <FeatureSection
        id="acts"
        eyebrow="03 · It Acts"
        title="One sentence. The system does the rest."
        body='"Move my 2pm to Thursday, tell the team, and book Aurora." Halo composes the intent across calendar, chat, and rooms — and shows you a quiet receipt floating at the edge of view.'
        image={navigateImg}
        imageAlt="Cyclist POV with Halo navigation overlay in park"
        orb="acting"
        bullets={[
          { k: "Multi-app intent", v: "Native action graph" },
          { k: "Undo window", v: "10 s glance-revert" },
          { k: "Receipts", v: "Fade after 4 s" },
          { k: "Offline", v: "Core actions on-device" },
        ]}
      />

      <DemoStage />
      <Hardware />
      <AmbientStates />
      <TechSpecs />
      <CTA />
      <Footer />
    </main>
  );
}
