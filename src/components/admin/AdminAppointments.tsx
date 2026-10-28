"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarPlus, Phone, MapPin, MessageCircle, Mail, Search, FolderOpen, Video, Home, PhoneCall, Plus, CalendarClock } from "lucide-react";
import type { WorkspaceLead } from "@/lib/backend";
import { ApptForm } from "@/components/admin/AdminForms";
import { adminCall } from "@/lib/adminApi";
import { DataTable, Drawer, Field, Segments, status, dayDe, telHref, waHref, mapsHref, type Column } from "@/components/admin/AdminKit";

type T = (de: string, en: string) => string;

/** An appointment as the back office's sheet holds it (allAppts_ in Shared.js). */
interface Appt {
  nr: string;
  status: string;
  type: string;
  date: string;
  time: string;
  min: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  to: string;
  message: string;
  lead: string;
  calendar: string;
  note: string;
  received?: string;
  source?: string;
}
interface ApptData {
  appts: Appt[];
  today: string;
  statuses: string[];
  types: Record<string, { de: string; en: string }>;
}
type Seg = "today" | "next" | "open" | "past" | "cancelled" | "all";

const TYPE_ICON: Record<string, typeof Home> = { visit: Home, video: Video, call: PhoneCall };
const town = (a: string) => (a.split(",").pop() || "").replace(/^\s*\d{5}\s*/, "").trim();
const addDays = (iso: string, n: number) => new Date(new Date(iso + "T12:00:00").getTime() + n * 864e5).toISOString().slice(0, 10);

/**
 * Termine: the real appointments from the Google Sheet as one table with filters and
 * pages; a row opens the detail with everything about the visit and the actions.
 */
