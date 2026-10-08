"use client";

import React, { useEffect, useRef, useState } from "react";
import { Phone, MapPin, CheckCircle2, MessageSquare, ArrowRight, Mail } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";
import { useLanguage } from "@/i18n/LanguageContext";

const DAMAGE_OPTIONS = [
  "Feuchte Kellerwände / Horizontalsperre",
  "Nasser Keller / Drückendes Hangwasser",
  "Schimmelbefall & Geruch",
  "Salzausblühungen / Abplatzender Putz",
  "Wasserführender Riss",
  "Allgemeine Feuchtigkeitsmessung",
];

type Enquiry = {
  name: string;
  phone: string;
  email: string;
  plz: string;
  damageType: string;
  message: string;
};

function enquiryText(d: Enquiry, place?: string) {
  const intro = place
    ? `Hallo Herr Mahmood, hier ist eine Sanierungsanfrage für ${place} über sos-abdichtung.de:`
    : `Hallo Herr Mahmood, hier ist eine Sanierungsanfrage über sos-abdichtung.de:`;
  return `${intro}\n\nName: ${d.name}\nTelefon: ${d.phone}\nE-Mail: ${d.email}\nPLZ: ${d.plz}\nSchadensbild: ${d.damageType}\nNachricht: ${d.message}`;
}

function whatsappLink(d: Enquiry, place?: string) {
  return `https://wa.me/${COMPANY_INFO.phoneTel.replace("+", "")}?text=${encodeURIComponent(enquiryText(d, place))}`;
}

/** Same enquiry for people without WhatsApp: opens their own mail program. */
function mailLink(d: Enquiry, place?: string) {
  const subject = place ? `Anfrage Feuchtemessung ${place}, PLZ ${d.plz}` : `Anfrage Feuchtemessung, PLZ ${d.plz}`;
  return `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(enquiryText(d, place))}`;
}

const field =
  "w-full min-h-[48px] px-4 py-3 rounded-xl border border-line/15 bg-surface text-sm text-ink shadow-2xs focus:outline-none focus:border-[var(--emerald-deep)] focus:ring-1 focus:ring-[var(--emerald-deep)] placeholder:text-ink/40";
const lbl = "block text-xs font-mono font-bold text-ink mb-2";

