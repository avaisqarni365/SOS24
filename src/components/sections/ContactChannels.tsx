import { PartnerLink, PartnerText, PartnerBadge } from "@/components/brand/PartnerLink";
import { Phone, MessageCircle, Mail, CalendarClock } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

/**
 * The contact band: the brightest thing on the page, and the only section
 * that asks for anything. Four channels side by side, each one tap, because
 * a wet cellar is an urgent problem and people reach for different things --
 * the older caller wants the number, the Hausverwaltung wants mail in
 * writing, everyone else wants WhatsApp.
 * Every channel lands with Shahzad Mahmood directly; none of them is a form
 * that disappears into an inbox.
 */
const CHANNELS = [
  {
    id: "phone",
    Icon: Phone,
    kicker: "Sofort",
    title: "Anrufen",
    value: COMPANY_INFO.phoneDisplay,
    note: "Mo–Sa, 8–20 Uhr. Es geht direkt Herr Mahmood ran.",
    href: `tel:${COMPANY_INFO.phoneTel}`,
    primary: true,
  },
  {
    id: "whatsapp",
    Icon: MessageCircle,
    kicker: "Mit Foto",
    title: "WhatsApp",
    value: "Bild der Wand senden",
    note: "Oft reicht ein Foto für die erste Einschätzung — Antwort meist am selben Tag.",
    href: COMPANY_INFO.whatsappUrl,
    external: true,
  },
  {
    id: "mail",
    Icon: Mail,
    kicker: "Schriftlich",
    title: "E-Mail",
    value: COMPANY_INFO.email,
    note: "Für Hausverwaltungen, Angebote und alles, was dokumentiert gehört.",
    href: `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent("Anfrage kostenlose Feuchtemessung")}`,
  },
  {
    id: "termin",
    Icon: CalendarClock,
    kicker: "Kostenlos",
    title: "Messung vor Ort",
    value: "Termin anfragen",
    note: "Feuchtemessung und Schadensanalyse vor Ort — ohne Kosten, ohne Verpflichtung.",
    href: "#kontakt",
  },
] as const;

export default function ContactChannels() {
  return (
    <section id="kontakt-kanaele" className="contact-band" aria-labelledby="kanaele-title">
      <div className="sc-wrap">
        <div className="contact-band__head">
          <p className="sc-label">Kontakt</p>
          <h2 id="kanaele-title" className="sc-display mt-4">
            Nasser Keller? <em>Reden wir heute.</em>
          </h2>
          <p className="sc-lede mt-5">
            Vier Wege, einer davon passt immer. Die Messung vor Ort ist kostenlos.
          </p>
        </div>

        <ul className="channels">
          {CHANNELS.map(({ id, Icon, kicker, title, value, note, href, ...rest }) => (
            <li key={id}>
              <a
                href={href}
                className={`channel${"primary" in rest && rest.primary ? " channel--primary" : ""}`}
                {...("external" in rest && rest.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span className="channel__icon" aria-hidden="true">
                  <Icon strokeWidth={1.75} />
                </span>
                <span className="channel__kicker">{kicker}</span>
                <span className="channel__title">{title}</span>
                <span className="channel__value">{value}</span>
                <span className="channel__note">{note}</span>
                <span className="channel__go" aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>

        {/* The face belongs on the contact plate: every channel above goes to
            this one person, and saying so is the difference between a form and
            a call. */}
        <figure className="contact-band__who">
          <img
            src="/img/gallery/shahzad-mahmood-480.webp"
            alt="Shahzad Mahmood, Inhaber von sos-abdichtung"
            width={480}
            height={480}
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            <span className="contact-band__who-k">Ihr direkter Ansprechpartner</span>
            <span className="contact-band__who-n">Shahzad Mahmood</span>
            <span className="contact-band__who-r">
              Inhaber · <PartnerLink>SchimmelPeter® Partnerbetrieb</PartnerLink> · Wuppertal &amp; Bergisches Land
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
