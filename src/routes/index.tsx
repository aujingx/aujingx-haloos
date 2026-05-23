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
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Halo OS — 为智能眼镜打造的环境式操作系统" },
      { name: "description", content: "Halo OS 是一套无需点按、为智能眼镜与无线音频原生设计的 AI 操作系统。说一句、看一眼、做个手势，世界仍在眼前。" },
      { property: "og:title", content: "Halo OS — 无需点按，只需一眼。" },
      { property: "og:description", content: "一套为智能眼镜与无线音频打造的环境式操作系统。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useT();
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Manifesto />

      <FeatureSection
        id="listens"
        eyebrow={t("f.listens.eyebrow")}
        title={t("f.listens.title")}
        body={t("f.listens.body")}
        image={lifestyleImg}
        imageAlt={t("f.listens.alt")}
        orb="listening"
        bullets={[
          { k: t("f.listens.b1k"), v: t("f.listens.b1v") },
          { k: t("f.listens.b2k"), v: t("f.listens.b2v") },
          { k: t("f.listens.b3k"), v: t("f.listens.b3v") },
          { k: t("f.listens.b4k"), v: t("f.listens.b4v") },
        ]}
      />

      <FeatureSection
        id="sees"
        eyebrow={t("f.sees.eyebrow")}
        title={t("f.sees.title")}
        body={t("f.sees.body")}
        image={messageImg}
        imageAlt={t("f.sees.alt")}
        orb="thinking"
        reverse
        bullets={[
          { k: t("f.sees.b1k"), v: t("f.sees.b1v") },
          { k: t("f.sees.b2k"), v: t("f.sees.b2v") },
          { k: t("f.sees.b3k"), v: t("f.sees.b3v") },
          { k: t("f.sees.b4k"), v: t("f.sees.b4v") },
        ]}
      />

      <FeatureSection
        id="acts"
        eyebrow={t("f.acts.eyebrow")}
        title={t("f.acts.title")}
        body={t("f.acts.body")}
        image={navigateImg}
        imageAlt={t("f.acts.alt")}
        orb="acting"
        bullets={[
          { k: t("f.acts.b1k"), v: t("f.acts.b1v") },
          { k: t("f.acts.b2k"), v: t("f.acts.b2v") },
          { k: t("f.acts.b3k"), v: t("f.acts.b3v") },
          { k: t("f.acts.b4k"), v: t("f.acts.b4v") },
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
