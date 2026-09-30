"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    plz: "",
    damageType: "Feuchte Kellerwände / Horizontalsperre",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 100% static client-side submission: Opens WhatsApp with pre-filled message
    const text = `Hallo Herr Mahmood, hier ist eine Sanierungsanfrage über sos-abdichtung.de:\n\nName: ${formData.name}\nTelefon: ${formData.phone}\nE-Mail: ${formData.email}\nPLZ: ${formData.plz}\nSchadensbild: ${formData.damageType}\nNachricht: ${formData.message}`;
    const whatsappUrl = `https://wa.me/491722064177?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
    setIsSubmitted(true);
  };

  return (
    <section id="kontakt" className="relative bg-landing-bone2 text-[#1A1D1B]">
      <div className="relative max-w-6xl mx-auto px-6 py-24 sm:py-32">
        {/* Section Header */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-5 text-landing-emerald font-mono">
          Kontakt & Vor-Ort-Analyse
        </p>
        <h2 className="font-editorial font-normal tracking-[-0.02em] leading-[1.04] text-[2.25rem] sm:text-5xl lg:text-[3.5rem] text-[#1A1D1B]">
          Sprechen wir über Ihr Objekt.
          <br />
          <span className="italic text-landing-mint">Wir antworten innerhalb weniger Stunden.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[#444945]">
          Vereinbaren Sie Ihren unverbindlichen Besichtigungstermin. Herr Mahmood misst die Feuchtigkeit im Mauerwerk und erstellt Ihnen ein transparentes Festpreisangebot ohne Folgekosten.
        </p>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form in Snow White Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-black/5 p-8 sm:p-10 shadow-sm">
            {isSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 rounded-full bg-landing-emerald/10 text-landing-emerald flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-editorial text-2xl text-[#1A1D1B]">Anfrage übermittelt</h3>
                <p className="text-sm text-[#444945] max-w-md mx-auto">
                  Vielen Dank! Die Nachricht wurde vorbereitet. Herr Mahmood meldet sich umgehend bei Ihnen zur Terminabstimmung.
                </p>
                <div className="pt-4">
                  <a
                    href={`tel:${COMPANY_INFO.phoneTel}`}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-mono font-semibold bg-[#1A1D1B] text-landing-bone hover:bg-black transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-landing-mint" />
                    <span>Dringend? Direkt anrufen: {COMPANY_INFO.phoneDisplay}</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#1A1D1B] mb-2">
                      Name / Ansprechpartner *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="z.B. Markus Schmidt"
                      className="w-full px-4 py-3 rounded-xl border border-black/10 bg-landing-bone2/40 text-sm text-[#1A1D1B] focus:outline-none focus:border-landing-emerald focus:bg-white placeholder:text-black/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[#1A1D1B] mb-2">
                      Telefonnummer für Rückruf *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="z.B. 0170 1234567"
                      className="w-full px-4 py-3 rounded-xl border border-black/10 bg-landing-bone2/40 text-sm font-mono text-[#1A1D1B] focus:outline-none focus:border-landing-emerald focus:bg-white placeholder:text-black/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#1A1D1B] mb-2">
                      E-Mail-Adresse
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@beispiel.de"
                      className="w-full px-4 py-3 rounded-xl border border-black/10 bg-landing-bone2/40 text-sm font-mono text-[#1A1D1B] focus:outline-none focus:border-landing-emerald focus:bg-white placeholder:text-black/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[#1A1D1B] mb-2">
                      Postleitzahl des Objekts *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={formData.plz}
                      onChange={(e) => setFormData({ ...formData, plz: e.target.value })}
                      placeholder="z.B. 42103"
                      className="w-full px-4 py-3 rounded-xl border border-black/10 bg-landing-bone2/40 text-sm font-mono text-[#1A1D1B] focus:outline-none focus:border-landing-emerald focus:bg-white placeholder:text-black/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#1A1D1B] mb-2">
                    Art des Schadens
                  </label>
                  <select
                    value={formData.damageType}
                    onChange={(e) => setFormData({ ...formData, damageType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-landing-bone2/40 text-sm text-[#1A1D1B] focus:outline-none focus:border-landing-emerald focus:bg-white"
                  >
                    <option value="Feuchte Kellerwände / Horizontalsperre">
                      Feuchte Kellerwände / Horizontalsperre
                    </option>
                    <option value="Nasser Keller / Drückendes Hangwasser">
                      Nasser Keller / Drückendes Hangwasser
                    </option>
                    <option value="Schimmelbefall & Geruch">Schimmelbefall & Geruch</option>
                    <option value="Salzausblühungen / Abplatzender Putz">
                      Salzausblühungen / Abplatzender Putz
                    </option>
                    <option value="Allgemeine Feuchtigkeitsmessung">
                      Allgemeine Feuchtigkeitsmessung
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#1A1D1B] mb-2">
                    Ihre Nachricht / Details zum Objekt
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Beschreiben Sie kurz das Problem (z.B. Altbau von 1912, feuchte Raumecke seit Starkregen)..."
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-landing-bone2/40 text-sm text-[#1A1D1B] focus:outline-none focus:border-landing-emerald focus:bg-white placeholder:text-black/30"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-semibold transition-all active:scale-[0.98] bg-[#1A1D1B] text-landing-bone hover:bg-black shadow-sm"
                >
                  <span>Anfrage senden & WhatsApp öffnen</span>
                  <ArrowRight className="w-4 h-4 text-landing-mint" />
                </button>

                <p className="text-[11px] font-mono text-center text-[#444945] mt-2">
                  🔒 Ihre Daten werden vertraulich behandelt und nicht weitergegeben.
                </p>
              </form>
            )}
          </div>

          {/* Right Direct Contact Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-white border border-black/5 shadow-sm space-y-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-landing-emerald font-semibold">
                  Direkter Ansprechpartner
                </span>
                <h3 className="font-editorial text-2xl text-[#1A1D1B] mt-1">
                  Shahzad Mahmood
                </h3>
                <p className="text-xs text-[#444945] font-mono mt-0.5">
                  Zertifizierter SchimmelPeter® Partnerbetrieb
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-black/5 text-xs font-mono text-[#1A1D1B]">
                <a
                  href={`tel:${COMPANY_INFO.phoneTel}`}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-landing-bone hover:bg-landing-bone2 transition-colors border border-black/5"
                >
                  <div className="w-8 h-8 rounded-xl bg-landing-emerald/10 text-landing-emerald flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#444945]">Telefonisch erreichbar:</div>
                    <div className="font-bold text-sm text-[#1A1D1B]">{COMPANY_INFO.phoneDisplay}</div>
                  </div>
                </a>

                <a
                  href={COMPANY_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-landing-bone hover:bg-landing-bone2 transition-colors border border-black/5"
                >
                  <div className="w-8 h-8 rounded-xl bg-landing-mint/20 text-landing-mint flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-landing-emerald" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#444945]">Direkter WhatsApp-Chat:</div>
                    <div className="font-bold text-sm text-[#1A1D1B]">Jetzt Nachricht senden →</div>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-landing-bone border border-black/5">
                  <div className="w-8 h-8 rounded-xl bg-landing-emerald/10 text-landing-emerald flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#444945]">Zuständig für:</div>
                    <div className="font-bold text-xs text-[#1A1D1B]">PLZ-Bereich 42 (Wuppertal & Bergisches Land)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-landing-bone border border-black/5 text-xs text-[#444945] space-y-2 font-mono">
              <div className="font-bold text-[#1A1D1B]">✓ Vor-Ort-Garantie:</div>
              <p>
                Herr Mahmood führt jede Besichtigung und Messung persönlich mit professionellen CM-Feuchtemessgeräten durch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
