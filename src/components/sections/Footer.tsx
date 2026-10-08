import { COMPANY_INFO } from "@/data/content-data";
import { SERVICE_CARDS } from "@/data/services";
import { CITY_PAGES } from "@/data/seo-pages";
import { PARTNER_URL } from "@/lib/site";
import Logo from "@/components/brand/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line/10 bg-[var(--ink)] py-12 text-[var(--bone)]/70">
      <div className="sc-wrap">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="space-y-4 md:col-span-4">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed">
              Fachbetrieb für Kellersanierung, Horizontalsperren und Schimmelbeseitigung in Wuppertal und dem
              Bergischen Land. Offizieller{" "}
              <a href={PARTNER_URL} className="underline hover:text-[var(--bone)]" rel="noopener">
                SchimmelPeter® Partnerbetrieb
              </a>
              .
            </p>
            <address className="text-sm not-italic">
              {COMPANY_INFO.owner}
              <br />
              {COMPANY_INFO.street}, {COMPANY_INFO.city}
              <br />
              <a href={`tel:${COMPANY_INFO.phoneTel}`} className="hover:text-[var(--bone)]">
                {COMPANY_INFO.phoneDisplay}
              </a>
              <br />
              <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-[var(--bone)]">
                {COMPANY_INFO.email}
              </a>
            </address>
          </div>

          <nav className="md:col-span-3" aria-label="Leistungen im Footer">
            <p className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--bone)]">Leistungen</p>
            <ul className="space-y-1 text-sm">
              {SERVICE_CARDS.map((s) => (
                <li key={s.slug}>
                  <a href={`/leistungen/${s.slug}/`} className="inline-block py-1.5 hover:text-[var(--brick)]">
                    {s.title}
                  </a>
                </li>
              ))}
              <li>
                <a href="/leistungen/" className="inline-block py-1.5 font-semibold text-[var(--brick)]">
                  Alle Leistungen →
                </a>
              </li>
            </ul>
          </nav>

          <nav className="md:col-span-3" aria-label="Servicegebiet im Footer">
            <p className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--bone)]">Kellersanierung in</p>
            <ul className="space-y-1 text-sm">
              {CITY_PAGES.map((c) => (
                <li key={c.slug}>
                  <a href={`/kellersanierung/${c.slug}/`} className="inline-block py-1.5 hover:text-[var(--brick)]">
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-2" aria-label="Seiten">
            <p className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--bone)]">Seiten</p>
            <ul className="space-y-1 text-sm">
              {[
                ["/labor/", "Scientific Lab"],
                ["/galerie/", "Galerie"],
                ["/kostenrechner/", "Kostenrechner"],
                ["/#servicegebiet", "Servicegebiet"],
                ["/#faq", "Häufige Fragen"],
                ["/#kontakt", "Kontakt"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="inline-block py-1.5 hover:text-[var(--brick)]">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line/5 pt-8 font-mono text-[11px] text-[var(--bone)]/55 sm:flex-row">
          <p className="no-justify">
            © 2026 sos-abdichtung · Inh. {COMPANY_INFO.owner} ·{" "}
            <a href="/impressum/" className="underline-offset-2 hover:underline">
              Impressum
            </a>{" "}
            ·{" "}
            <a href="/datenschutz/" className="underline-offset-2 hover:underline">
              Datenschutz
            </a>
          </p>
          <p className="no-justify">SchimmelPeter® ist eine Marke der SchimmelPeter GmbH.</p>
        </div>
      </div>
    </footer>
  );
}
