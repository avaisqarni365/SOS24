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
import SendError from '@/components/ui/SendError';
import {
  INSPECTION_SLOTS,
  buildGoogleCalendarUrl,
  downloadIcsFile,
  type InspectionSlot,
} from '@/lib/calendar';

/** ISO date (yyyy-mm-dd) on the office's calendar, n days from now. */
const berlinDay = (n: number) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(new Date(Date.now() + n * 86400000));
/** 0 = Sunday … 6 = Saturday, for an ISO date (noon, so no time zone moves the day) */
const weekday = (iso: string) => new Date(iso + 'T12:00:00').getDay();
/** The next bookable days from tomorrow: Monday to Saturday, as the office opens. */
function bookableDays(count: number) {
  const out: string[] = [];
  for (let i = 1; out.length < count && i < 21; i++) {
    const iso = berlinDay(i);
    if (weekday(iso) !== 0) out.push(iso);
  }
  return out;
}
/** Saturdays the office closes at 14:00: only the windows that fit. */
const slotsFor = (iso: string) => (iso && weekday(iso) === 6 ? INSPECTION_SLOTS.filter((x) => x.id === 'morning' || x.id === 'midday') : INSPECTION_SLOTS);
const dayLabel = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });

interface OnlineAppointmentBookingProps {
  hideHeader?: boolean;
  className?: string;
  place?: string;
}

export default function OnlineAppointmentBooking({ hideHeader = false, className = '', place }: OnlineAppointmentBookingProps) {
  // the days are worked out in the visitor's browser: the page is built once, the calendar moves on
  const [days, setDays] = useState<string[]>([]);
  const [otherDay, setOtherDay] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<InspectionSlot>(INSPECTION_SLOTS[0]);
  const tomorrowStr = days[0] || '';
  React.useEffect(() => {
    const next = bookableDays(6);
    setDays(next);
    setSelectedDate((d) => d || next[0]);
  }, []);
  const pickDate = (iso: string) => {
    setSelectedDate(iso);
    const fits = slotsFor(iso);
    setSelectedSlot((cur) => (fits.some((x) => x.id === cur.id) ? cur : fits[0]));
  };
  const [name, setName] = useState<string>('');
  const [sendError, setSendError] = useState<string>('');
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
    if (!name.trim() || !phone.trim() || !address.trim() || !selectedDate || weekday(selectedDate) === 0) return;

    setSubmitting(true);
    setSendError('');
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

      if (!res.ok || !res.id) {
        setSendError(res.error || 'server');
        return;
      }
      setAssignedLeadId(res.id);
      setBookedSuccess(true);
    } catch {
      setSendError('network');
    } finally {
      setSubmitting(false);
    }
  };

  const calTitle = `SOS Abdichtung · Vor-Ort-Feuchtigkeitsmessung (${name})`;
  const calDesc = `Kostenlose Vor-Ort-Schadensanalyse & Feuchtemessung durch Inhaber Shahzad Mahmood (${COMPANY_INFO.phoneDisplay}).\nSchadensart: ${damageType}\nKunde: ${name} (${phone})\nAdresse: ${address}\nVorgangs-ID: ${assignedLeadId}`;
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
              Online buchen: Vor-Ort-Feuchtemessung{activePlace ? ` in ${activePlace}` : ''}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Wählen Sie Tag und Zeitfenster. Inhaber <strong>{COMPANY_INFO.owner}</strong> ruft Sie zur Bestätigung an und misst
              die Feuchte bei Ihnen vor Ort – kostenfrei in ganz NRW.
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
                Wunschtermin angefragt · Vorgang {assignedLeadId}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Vielen Dank, {name}!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Ihr Wunschtermin ist bei uns angekommen. Herr {COMPANY_INFO.owner.split(' ').pop()} ruft Sie in der Regel noch am selben
                Werktag an und bestätigt den Termin.
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
                {selectedSlot.label}: {selectedSlot.timeRange}
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
                <span>Vorläufig in Google Kalender eintragen ↗</span>
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
              Wir rufen Sie unter <strong>{phone}</strong> an. Eilig? Rufen Sie direkt an:{' '}
              <a href={`tel:${COMPANY_INFO.phoneTel}`} className="font-bold underline underline-offset-2">{COMPANY_INFO.phoneDisplay}</a>
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
                <span className="text-xs font-semibold text-slate-600">Montag bis Samstag</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                <fieldset className="sm:col-span-5">
                  <legend className="block text-xs font-bold text-slate-700 mb-1">Tag *</legend>
                  <div className="grid grid-cols-3 gap-2">
                    {days.map((iso) => {
                      const on = !otherDay && selectedDate === iso;
                      return (
                        <button
                          key={iso}
                          type="button"
                          aria-pressed={on}
                          onClick={() => {
                            setOtherDay(false);
                            pickDate(iso);
                          }}
                          className={`min-h-[48px] rounded-xl border text-sm font-bold transition-colors ${
                            on ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/30 text-slate-900' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {dayLabel(iso)}
                        </button>
                      );
                    })}
                  </div>
                  {otherDay ? (
                    <div className="mt-2">
                      <label htmlFor="booking-date" className="block text-xs font-bold text-slate-700 mb-1">
                        Anderer Tag
                      </label>
                      <input
                        id="booking-date"
                        type="date"
                        min={tomorrowStr}
                        value={selectedDate}
                        onChange={(e) => {
                          const v = e.target.value;
                          e.target.setCustomValidity(v && weekday(v) === 0 ? 'Sonntags sind keine Termine möglich. Bitte Montag bis Samstag wählen.' : '');
                          pickDate(v);
                        }}
                        required
                        className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 outline-none transition"
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setOtherDay(true)}
                      className="mt-2 min-h-[44px] text-sm font-bold text-emerald-800 underline underline-offset-2"
                    >
                      Anderer Tag …
                    </button>
                  )}
                </fieldset>

                <fieldset className="sm:col-span-7">
                  <legend className="block text-xs font-bold text-slate-700 mb-1">Zeitfenster *</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {slotsFor(selectedDate).map((slot) => {
                      const isSelected = selectedSlot.id === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setSelectedSlot(slot)}
                          className={`min-h-[50px] p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/30 shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-sm text-slate-900">{slot.label}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5">{slot.timeRange}</div>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
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
                    autoComplete="name"
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
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="z. B. 0170 1234567"
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
                    autoComplete="street-address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="z. B. Hauptstr. 12, 42103 Wuppertal"
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
                <span>Unverbindlich und kostenfrei. Wir rufen Sie zur Bestätigung an.</span>
              </div>

              <SendError error={sendError} what="Ihre Terminanfrage" />
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm inline-flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Wird gesendet …</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Wunschtermin anfragen →</span>
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
