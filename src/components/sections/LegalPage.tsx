import Logo from "@/components/brand/Logo";
import Footer from "@/components/sections/Footer";

/** Shared frame for Impressum and Datenschutz: the site's own header,
    a readable light text column, the site footer. */
export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-white/[0.08] bg-[#0e1310]">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8">
          <a href="/" aria-label="sos-abdichtung, zur Startseite">
            <Logo sub="Wuppertal · Region 42" />
          </a>
          <a href="/" className="text-sm font-semibold text-[var(--bone)]/80 hover:text-[var(--bone)]">
            <span aria-hidden="true">←</span> Zur Startseite
          </a>
        </div>
      </header>
      <main id="main" className="surface-bone legal">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
          <h1 className="sc-display text-4xl text-[var(--head-on-bone)] sm:text-5xl">{title}</h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[var(--text-on-bone)]/70">Stand: {updated}</p>
          <div className="legal__body mt-10">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
