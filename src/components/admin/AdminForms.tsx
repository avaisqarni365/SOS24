"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { adminCall, type SheetLead } from "@/lib/adminApi";
import type { WorkspaceLead } from "@/lib/backend";
import { Drawer } from "@/components/admin/AdminKit";

type T = (de: string, en: string) => string;

export const SERVICES = [
  "Feuchte Wände & Horizontalsperre",
  "Kellersanierung (von innen)",
  "Kellerinnenabdichtung",
  "Schimmelbeseitigung",
  "Feuchtemessung & Gutachten",
  "Rissverpressung",
  "Dachabdichtung",
  "Balkon & Terrasse",
  "Sockelabdichtung",
];
const CHANNELS = ["Telefon", "WhatsApp", "E-Mail", "Vor Ort", "Messe / Empfehlung"];
const PAYERS = ["Eigentümer / Selbstzahler", "Hausverwaltung / WEG", "Versicherung", "Vermieter / Bauträger", "Andere"];

/**
 * A new enquiry (phone call, fair, walk-in) or a change to an enquiry's customer data.
 * The back office gives the number (api_leadCreate) or writes the changes (api_leadEdit).
 */
export function LeadForm({ t, lead, onClose, onSaved, onSessionEnd }: { t: T; lead: WorkspaceLead | null; onClose: () => void; onSaved: (l: SheetLead) => void; onSessionEnd: () => void }) {
  const edit = !!lead;
  const [f, setF] = useState({ name: "", phone: "", email: "", address: "", service: SERVICES[0], channel: CHANNELS[0], message: "", payer: PAYERS[0] });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => {
    if (lead) setF({ name: lead.name, phone: lead.phone, email: lead.email, address: lead.address, service: lead.damageType || SERVICES[0], channel: CHANNELS[0], message: lead.message, payer: PAYERS[0] });
  }, [lead]);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    // an edit sends the customer fields only; channel and payer belong to how the enquiry came in
    const r = edit
      ? await adminCall<SheetLead>("api_leadEdit", lead!.id, { name: f.name, phone: f.phone, email: f.email, address: f.address, service: f.service, message: f.message })
      : await adminCall<SheetLead>("api_leadCreate", f);
    setBusy(false);
    if (r.ok) onSaved(r.data);
    else if (r.error === "login") onSessionEnd();
    else setErr(r.error);
  };

  return (
    <Drawer open onClose={onClose} t={t} title={edit ? t(`Kundendaten ${lead!.id}`, `Customer data ${lead!.id}`) : t("Neue Anfrage", "New inquiry")} sub={edit ? lead!.name : t("z. B. nach einem Anruf oder vor Ort", "e.g. after a phone call")}>
      <form className="ed" onSubmit={submit}>
        {err && <p className="at__err">{err}</p>}
        <fieldset className="ed__box" disabled={busy}>
          <legend>{t("Kunde", "Customer")}</legend>
          <label>
            {t("Name *", "Name *")}
            <input value={f.name} onChange={set("name")} required autoComplete="off" />
          </label>
          <div className="ed__row">
            <label className="ed__grow">
              {t("Telefon", "Phone")}
              <input type="tel" value={f.phone} onChange={set("phone")} />
            </label>
            <label className="ed__grow">
              {t("E-Mail", "E-mail")}
              <input type="email" value={f.email} onChange={set("email")} />
            </label>
          </div>
          <label>
            {t("Adresse des Objekts (Straße, PLZ Ort)", "Property address")}
            <input value={f.address} onChange={set("address")} placeholder="Musterstr. 1, 45130 Essen" />
          </label>
        </fieldset>
        <fieldset className="ed__box" disabled={busy}>
          <legend>{t("Anliegen", "Request")}</legend>
          <div className="ed__row">
            <label className="ed__grow">
              {t("Leistung", "Service")}
              <select value={f.service} onChange={set("service")}>
                {(SERVICES.includes(f.service) ? SERVICES : [f.service, ...SERVICES]).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            {!edit && (
              <>
                <label>
                  {t("Kontaktweg", "Channel")}
                  <select value={f.channel} onChange={set("channel")}>
                    {CHANNELS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="ed__grow">
                  {t("Kostenträger", "Payer")}
                  <select value={f.payer} onChange={set("payer")}>
                    {PAYERS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </>
            )}
          </div>
          <label>
            {t("Notiz zum Gespräch / Schadensbild", "Notes / damage")}
            <textarea rows={4} value={f.message} onChange={set("message")} />
          </label>
        </fieldset>
        <div className="ed__bar">
          <button type="button" className="at__btn" onClick={onClose}>
            {t("Abbrechen", "Cancel")}
          </button>
          <button type="submit" className="btn-shine at__new" disabled={busy || !f.name.trim() || (!f.phone.trim() && !f.email.trim())}>
            <Save aria-hidden="true" /> {busy ? t("Speichert …", "Saving …") : edit ? t("Änderungen speichern", "Save changes") : t("Anfrage anlegen", "Create inquiry")}
          </button>
        </div>
      </form>
    </Drawer>
  );
}

const TYPES: [string, string][] = [
  ["visit", "Vor-Ort-Feuchtigkeitsmessung (60 min)"],
  ["video", "Video-Ersteinschätzung (30 min)"],
  ["call", "Telefonische Fachberatung (30 min)"],
];

/**
 * A new appointment, from an enquiry (customer data comes with it) or free; the back office
 * checks opening hours, blocked days and clashes (api_apptCreate), can put it into Google
 * Calendar and send the customer the confirmation.
 */
export function ApptForm<A>({ t, leads, leadId, onClose, onSaved, onSessionEnd }: { t: T; leads: WorkspaceLead[]; leadId?: string; onClose: () => void; onSaved: (a: A) => void; onSessionEnd: () => void }) {
  const [f, setF] = useState({ lead: leadId || "", type: "visit", date: "", time: "09:00", name: "", phone: "", email: "", address: "", note: "", calendar: true, notify: false });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const L = leads.find((l) => l.id === f.lead);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await adminCall<A>("api_apptCreate", f);
    setBusy(false);
    if (r.ok) onSaved(r.data);
    else if (r.error === "login") onSessionEnd();
    else setErr(r.error);
  };

  return (
    <Drawer open onClose={onClose} t={t} title={t("Neuer Termin", "New appointment")} sub={L ? `${L.id} · ${L.name}` : t("frei oder zu einer Anfrage", "free or for an inquiry")}>
      <form className="ed" onSubmit={submit}>
        {err && <p className="at__err">{err}</p>}
        <fieldset className="ed__box" disabled={busy}>
          <legend>{t("Termin", "Appointment")}</legend>
          <label>
            {t("Anfrage", "Inquiry")}
            <select value={f.lead} onChange={set("lead")}>
              <option value="">{t("— ohne Anfrage —", "— no inquiry —")}</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.id} · {l.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t("Art", "Type")}
            <select value={f.type} onChange={set("type")}>
              {TYPES.map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <div className="ed__row">
            <label>
              {t("Datum *", "Date *")}
              <input type="date" value={f.date} onChange={set("date")} required min={new Date().toISOString().slice(0, 10)} />
            </label>
            <label>
              {t("Uhrzeit *", "Time *")}
              <input type="time" value={f.time} onChange={set("time")} required step={900} />
            </label>
          </div>
        </fieldset>
        {!L && (
          <fieldset className="ed__box" disabled={busy}>
            <legend>{t("Kunde", "Customer")}</legend>
            <label>
              {t("Name *", "Name *")}
              <input value={f.name} onChange={set("name")} required />
            </label>
            <div className="ed__row">
              <label className="ed__grow">
                {t("Telefon", "Phone")}
                <input type="tel" value={f.phone} onChange={set("phone")} />
              </label>
              <label className="ed__grow">
                {t("E-Mail", "E-mail")}
                <input type="email" value={f.email} onChange={set("email")} />
              </label>
            </div>
            <label>
              {t("Adresse", "Address")}
              <input value={f.address} onChange={set("address")} placeholder="Musterstr. 1, 45130 Essen" />
            </label>
          </fieldset>
        )}
        <fieldset className="ed__box" disabled={busy}>
          <legend>{t("Weiteres", "More")}</legend>
          <label>
            {t("Interne Notiz", "Internal note")}
            <textarea rows={2} value={f.note} onChange={set("note")} />
          </label>
          <label className="ed__check">
            <input type="checkbox" checked={f.calendar} onChange={set("calendar")} />
            {t("In Google Kalender eintragen", "Add to Google Calendar")}
          </label>
          <label className="ed__check">
            <input type="checkbox" checked={f.notify} onChange={set("notify")} disabled={!(L?.email || f.email)} />
            {t("Kunde per E-Mail bestätigen", "Confirm to the customer by e-mail")}
          </label>
        </fieldset>
        <div className="ed__bar">
          <button type="button" className="at__btn" onClick={onClose}>
            {t("Abbrechen", "Cancel")}
          </button>
          <button type="submit" className="btn-shine at__new" disabled={busy || !f.date || !f.time || (!L && !f.name.trim())}>
            <Save aria-hidden="true" /> {busy ? t("Prüft & speichert …", "Checking & saving …") : t("Termin anlegen", "Create appointment")}
          </button>
        </div>
      </form>
    </Drawer>
  );
}
