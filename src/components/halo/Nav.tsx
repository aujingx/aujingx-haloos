import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

export function Nav() {
  const { t, locale, setLocale } = useT();
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="glass mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full px-5 py-2.5">
        <Link to="/" className="flex items-center gap-2">
          <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-hud" style={{ animation: "orb-pulse 2.4s ease-in-out infinite" }} />
          <span className="font-display text-sm font-semibold tracking-wide">HALO OS</span>
        </Link>
        <nav className="hidden items-center gap-6 text-[11px] uppercase tracking-[0.18em] text-ink-dim md:flex">
          <a href="#scene-presence" className="transition hover:text-ink">{t("nav.presence")}</a>
          <a href="#scene-trigger" className="transition hover:text-ink">{t("nav.trigger")}</a>
          <a href="#scene-emergence" className="transition hover:text-ink">{t("nav.emergence")}</a>
          <a href="#scene-action" className="transition hover:text-ink">{t("nav.action")}</a>
          <a href="#scene-multi" className="transition hover:text-ink">{t("nav.multi")}</a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
            className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim transition hover:text-ink"
            aria-label="Toggle language"
          >
            {t("nav.langToggle")}
          </button>
          <a
            href="#demo"
            className="rounded-full bg-ember px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-bg transition hover:brightness-110"
          >
            {t("nav.tryDemo")}
          </a>
        </div>
      </div>
    </header>
  );
}
