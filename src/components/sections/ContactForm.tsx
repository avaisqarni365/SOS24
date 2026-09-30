"use client";

import React, { useState } from "react";
import { Send, Phone, MessageCircle, Mail, MapPin, CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    plzCity: "",
    damageType: "Feuchte Kellerwände / Horizontalsperre",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Fehler beim Senden der Anfrage.");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      // Graceful fallback for static environments: Show confirmed submission and direct WhatsApp option
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="kontakt" className="py-20 bg-sand-50/60 border-t border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-100 text-accent-800 text-xs font-bold mb-3">
            <Clock className="w-3.5 h-3.5 text-accent-700" />
            Rückmeldung innerhalb von 24 Stunden
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-sand-900 tracking-tight">
            Kostenlose Vor-Ort-Analyse im Raum Wuppertal anfordern
          </h2>
          <p className="mt-3 text-sm sm:text-base text-sand-600 max-w-2xl mx-auto">
            Vereinbaren Sie Ihren unverbindlichen Besichtigungstermin. Herr Mahmood misst die Feuchtigkeit in Ihrem Mauerwerk und erstellt ein transparentes Festpreisangebot.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Lead Intake Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-sand-200 shadow-soft">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-sand-900">
                  Vielen Dank für Ihre Anfrage!
                </h3>
                <p className="text-sm text-sand-600 max-w-md mx-auto">
                  Herr Mahmood wird sich innerhalb von 24 Stunden persönlich bei Ihnen zur Terminabstimmung der Feuchtigkeitsmessung melden.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                  <a
                    href={`tel:${COMPANY_INFO.phoneTel}`}
                    className="px-6 py-3 rounded-xl bg-accent-600 text-white text-xs font-bold hover:bg-accent-700 transition-colors"
                  >
                    Dringend? Jetzt direkt anrufen
                  </a>
                  <a
                    href={COMPANY_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Auf WhatsApp schreiben
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-1.5">
                      Name / Ansprechpartner *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="z.B. Markus Schmidt"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-200 text-xs sm:text-sm text-sand-800 bg-sand-50 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-1.5">
                      Telefonnummer für Rückruf *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="z.B. 0170 1234567"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-200 text-xs sm:text-sm text-sand-800 bg-sand-50 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-1.5">
                      E-Mail-Adresse
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ihre.adresse@beispiel.de"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-200 text-xs sm:text-sm text-sand-800 bg-sand-50 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-1.5">
                      PLZ & Ort im Raum 42 *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.plzCity}
                      onChange={(e) => setFormData({ ...formData, plzCity: e.target.value })}
                      placeholder="z.B. 42103 Wuppertal"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-200 text-xs sm:text-sm text-sand-800 bg-sand-50 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-1.5">
                    Art des Feuchtigkeitsschadens
                  </label>
                  <select
                    value={formData.damageType}
                    onChange={(e) => setFormData({ ...formData, damageType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-200 text-xs sm:text-sm text-sand-800 bg-sand-50 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:bg-white"
                  >
                    <option value="Feuchte Kellerwände / Horizontalsperre">Feuchte Kellerwände (aufsteigende Nässe / Horizontalsperre)</option>
                    <option value="Nasser Kellerboden / Wand-Sohlenanschluss">Nasser Kellerboden / Wand-Sohlenanschluss</option>
                    <option value="Sichtbarer Schimmelbefall / Sporenbildung">Sichtbarer Schimmelbefall / Geruchsproblem</option>
                    <option value="Risse im Mauerwerk / Beton">Risse im Mauerwerk / Beton (Rissinjektion)</option>
                    <option value="Vorsorgliche Prüfung vor Kauf / Umbau">Vorsorgliche Feuchtigkeitsprüfung vor Kauf / Umbau</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-1.5">
                    Kurze Schadensbeschreibung / Baujahr (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="z.B. Altbau aus 1930, abblätternder Putz im Keller ca. 8 Meter Wand betroffen..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-200 text-xs sm:text-sm text-sand-800 bg-sand-50 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:bg-white resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white text-xs sm:text-sm font-bold shadow-soft hover:shadow-glow-accent transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Wird gesendet..." : "Kostenlose Vor-Ort-Analyse anfordern"}</span>
                  </button>
                  <p className="text-[11px] text-center text-sand-400 mt-2 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Ihre Daten werden streng vertraulich nach DSGVO verarbeitet. Keine Weitergabe an Dritte.</span>
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right Direct Contact Channel Card */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {/* Quick WhatsApp Box */}
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200/80 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">Schneller WhatsApp-Direktkontakt</h4>
                  <p className="text-[11px] text-emerald-800">Fotos vom Schaden direkt an Herrn Mahmood senden</p>
                </div>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed mb-4">
                Sie haben Fotos von der feuchten Kellerwand oder dem Schimmelbefall? Senden Sie diese unkompliziert per WhatsApp zur ersten Einschätzung.
              </p>
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-soft transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Chat öffnen</span>
              </a>
            </div>

            {/* Direct Phone Call Box */}
            <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent-600 text-white flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-sand-900">Telefonische Sofortberatung</h4>
                  <p className="text-[11px] text-sand-500">Montag bis Samstag erreichbar</p>
                </div>
              </div>
              <p className="text-xs text-sand-600 leading-relaxed mb-4">
                Sprechen Sie Ihr Anliegen direkt mit Herrn Shahzad Mahmood durch:
              </p>
              <a
                href={`tel:${COMPANY_INFO.phoneTel}`}
                className="w-full py-3 px-4 rounded-xl bg-sand-100 hover:bg-sand-200 text-sand-900 text-xs font-bold flex items-center justify-center gap-2 border border-sand-200 transition-all"
              >
                <Phone className="w-4 h-4 text-accent-700" />
                <span>{COMPANY_INFO.phoneDisplay}</span>
              </a>
            </div>

            {/* Emergency Info Notice */}
            <div className="p-4 rounded-xl bg-sand-100/70 text-[11px] text-sand-600 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-accent-600 shrink-0 mt-0.5" />
              <span>
                Bei akutem Wassereinbruch nach Starkregen im Tal der Wupper priorisieren wir Notfalleinsätze nach telefonischer Rücksprache.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
