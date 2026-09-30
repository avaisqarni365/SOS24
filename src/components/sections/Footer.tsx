import { COMPANY_INFO } from "@/data/content-data";
import { SERVICE_CARDS } from "@/data/services";
import { CITY_PAGES } from "@/data/seo-pages";
import { PARTNER_URL } from "@/lib/site";
import Logo from "@/components/brand/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line/10 bg-[var(--ink)] py-16 text-[var(--bone)]/70">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="space-y-4 md:col-span-4">
            <Logo sub="Wuppertal · PLZ 42" />
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

          <nav className="md:col-span-3" aria-label="Leistungen">
            <p className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--bone)]">Leistungen</p>
            <ul className="space-y-1 text-sm">
              {SERVICE_CARDS.map((s) => (
                <li key={s.slug}>
                  <a href={`/leistungen/${s.slug}/`} className="inline-block py-1.5 hover:text-[var(--bone)]">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-3" aria-label="Servicegebiet">
            <p className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--bone)]">Kellersanierung in</p>
            <ul className="space-y-1 text-sm">
              {CITY_PAGES.map((c) => (
                <li key={c.slug}>
                  <a href={`/kellersanierung/${c.slug}/`} className="inline-block py-1.5 hover:text-[var(--bone)]">
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-2" aria-label="Rechtliches">
            <p className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--bone)]">Rechtliches</p>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="/impressum/" className="inline-block py-1.5 hover:text-[var(--bone)]">
                  Impressum
                </a>
              </li>
              <li>
                <a href="/datenschutz/" className="inline-block py-1.5 hover:text-[var(--bone)]">
                  Datenschutz
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line/5 pt-8 font-mono text-[11px] text-[var(--bone)]/55 sm:flex-row">
          <p className="no-justify">© 2026 sos-abdichtung · Inh. {COMPANY_INFO.owner}</p>
          <p className="no-justify">SchimmelPeter® ist eine Marke der SchimmelPeter GmbH.</p>
        </div>
      </div>
    </footer>
  );
}
