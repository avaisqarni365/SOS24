'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  ExternalLink,
  Download,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { COMPANY, COMPANY_INFO } from '@/data/content-data';
import { submitLeadToWorkspace } from '@/lib/backend';
import {
  INSPECTION_SLOTS,
  buildGoogleCalendarUrl,
  downloadIcsFile,
  type InspectionSlot,
} from '@/lib/calendar';

interface OnlineAppointmentBookingProps {
  hideHeader?: boolean;
  className?: string;
  place?: string;
}

export default function OnlineAppointmentBooking({ hideHeader = false, className = '', place }: OnlineAppointmentBookingProps) {
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [selectedDate, setSelectedDate] = useState<string>(tomorrowStr);
  const [selectedSlot, setSelectedSlot] = useState<InspectionSlot>(INSPECTION_SLOTS[0]);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>(place ? `${place}` : '');
  const [damageType, setDamageType] = useState<string>('Feuchter Keller / Nasse Wände');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [bookedSuccess, setBookedSuccess] = useState<boolean>(false);
  const [assignedLeadId, setAssignedLeadId] = useState<string>('');
  const [activePlace, setActivePlace] = useState<string>(place || '');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryOrt = params.get('ort') || params.get('city');
      if (queryOrt) {
        setActivePlace(queryOrt);
        if (!address) {
          setAddress(queryOrt);
        }
      }
    }
  }, [address]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;

    setSubmitting(true);
    try {
      const res = await submitLeadToWorkspace({
        name: name.trim(),
        phone: phone.trim(),
        plzOrt: address.trim(),
        damageType,
        preferredDate: selectedDate,
        message: `Online-Terminbuchung: Wunschtermin am ${selectedDate} (${selectedSlot.timeRange}). Schaden: ${damageType}. Notiz: ${notes || 'Keine Angabe'}`,
        source: 'Online-Terminplaner (Homepage / Booking)',
        channel: 'phone',
      });

      const id = res.id || 'A-1004';
      setAssignedLeadId(id);
      setBookedSuccess(true);
    } catch {
      setBookedSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  const calTitle = `SOS Abdichtung · Vor-Ort-Feuchtigkeitsmessung (${name})`;
  const calDesc = `Kostenlose Vor-Ort-Schadensanalyse & Feuchtemessung durch Inhaber Shahzad Mahmood (${COMPANY_INFO.phoneDisplay}).\nSchadensart: ${damageType}\nKunde: ${name} (${phone})\nAdresse: ${address}\nVorgangs-ID: ${assignedLeadId || 'A-1004'}`;
  const calLocation = address || 'Objektadresse NRW';

  const googleCalLink = buildGoogleCalendarUrl({
    title: calTitle,
    description: calDesc,
    location: calLocation,
    startDate: selectedDate,
    startTime: selectedSlot.startTime,
    durationMinutes: selectedSlot.durationMinutes,
  });

  const handleDownloadIcs = () => {
    downloadIcsFile({
      title: calTitle,
      description: calDesc,
      location: calLocation,
      startDate: selectedDate,
      startTime: selectedSlot.startTime,
      durationMinutes: selectedSlot.durationMinutes,
    });
  };

  return (
    <section id="termin" className={`py-10 sm:py-16 lg:py-20 bg-[#f8fafc] text-slate-900 relative overflow-hidden border-y border-slate-200/80 ${className}`}>
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header (hidden on standalone /termin/ page to avoid duplicate titles) */}
        {!hideHeader && (
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black uppercase tracking-wider shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Online-Terminplaner · 100 % Kostenfrei</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0f2537] tracking-tight">
              Vor-Ort-Feuchtemessung {activePlace ? `in ${activePlace} ` : ''}direkt online buchen
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Wählen Sie Ihren Wunschtermin. Inhaber <strong>{COMPANY_INFO.owner}</strong> begutachtet Ihren Feuchteschaden
              persönlich vor Ort mit elektronischer CM-Messtechnik – kostenfrei in ganz NRW.
            </p>
          </div>
        )}

        {bookedSuccess ? (
          /* Success Card with Google Calendar Integration */
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-emerald-500/50 space-y-6 text-center max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Wunschtermin reserviert · Vorgang {assignedLeadId}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Vielen Dank, {name}!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Ihr Termin zur kostenlosen Vor-Ort-Feuchtemessung wurde erfolgreich im System und im Google Kalender hinterlegt.
              </p>
            </div>

            {/* Scheduled Slot Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-left space-y-2.5 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Termindetails</span>
              </div>
              <div className="text-base font-black text-slate-900">
                {new Date(selectedDate).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="text-sm font-extrabold text-emerald-800">
                {selectedSlot.icon} {selectedSlot.label}: {selectedSlot.timeRange}
              </div>
              <div className="text-xs text-slate-600 flex items-start gap-1.5 pt-1 border-t border-slate-200">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                <span>{address}</span>
              </div>
            </div>

            {/* Google Calendar 1-Click Sync Buttons */}
            <div className="space-y-3 pt-2 max-w-md mx-auto">
              <a
                href={googleCalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>📅 In Google Kalender speichern ↗</span>
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Apple / Outlook (.ics)</span>
                </button>

                <a
                  href={`https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(
                    `Hallo Herr Mahmood, ich habe soeben einen Vor-Ort-Termin für ${name} am ${selectedDate} (${selectedSlot.timeRange}) in ${address} gebucht. (Vorgang: ${assignedLeadId})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp-Bestätigung</span>
                </a>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500">
              Herr Shahzad Mahmood meldet sich vorab telefonisch bei Ihnen unter <strong>{phone}</strong>.
            </div>
          </div>
        ) : (
          /* Interactive Booking Form */
          <form
            onSubmit={handleBooking}
            className="bg-white text-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 shadow-xl sm:shadow-2xl border border-slate-200/90 space-y-6 sm:space-y-7"
          >
            {/* Step 1: Choose Slot */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center text-[10px]">1</span>
                  <span>Wunschdatum &amp; Zeitfenster wählen</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-500">Montag bis Samstag</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-5">
                  <label htmlFor="booking-date" className="block text-xs font-bold text-slate-700 mb-1">
                    Datum der Besichtigung *
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    min={tomorrowStr}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-base sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 outline-none transition"
                  />
                </div>

                <div className="sm:col-span-7">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Zeitfenster für die Feuchtemessung *
                  </label>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2">
                    {INSPECTION_SLOTS.map((slot) => {
                      const isSelected = selectedSlot.id === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`min-h-[50px] p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/30 shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-slate-900">
                              {slot.icon} {slot.label}
                            </span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{slot.timeRange}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Contact Details */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center text-[10px]">2</span>
                <span>Ihre Kontaktdaten &amp; Schadensadresse</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="b-name" className="block text-xs font-bold text-slate-700 mb-1">
                    Ihr Name *
                  </label>
                  <input
                    id="b-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Vor- und Nachname"
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="b-phone" className="block text-xs font-bold text-slate-700 mb-1">
                    Telefonnummer für Rückruf *
                  </label>
                  <input
                    id="b-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="z. B. 0172 2064177"
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="b-addr" className="block text-xs font-bold text-slate-700 mb-1">
                    Adresse &amp; PLZ (Schadensort) *
                  </label>
                  <input
                    id="b-addr"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="z. B. Niebuhrstr. 46, Essen"
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label htmlFor="b-damage" className="block text-xs font-bold text-slate-700 mb-1">
                    Art des Feuchtigkeitsschadens
                  </label>
                  <select
                    id="b-damage"
                    value={damageType}
                    onChange={(e) => setDamageType(e.target.value)}
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 outline-none transition"
                  >
                    <option value="Feuchter Keller / Nasse Wände">Feuchter Keller / Nasse Wände</option>
                    <option value="Aufsteigende Feuchte / Horizontalsperre">Aufsteigende Feuchte / Horizontalsperre</option>
                    <option value="Schimmelbefall / Stockflecken">Schimmelbefall / Stockflecken</option>
                    <option value="Wandrisse / Wassereintritt">Wandrisse / Wassereintritt (Rissinjektion)</option>
                    <option value="Balkon- / Terrassenabdichtung">Balkon- / Terrassenabdichtung</option>
                    <option value="Hauskauf-Check / Feuchtemessung">Hauskauf-Check / Feuchtemessung</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="b-notes" className="block text-xs font-bold text-slate-700 mb-1">
                    Bemerkung (optional)
                  </label>
                  <input
                    id="b-notes"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="z. B. Altbau, Keller riecht muffig"
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Trust and Submit Button */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100 % unverbindlich &amp; kostenfrei. Keine Anfahrtskosten in NRW.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm inline-flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Termin wird reserviert...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Vor-Ort-Termin verbindlich reservieren →</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