export default function AdminAppointments({
  t,
  isEn,
  onSessionEnd,
  onOpenLead,
  leads,
  createFor,
  onCreateDone,
}: {
  t: T;
  isEn: boolean;
  onSessionEnd: () => void;
  onOpenLead: (id: string) => void;
  leads: WorkspaceLead[];
  /** an enquiry to create an appointment for ("" = free), from the enquiry's single view */
  createFor: string | null;
  onCreateDone: () => void;
}) {
  const [data, setData] = useState<ApptData | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [seg, setSeg] = useState<Seg>("next");
  const [q, setQ] = useState("");
  const [openNr, setOpenNr] = useState("");
  const [note, setNote] = useState("");
  const [creating, setCreating] = useState<string | null>(null);
  const [move, setMove] = useState({ date: "", time: "", notify: true });
  useEffect(() => {
    if (createFor !== null) setCreating(createFor);
  }, [createFor]);

  const fail = useCallback((e: string) => (e === "login" ? onSessionEnd() : setErr(e)), [onSessionEnd]);
  useEffect(() => {
    adminCall<ApptData>("api_appts").then((r) => {
      if (!r.ok) return fail(r.error);
      setData(r.data);
      // the first look: today if there is something today, else what comes next
      if (r.data.appts.some((a) => a.date === r.data.today && a.status !== "Abgesagt")) setSeg("today");
    });
  }, [fail]);

  const typeLabel = (k: string) => (data?.types[k] ? (isEn ? data.types[k].en : data.types[k].de) : k);

  const split = useMemo(() => {
    if (!data) return null;
    const d = data.today, week = addDays(d, 7), live = (a: Appt) => a.status !== "Abgesagt";
    return {
      today: data.appts.filter((a) => live(a) && a.date === d),
      next: data.appts.filter((a) => live(a) && a.date >= d && a.status !== "Erledigt"),
      open: data.appts.filter((a) => a.status === "Gebucht" && a.date >= d),
      past: data.appts.filter((a) => live(a) && (a.date < d || a.status === "Erledigt")),
      cancelled: data.appts.filter((a) => !live(a)),
      all: data.appts,
      week: data.appts.filter((a) => live(a) && a.date >= d && a.date < week).length,
    };
  }, [data]);

  const rows = useMemo(() => {
    if (!split) return [];
    const needle = q.trim().toLowerCase();
    return split[seg].filter((a) => !needle || [a.nr, a.name, a.phone, a.email, a.address, a.lead, a.to].join(" ").toLowerCase().includes(needle));
  }, [split, seg, q]);

  const cur = data?.appts.find((a) => a.nr === openNr) || null;
  useEffect(() => {
    setNote(cur?.note || "");
    setMove({ date: cur?.date || "", time: cur?.time || "", notify: true });
  }, [cur?.nr, cur?.note, cur?.date, cur?.time]);

  const replace = (a: Appt) => setData((d) => (d ? { ...d, appts: d.appts.map((x) => (x.nr === a.nr ? a : x)) } : d));
  const call = async (fn: string, ...args: unknown[]) => {
    setBusy(true);
    const r = await adminCall<Appt>(fn, ...args);
    setBusy(false);
    if (r.ok) {
      replace(r.data);
      setErr("");
    } else fail(r.error);
  };

  if (!data || !split) return <div className="at__card">{err ? t(`Laden fehlgeschlagen: ${err}`, `Loading failed: ${err}`) : t("Lade Termine aus der Google-Tabelle …", "Loading appointments …")}</div>;

  const columns: Column<Appt>[] = [
    {
      key: "when",
      label: t("Termin", "When"),
      sort: (a) => a.date + a.time,
      cell: (a) => (
        <>
          <span className="at__strong">{dayDe(a.date, true)}</span>
          <span className="at__sub">
            {a.time} · {a.min} min
          </span>
        </>
      ),
    },
    {
      key: "type",
      label: t("Art", "Type"),
      sort: (a) => a.type,
      cell: (a) => {
        const I = TYPE_ICON[a.type] || Home;
        return (
          <span className="dt__type">
            <I aria-hidden="true" /> {typeLabel(a.type).replace(/\s*\(.*\)$/, "")}
          </span>
        );
      },
    },
    {
      key: "who",
      label: t("Kunde", "Customer"),
      sort: (a) => a.name.toLowerCase(),
      cell: (a) => (
        <>
          <span className="at__strong">{a.name}</span>
          {a.phone && <span className="at__sub">{a.phone}</span>}
        </>
      ),
    },
    { key: "town", label: t("Ort", "Town"), sort: (a) => town(a.address), cell: (a) => town(a.address) || "—" },
    { key: "status", label: "Status", sort: (a) => a.status, cell: (a) => status(a.status) },
    { key: "cal", label: t("Kalender", "Calendar"), cell: (a) => (a.calendar ? <span className="at__ok">✓</span> : <span className="at__dim">—</span>) },
  ];

  return (
    <div className="at">
      <div className="at__kpis">
        <div>
          <span>{t("Heute", "Today")}</span>
          <strong>{split.today.length}</strong>
        </div>
        <div>
          <span>{t("Nächste 7 Tage", "Next 7 days")}</span>
          <strong>{split.week}</strong>
        </div>
        <div>
          <span>{t("Noch zu bestätigen", "To confirm")}</span>
          <strong className={split.open.length ? "is-bad" : ""}>{split.open.length}</strong>
        </div>
      </div>

      <div className="at__tools">
        <Segments
          value={seg}
          onChange={setSeg}
          label={t("Termine filtern", "Filter appointments")}
          items={[
            ["today", t("Heute", "Today"), split.today.length],
            ["next", t("Kommend", "Upcoming"), split.next.length],
            ["open", t("Zu bestätigen", "To confirm"), split.open.length],
            ["past", t("Vergangen", "Past"), split.past.length],
            ["cancelled", t("Abgesagt", "Cancelled"), split.cancelled.length],
            ["all", t("Alle", "All"), split.all.length],
          ]}
        />
        <label className="at__search">
          <Search aria-hidden="true" />
          <span className="visually-hidden">{t("Termine durchsuchen", "Search appointments")}</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Name, Telefon, Ort, Anfrage …", "Name, phone, town, inquiry …")} />
        </label>
        <button type="button" className="btn-shine at__new" onClick={() => setCreating("")}>
          <Plus aria-hidden="true" /> {t("Neuer Termin", "New appointment")}
        </button>
      </div>

      {creating !== null && (
        <ApptForm<Appt>
          t={t}
          leads={leads}
          leadId={creating}
          onSessionEnd={onSessionEnd}
          onClose={() => {
            setCreating(null);
            onCreateDone();
          }}
          onSaved={(a) => {
            setData((d) => (d ? { ...d, appts: [...d.appts, a] } : d));
            setCreating(null);
            onCreateDone();
            setOpenNr(a.nr);
          }}
        />
      )}

      {err && <p className="at__err">{err}</p>}

      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(a) => a.nr}
        onOpen={(a) => setOpenNr(a.nr)}
        activeKey={openNr}
        t={t}
        empty={t("Keine Termine in dieser Ansicht.", "No appointments in this view.")}
        initialSort={{ key: "when", dir: seg === "past" || seg === "cancelled" ? -1 : 1 }}
      />

      <Drawer
        open={!!cur}
        onClose={() => setOpenNr("")}
        t={t}
        title={cur ? `${cur.name}` : ""}
        sub={cur ? `${dayDe(cur.date, true)}${cur.date.slice(0, 4)} · ${cur.time} · ${cur.min} min · ${cur.nr}` : ""}
      >
        {cur && (
          <>
            <div className="dw__acts">
              {cur.phone && (
                <a className="at__btn" href={telHref(cur.phone)}>
                  <Phone aria-hidden="true" /> {t("Anrufen", "Call")}
                </a>
              )}
              {cur.phone && (
                <a className="at__btn" href={waHref(cur.phone)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle aria-hidden="true" /> WhatsApp
                </a>
              )}
              {cur.email && (
                <a className="at__btn" href={`mailto:${cur.email}`}>
                  <Mail aria-hidden="true" /> {t("E-Mail", "E-mail")}
                </a>
              )}
              {cur.address && (
                <a className="at__btn" href={mapsHref(cur.address)} target="_blank" rel="noopener noreferrer">
                  <MapPin aria-hidden="true" /> {t("Route", "Route")}
                </a>
              )}
            </div>

            <dl className="dw__grid">
              <Field label={t("Art", "Type")}>{typeLabel(cur.type)}</Field>
              <Field label="Status">
                <select value={cur.status} disabled={busy} onChange={(e) => call("api_apptUpdate", cur.nr, { status: e.target.value })} aria-label="Status">
                  {data.statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label={t("Adresse", "Address")} wide>
                {cur.address}
              </Field>
              <Field label={t("Telefon", "Phone")}>{cur.phone}</Field>
              <Field label={t("E-Mail", "E-mail")}>{cur.email}</Field>
              <Field label={t("Schadensbild", "Damage")} wide>
                {cur.to}
              </Field>
              <Field label={t("Nachricht des Kunden", "Customer's message")} wide>
                {cur.message}
              </Field>
              <Field label={t("Quelle", "Source")}>{cur.source || ""}</Field>
              <Field label={t("Google Kalender", "Google Calendar")}>
                {cur.calendar ? (
                  <span className="at__ok">{t("Eingetragen", "Added")}</span>
                ) : (
                  <button type="button" className="at__btn" disabled={busy || cur.status === "Abgesagt"} onClick={() => call("api_apptCalendar", cur.nr)}>
                    <CalendarPlus aria-hidden="true" /> {t("Eintragen & bestätigen", "Add & confirm")}
                  </button>
                )}
              </Field>
            </dl>

            {cur.status !== "Abgesagt" && cur.status !== "Erledigt" && (
              <div className="dw__move">
                <p className="dw__h">
                  <CalendarClock aria-hidden="true" /> {t("Verschieben", "Move")}
                </p>
                <div className="ed__row">
                  <label>
                    {t("Neues Datum", "New date")}
                    <input type="date" value={move.date} onChange={(e) => setMove({ ...move, date: e.target.value })} />
                  </label>
                  <label>
                    {t("Neue Uhrzeit", "New time")}
                    <input type="time" step={900} value={move.time} onChange={(e) => setMove({ ...move, time: e.target.value })} />
                  </label>
                </div>
                <label className="ed__check">
                  <input type="checkbox" checked={move.notify} disabled={!cur.email} onChange={(e) => setMove({ ...move, notify: e.target.checked })} />
                  {t("Kunde per E-Mail informieren", "Tell the customer by e-mail")}
                </label>
                <button
                  type="button"
                  className="at__btn"
                  disabled={busy || !move.date || !move.time || (move.date === cur.date && move.time === cur.time)}
                  onClick={() => call("api_apptUpdate", cur.nr, { date: move.date, time: move.time, notify: move.notify && !!cur.email })}
                >
                  {t("Termin verschieben", "Move appointment")}
                </button>
              </div>
            )}

            <label className="dw__note">
              {t("Interne Notiz", "Internal note")}
              <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("z. B. Schlüssel beim Nachbarn, Hund im Garten …", "e.g. key with the neighbour …")} />
            </label>
            <div className="dw__acts">
              <button type="button" className="at__btn" disabled={busy || note === (cur.note || "")} onClick={() => call("api_apptUpdate", cur.nr, { note })}>
                {t("Notiz speichern", "Save note")}
              </button>
              {cur.lead && (
                <button
                  type="button"
                  className="btn-shine at__new"
                  onClick={() => {
                    setOpenNr("");
                    onOpenLead(cur.lead);
                  }}
                >
                  <FolderOpen aria-hidden="true" /> {t(`Anfrage ${cur.lead} öffnen`, `Open inquiry ${cur.lead}`)}
                </button>
              )}
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
}
