import { useT } from "@/lib/i18n";

export function Footer() {
  const { t } = useT();
  return (
    <footer className="border-t border-line py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-hud" style={{ boxShadow: "0 0 10px var(--hud)" }} />
          <span className="font-display text-sm font-semibold tracking-wide">HALO OS</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim">{t("ft.ver")}</span>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim">
          {t("ft.copy")}
        </p>
      </div>
    </footer>
  );
}
