import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/halo/Nav";
import { Hero } from "@/components/halo/Hero";
import { FiveQuestions } from "@/components/halo/FiveQuestions";
import { DemoStage } from "@/components/halo/DemoStage";
import { Footer } from "@/components/halo/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Halo OS — 给 Agent 一个身体，把 App 拿走" },
      { name: "description", content: "如果剥离所有 App，系统只剩下一个随时待命的 Agent，它会如何在场、被唤起、让信息浮现、并在物理世界里替你动手。" },
      { property: "og:title", content: "Halo OS · 终结点按式 OS" },
      { property: "og:description", content: "一个具身智能时代的 OS 概念原型：在场 / 唤起 / 浮现 / 执行 / 协同。" },
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
      <FiveQuestions />
      <DemoStage />
      <Footer />
    </main>
  );
}
