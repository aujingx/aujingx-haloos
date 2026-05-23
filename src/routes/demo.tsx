import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/halo/Nav";
import { DemoStage } from "@/components/halo/DemoStage";
import { Footer } from "@/components/halo/Footer";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "演示 — Halo OS" },
      { name: "description", content: "体验 Halo OS 的环境式界面：用视线选择、用声音回复、用拖拽转头。日程、消息、导航三幕。" },
      { property: "og:title", content: "Halo OS · 实时演示" },
      { property: "og:description", content: "日程、消息、导航三幕。用视线选择，无需点按。" },
    ],
  }),
  component: DemoPage,
});

function DemoPage() {
  const { t } = useT();
  return (
    <main className="relative">
      <Nav />
      <div className="pt-32">
        <div className="mx-auto mb-8 max-w-7xl px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-hud">{t("demoPage.eyebrow")}</p>
          <h1 className="mt-3 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            {t("demoPage.title")}
          </h1>
          <p className="mt-5 max-w-xl text-ink-dim">{t("demoPage.body")}</p>
        </div>
        <DemoStage />
      </div>
      <Footer />
    </main>
  );
}