export default function ContactForm({ defaultDamage, place }: { defaultDamage?: string; place?: string }) {
  const { t, lang } = useLanguage();
  const [formData, setFormData] = useState<Enquiry>({
    name: "",
    phone: "",
    email: "",
    plz: "",
    damageType: defaultDamage && DAMAGE_OPTIONS.includes(defaultDamage) ? defaultDamage : DAMAGE_OPTIONS[0],
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [channel, setChannel] = useState<"whatsapp" | "mail">("whatsapp");

  // WebMCP, imperative: the same action the form performs, for AI agents in the browser.
  // The agent tool is registered once; it reads the live form state through this ref.
  const formRef = useRef(formData);
  formRef.current = formData;

  useEffect(() => {
    const mc = (navigator as unknown as { modelContext?: { registerTool?: (t: unknown) => void } }).modelContext;
    if (!mc?.registerTool) return;
    try {
      mc.registerTool({
        name: "anfrage_feuchtemessung",
        description:
          "Bereitet eine Anfrage für eine kostenlose Feuchtemessung bei sos-abdichtung vor und öffnet WhatsApp mit der ausgefüllten Nachricht an Shahzad Mahmood. Es wird nichts automatisch versendet.",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name der anfragenden Person" },
            phone: { type: "string", description: "Telefonnummer für den Rückruf" },
            email: { type: "string", description: "E-Mail-Adresse (optional)" },
            plz: { type: "string", description: "Postleitzahl des Objekts, z. B. 42103" },
            damageType: { type: "string", enum: DAMAGE_OPTIONS, description: "Art des Schadens" },
            message: { type: "string", description: "Beschreibung des Problems" },
          },
          required: ["name", "phone", "plz"],
        },
        execute: async (input: Partial<Enquiry>) => {
          const d = { ...formRef.current, ...input } as Enquiry;
          window.open(whatsappLink(d), "_blank");
          return { content: [{ type: "text", text: "WhatsApp-Nachricht vorbereitet. Senden muss die Person selbst." }] };
        },
      });
    } catch {
      /* browsers without WebMCP ignore this */
    }
    // register once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k: keyof Enquiry) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [k]: e.target.value });

  // Two submit buttons share the form's validation; the one pressed picks the channel.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const via = submitter?.value === "mail" ? "mail" : "whatsapp";
    setChannel(via);
    if (via === "mail") window.location.href = mailLink(formData, place);
    else window.open(whatsappLink(formData, place), "_blank");
    setIsSubmitted(true);
  };

  // Declarative WebMCP attributes are not in React's DOM typings.
  const tool = {
    toolname: "anfrage_feuchtemessung",
    tooldescription:
      "Anfrage für eine kostenlose Feuchtemessung vor Ort vorbereiten. Öffnet WhatsApp mit der ausgefüllten Nachricht.",
  } as Record<string, string>;
  const p = (d: string) => ({ toolparamdescription: d }) as Record<string, string>;

  return (
    <section id="kontakt" className="surface-bone-2 relative" aria-labelledby="kontakt-title">
      <div className="relative sc-wrap sc-section">
        <p className="mb-5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-deep">
          {t("contact.eyebrow")}
        </p>
        <h2
          id="kontakt-title"
          className="font-editorial text-[2.25rem] font-normal leading-[1.04] tracking-[-0.02em] text-[var(--head-on-bone)] sm:text-5xl lg:text-[3.5rem]"
        >
          {place && lang === "de" ? `Sprechen wir über Ihr Objekt in ${place}.` : t("contact.h1")}
          <br />
          <span className="text-accent-deep">{t("contact.accent")}</span>
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-on-bone)] sm:text-lg">
          {t("contact.sub")}
        </p>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="rounded-3xl border border-ink/5 bg-surface p-8 shadow-sm sm:p-10 lg:col-span-7">
            {isSubmitted ? (
              <div className="space-y-4 py-10 text-center" role="status">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-deep/15 text-accent-deep">
                  <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="font-editorial text-2xl text-[var(--head-on-bone)]">Anfrage vorbereitet</h3>
                <p className="mx-auto max-w-md text-sm text-[var(--text-on-bone)]">
                  {channel === "mail"
                    ? "Die E-Mail ist in Ihrem E-Mail-Programm vorbereitet. Bitte dort absenden."
                    : "Die Nachricht ist in WhatsApp vorbereitet. Bitte dort absenden."}{" "}
                  Herr Mahmood meldet sich zur Terminabstimmung.
                </p>
                <a
                  href={`tel:${COMPANY_INFO.phoneTel}`}
                  className="btn-shine inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 py-3 font-mono text-xs font-semibold shadow-sm"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  Dringend? Direkt anrufen: {COMPANY_INFO.phoneDisplay}
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" {...tool}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="f-name" className={lbl}>
                      {t("contact.name")}
                    </label>
                    <input id="f-name" name="name" type="text" required autoComplete="name" value={formData.name} onChange={set("name")} placeholder="z. B. Markus Schmidt" className={field} {...p("Name der anfragenden Person")} />
                  </div>
                  <div>
                    <label htmlFor="f-phone" className={lbl}>
                      {t("contact.phone")}
                    </label>
                    <input id="f-phone" name="phone" type="tel" required autoComplete="tel" value={formData.phone} onChange={set("phone")} placeholder="z. B. 0170 1234567" className={field} {...p("Telefonnummer für den Rückruf")} />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="f-email" className={lbl}>
                      {t("contact.email")}
                    </label>
                    <input id="f-email" name="email" type="email" autoComplete="email" value={formData.email} onChange={set("email")} placeholder="name@beispiel.de" className={field} {...p("E-Mail-Adresse, optional")} />
                  </div>
                  <div>
                    <label htmlFor="f-plz" className={lbl}>
                      {t("contact.plz")}
                    </label>
                    <input id="f-plz" name="plz" type="text" inputMode="numeric" pattern="[0-9]{5}" required maxLength={5} autoComplete="postal-code" value={formData.plz} onChange={set("plz")} placeholder="z. B. 42103" className={field} {...p("Fünfstellige Postleitzahl des Objekts")} />
                  </div>
                </div>
                <div>
                  <label htmlFor="f-damage" className={lbl}>
                    {t("contact.damage")}
                  </label>
                  <select id="f-damage" name="damageType" value={formData.damageType} onChange={set("damageType")} className={field} {...p("Art des Schadens")}>
                    {DAMAGE_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="f-msg" className={lbl}>
                    {t("contact.msg")}
                  </label>
                  <textarea id="f-msg" name="message" rows={3} value={formData.message} onChange={set("message")} placeholder="z. B. Altbau von 1912, feuchte Raumecke seit Starkregen" className={field} {...p("Kurze Beschreibung des Problems")} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="submit"
                    name="via"
                    value="whatsapp"
                    className="btn-shine inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold shadow-md active:scale-[0.98]"
                  >
                    {t("contact.viaWhatsapp")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="submit"
                    name="via"
                    value="mail"
                    className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border border-line/20 bg-surface px-6 py-4 text-sm font-semibold text-ink hover:border-[var(--emerald-deep)] hover:bg-surface-2 active:scale-[0.98]"
                  >
                    {t("contact.viaMail")}
                    <Mail className="contact-row__i" aria-hidden="true" />
                  </button>
                </div>
                <p className="text-center font-mono text-[11px] text-[var(--text-on-bone)]">
                  Öffnet WhatsApp oder Ihr E-Mail-Programm mit der vorbereiteten Nachricht. Auf unserer Website wird
                  nichts gespeichert.
                </p>
              </form>
            )}
          </div>

          <div className="space-y-6 lg:col-span-5">
            <div className="space-y-6 rounded-3xl border border-ink/5 bg-surface p-8 shadow-sm">
              <div>
                <div className="flex items-center gap-4">
                  <img
                    src="/img/gallery/shahzad-mahmood-160.webp"
                    width={160}
                    height={176}
                    alt={`Porträt von ${COMPANY_INFO.owner}`}
                    loading="lazy"
                    className="h-[5.5rem] w-[5.5rem] shrink-0 rounded-full object-cover object-top border border-ink/10"
                  />
                  <div>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-accent-deep">
                      Direkter Ansprechpartner
                    </p>
                    <h3 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-ink">{COMPANY_INFO.owner}</h3>
                    <p className="mt-1 text-sm text-ink-soft">Inhaber · SchimmelPeter® Partnerbetrieb</p>
                  </div>
                </div>
                <img
                  src="/img/gallery/schimmelpeter-fachbetrieb.svg"
                  width={225}
                  height={82}
                  alt="SchimmelPeter® Zertifizierter Fachbetrieb"
                  loading="lazy"
                  className="mt-5 h-12 w-auto"
                />
              </div>
              <div className="contact-rows space-y-3 border-t border-line/10 pt-5">
                <a href={`tel:${COMPANY_INFO.phoneTel}`} className="contact-row">
                  <Phone className="contact-row__i" aria-hidden="true" />
                  <span>
                    <span className="contact-row__k">Telefon</span>
                    <span className="contact-row__v">{COMPANY_INFO.phoneDisplay}</span>
                  </span>
                </a>
                <a href={COMPANY_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="contact-row">
                  <MessageSquare className="contact-row__i" aria-hidden="true" />
                  <span>
                    <span className="contact-row__k">WhatsApp</span>
                    <span className="contact-row__v">Fotos schicken, Einschätzung bekommen</span>
                  </span>
                </a>
                <div className="contact-row contact-row--static">
                  <MapPin className="contact-row__i" aria-hidden="true" />
                  <span>
                    <span className="contact-row__k">Sitz</span>
                    <span className="contact-row__v">
                      {COMPANY_INFO.street}, {COMPANY_INFO.city}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

