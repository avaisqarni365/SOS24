"use client";

import React, { useEffect, useState } from "react";
import { Phone, MapPin, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

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

function whatsappLink(d: Enquiry) {
  const text = `Hallo Herr Mahmood, hier ist eine Sanierungsanfrage über sos-abdichtung.de:\n\nName: ${d.name}\nTelefon: ${d.phone}\nE-Mail: ${d.email}\nPLZ: ${d.plz}\nSchadensbild: ${d.damageType}\nNachricht: ${d.message}`;
  return `https://wa.me/${COMPANY_INFO.phoneTel.replace("+", "")}?text=${encodeURIComponent(text)}`;
}

const field =
  "w-full min-h-[48px] px-4 py-3 rounded-xl border border-black/15 bg-[var(--bone)] text-sm text-[var(--head-on-bone)] focus:outline-none focus:border-[var(--emerald-deep)] focus:bg-white placeholder:text-black/40";
const lbl = "block text-xs font-mono font-bold text-[var(--head-on-bone)] mb-2";

export default function ContactForm({ defaultDamage, place }: { defaultDamage?: string; place?: string }) {
  const [formData, setFormData] = useState<Enquiry>({
    name: "",
    phone: "",
    email: "",
    plz: "",
    damageType: defaultDamage && DAMAGE_OPTIONS.includes(defaultDamage) ? defaultDamage : DAMAGE_OPTIONS[0],
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // WebMCP, imperative: the same action the form performs, for AI agents in the browser.
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
          const d = { ...formData, ...input } as Enquiry;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(whatsappLink(formData), "_blank");
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
      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <p className="mb-5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--emerald-deep)]">
          Kontakt & Vor-Ort-Analyse
        </p>
        <h2
          id="kontakt-title"
          className="font-editorial text-[2.25rem] font-normal leading-[1.04] tracking-[-0.02em] text-[var(--head-on-bone)] sm:text-5xl lg:text-[3.5rem]"
        >
          Sprechen wir über Ihr Objekt{place ? ` in ${place}` : ""}.
          <br />
          <span className="italic text-[var(--emerald-deep)]">Die Feuchtemessung ist kostenlos.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-on-bone)] sm:text-lg">
          Vereinbaren Sie Ihren unverbindlichen Termin. {COMPANY_INFO.owner} misst die Feuchtigkeit im Mauerwerk und
          erstellt Ihnen ein transparentes Festpreisangebot.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm sm:p-10 lg:col-span-7">
            {isSubmitted ? (
              <div className="space-y-4 py-10 text-center" role="status">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--mint)]/15 text-[var(--emerald-deep)]">
                  <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="font-editorial text-2xl text-[var(--head-on-bone)]">Anfrage vorbereitet</h3>
                <p className="mx-auto max-w-md text-sm text-[var(--text-on-bone)]">
                  Die Nachricht ist in WhatsApp vorbereitet. Bitte dort absenden. Herr Mahmood meldet sich zur
                  Terminabstimmung.
                </p>
                <a
                  href={`tel:${COMPANY_INFO.phoneTel}`}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[var(--head-on-bone)] px-6 py-3 font-mono text-xs font-semibold text-[var(--bone)] hover:bg-black"
                >
                  <Phone className="h-3.5 w-3.5 text-[var(--mint)]" aria-hidden="true" />
                  Dringend? Direkt anrufen: {COMPANY_INFO.phoneDisplay}
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" {...tool}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="f-name" className={lbl}>
                      Name *
                    </label>
                    <input id="f-name" name="name" type="text" required autoComplete="name" value={formData.name} onChange={set("name")} placeholder="z. B. Markus Schmidt" className={field} {...p("Name der anfragenden Person")} />
                  </div>
                  <div>
                    <label htmlFor="f-phone" className={lbl}>
                      Telefon für Rückruf *
                    </label>
                    <input id="f-phone" name="phone" type="tel" required autoComplete="tel" value={formData.phone} onChange={set("phone")} placeholder="z. B. 0170 1234567" className={field} {...p("Telefonnummer für den Rückruf")} />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="f-email" className={lbl}>
                      E-Mail
                    </label>
                    <input id="f-email" name="email" type="email" autoComplete="email" value={formData.email} onChange={set("email")} placeholder="name@beispiel.de" className={field} {...p("E-Mail-Adresse, optional")} />
                  </div>
                  <div>
                    <label htmlFor="f-plz" className={lbl}>
                      PLZ des Objekts *
                    </label>
                    <input id="f-plz" name="plz" type="text" inputMode="numeric" pattern="[0-9]{5}" required maxLength={5} autoComplete="postal-code" value={formData.plz} onChange={set("plz")} placeholder="z. B. 42103" className={field} {...p("Fünfstellige Postleitzahl des Objekts")} />
                  </div>
                </div>
                <div>
                  <label htmlFor="f-damage" className={lbl}>
                    Art des Schadens
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
                    Ihre Nachricht
                  </label>
                  <textarea id="f-msg" name="message" rows={3} value={formData.message} onChange={set("message")} placeholder="z. B. Altbau von 1912, feuchte Raumecke seit Starkregen" className={field} {...p("Kurze Beschreibung des Problems")} />
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[var(--head-on-bone)] px-7 py-4 text-sm font-semibold text-[var(--bone)] shadow-sm hover:bg-black"
                >
                  Kostenlose Feuchtemessung anfragen
                  <ArrowRight className="h-4 w-4 text-[var(--mint)]" aria-hidden="true" />
                </button>
                <p className="text-center font-mono text-[11px] text-[var(--text-on-bone)]">
                  Öffnet WhatsApp mit Ihrer vorbereiteten Nachricht. Ihre Daten werden nicht gespeichert.
                </p>
              </form>
            )}
          </div>

          <div className="space-y-6 lg:col-span-5">
            <div className="space-y-6 rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--emerald-deep)]">
                  Direkter Ansprechpartner
                </p>
                <h3 className="mt-1 font-editorial text-2xl text-[var(--head-on-bone)]">{COMPANY_INFO.owner}</h3>
                <p className="mt-0.5 font-mono text-xs text-[var(--text-on-bone)]">SchimmelPeter® Partnerbetrieb</p>
              </div>
              <div className="space-y-4 border-t border-black/5 pt-4 font-mono text-xs text-[var(--head-on-bone)]">
                <a href={`tel:${COMPANY_INFO.phoneTel}`} className="flex items-center gap-3 rounded-2xl border border-black/5 bg-[var(--bone)] p-3.5 hover:bg-[var(--bone-2)]">
                  <Phone className="h-4 w-4 text-[var(--emerald-deep)]" aria-hidden="true" />
                  <span>
                    <span className="block text-[10px] text-[var(--text-on-bone)]">Telefon</span>
                    <span className="block text-sm font-bold">{COMPANY_INFO.phoneDisplay}</span>
                  </span>
                </a>
                <a href={COMPANY_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-black/5 bg-[var(--bone)] p-3.5 hover:bg-[var(--bone-2)]">
                  <MessageSquare className="h-4 w-4 text-[var(--emerald-deep)]" aria-hidden="true" />
                  <span>
                    <span className="block text-[10px] text-[var(--text-on-bone)]">WhatsApp</span>
                    <span className="block text-sm font-bold">Fotos schicken, Einschätzung bekommen</span>
                  </span>
                </a>
                <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-[var(--bone)] p-3.5">
                  <MapPin className="h-4 w-4 text-[var(--emerald-deep)]" aria-hidden="true" />
                  <span>
                    <span className="block text-[10px] text-[var(--text-on-bone)]">Sitz</span>
                    <span className="block text-xs font-bold">
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
