import { Link } from "@tanstack/react-router";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="glass mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full px-5 py-2.5">
        <Link to="/" className="flex items-center gap-2">
          <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-hud" style={{ animation: "orb-pulse 2.4s ease-in-out infinite" }} />
          <span className="font-display text-sm font-semibold tracking-wide">HALO OS</span>
        </Link>
        <nav className="hidden items-center gap-7 text-xs uppercase tracking-[0.18em] text-ink-dim md:flex">
          <a href="#listens" className="transition hover:text-ink">Listens</a>
          <a href="#sees" className="transition hover:text-ink">Sees</a>
          <a href="#acts" className="transition hover:text-ink">Acts</a>
          <a href="#demo" className="transition hover:text-ink">Demo</a>
          <a href="#hardware" className="transition hover:text-ink">Hardware</a>
        </nav>
        <Link
          to="/demo"
          className="rounded-full bg-ember px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-bg transition hover:brightness-110"
        >
          Try Demo
        </Link>
      </div>
    </header>
  );
}
