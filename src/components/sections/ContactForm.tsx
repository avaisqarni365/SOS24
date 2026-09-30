"use client";

import React, { useState } from "react";
import { ArrowRight, Phone, Mail, MapPin, CheckCircle2, MessageSquare } from "lucide-react";
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
    // 100% static client-side submission: Open WhatsApp or mailto
    const text = `Hallo Herr Mahmood, hier ist eine Sanierungsanfrage:\nName: ${formData.name}\nTelefon: ${formData.phone}\nPLZ: ${formData.plz}\nSchaden: ${formData.damageType}\nDetails: ${formData.message}`;
    const whatsappUrl = `https://wa.me/491722064177?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
    setIsSubmitted(true);
  };

  return (
    <section id="kontakt" className="py-24 bg-[#0b0e14] border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header - Kontai24 Style */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
            Kontakt & Erstberatung
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            Sprechen wir über Ihr Gebäude.
            <br />
            <span className="text-slate-400">Wir antworten innerhalb eines Werktages.</span>
          </h2>
          <p className="mt-6 text-base text-slate-400 leading-relaxed">
            Vereinbaren Sie Ihren unverbindlichen Besichtigungstermin. Herr Mahmood misst die Feuchtigkeit im Mauerwerk und erstellt Ihnen ein transparentes Festpreisangebot.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Minimalist Form */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.12] text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-2xl font-bold text-white">Anfrage übermittelt</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Vielen Dank! Herr Mahmood meldet sich umgehend bei Ihnen zur Terminabstimmung.
                </p>
                <div className="pt-4">
                  <a
                    href={`tel:${COMPANY_INFO.phoneTel}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.15] text-white text-xs font-mono font-medium transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Dringend? {COMPANY_INFO.phoneDisplay} anrufen</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      Name / Ansprechpartner *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="z.B. Markus Schmidt"
                      className="w-full px-4 py-3 rounded-xl border border-white/[0.12] text-xs sm:text-sm text-white bg-white/[0.03] focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      Telefonnummer für Rückruf *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="z.B. 0170 1234567"
                      className="w-full px-4 py-3 rounded-xl border border-white/[0.12] text-xs sm:text-sm font-mono text-white bg-white/[0.03] focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      E-Mail-Adresse
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ihre.adresse@beispiel.de"
                      className="w-full px-4 py-3 rounded-xl border border-white/[0.12] text-xs sm:text-sm text-white bg-white/[0.03] focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      PLZ & Ort im Raum 42 *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.plz}
                      onChange={(e) => setFormData({ ...formData, plz: e.target.value })}
                      placeholder="z.B. 42103 Wuppertal"
                      className="w-full px-4 py-3 rounded-xl border border-white/[0.12] text-xs sm:text-sm font-mono text-white bg-white/[0.03] focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Schadensart
                  </label>
                  <select
                    value={formData.damageType}
                    onChange={(e) => setFormData({ ...formData, damageType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-white/[0.12] text-xs sm:text-sm text-white bg-[#10141d] focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Feuchte Kellerwände / Horizontalsperre">Feuchte Kellerwände (aufsteigende Nässe / Horizontalsperre)</option>
                    <option value="Nasser Kellerboden / Wand-Sohlenanschluss">Nasser Kellerboden / Wand-Sohlenanschluss</option>
                    <option value="Sichtbarer Schimmelbefall / Sporenbildung">Sichtbarer Schimmelbefall / Geruchsproblem</option>
                    <option value="Risse im Mauerwerk / Beton">Risse im Mauerwerk / Beton (Rissinjektion)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Nachricht / Details zum Objekt (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="z.B. Altbau aus 1935, feuchte Kellerwand ca. 8 Meter..."
                    className="w-full px-4 py-3 rounded-xl border border-white/[0.12] text-xs sm:text-sm text-white bg-white/[0.03] focus:outline-none focus:border-cyan-400 resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#0b0e14] text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                  >
                    <span>Kostenlose Vor-Ort-Analyse anfordern</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] font-mono text-center text-slate-500 mt-2">
                    Keine Weitergabe an Dritte · DSGVO-konform
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right Direct Details - Exact match to Kontai24 Contact Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-6">
              <div>
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                  Ihr Ansprechpartner
                </div>
                <div className="text-base font-bold text-white">
                  Shahzad Mahmood
                </div>
                <div className="text-xs text-slate-400">
                  Inhaber & Bautenschutz-Experte
                </div>
              </div>

              <div className="border-t border-white/[0.06] pt-6">
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                  Telefon & WhatsApp
                </div>
                <div className="text-sm font-mono text-white">
                  <a href={`tel:${COMPANY_INFO.phoneTel}`} className="hover:text-cyan-400 transition-colors">
                    {COMPANY_INFO.phoneDisplay}
                  </a>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Montag – Samstag, 07:30 – 19:00 Uhr
                </div>
              </div>

              <div className="border-t border-white/[0.06] pt-6">
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                  E-Mail
                </div>
                <div className="text-xs font-mono text-white">
                  <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-cyan-400 transition-colors">
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </div>

              <div className="border-t border-white/[0.06] pt-6">
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                  Betrieb & Anschrift
                </div>
                <div className="text-xs text-slate-300">
                  sos-abdichtung · SchimmelPeter® Partnerbetrieb
                  <br />
                  {COMPANY_INFO.street}, {COMPANY_INFO.city}
                  <br />
                  <span className="text-cyan-400 font-mono text-[11px]">
                    Zuständig für Wuppertal, Solingen, Remscheid, Velbert (PLZ 42)
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
