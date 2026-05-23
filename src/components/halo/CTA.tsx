import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function CTA() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="relative overflow-hidden py-40">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/20 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-hud">Pre-order · Wave One</p>
        <h2 className="mt-4 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
          Look up.<br />The OS comes&nbsp;to&nbsp;you.
        </h2>
        <p className="mt-6 text-ink-dim">
          Limited to 5,000 founders. Ships Q4. No phone required.
        </p>

        {!sent ? (
          <form
            onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }}
            className="mx-auto mt-10 flex max-w-md gap-2 rounded-full border border-line bg-bg-soft p-1.5"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@somewhere.co"
              className="flex-1 bg-transparent px-4 text-sm placeholder:text-ink-dim focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-ember px-5 py-2 text-xs font-medium uppercase tracking-wider text-bg transition hover:brightness-110"
            >
              Reserve
            </button>
          </form>
        ) : (
          <p className="mx-auto mt-10 inline-flex items-center gap-3 rounded-full border border-hud/40 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.25em] text-hud">
            <span className="h-1.5 w-1.5 rounded-full bg-hud" style={{ boxShadow: "0 0 10px var(--hud)" }} />
            Reserved · We'll be in touch
          </p>
        )}

        <div className="mt-10">
          <Link to="/demo" className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-dim underline-offset-4 hover:text-ink hover:underline">
            Or try the interactive demo →
          </Link>
        </div>
      </div>
    </section>
  );
}
