"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarPlus, Phone, MapPin } from "lucide-react";
import { adminCall } from "@/lib/adminApi";

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
}
interface ApptData {
  appts: Appt[];
  today: string;
  statuses: string[];
  types: Record<string, { de: string; en: string }>;
}

const day = (iso: string) => {
  const d = new Date(iso + "T12:00:00");
  return isNaN(+d) ? iso : d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });
};

/**
 * The real appointments from the Google Sheet: today, upcoming and past, with status
 * changes and the Google Calendar entry. Moving a slot stays in the back office's
 * calendar view for now, because it checks clashes against the opening hours.
 */
export default function AdminAppointments({ t, isEn, onSessionEnd, onOpenLead }: { t: T; isEn: boolean; onSessionEnd: () => void; onOpenLead: (id: string) => void }) {
  const [data, setData] = useState<ApptData | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState("");
  const [past, setPast] = useState(false);

  const fail = useCallback(
    (e: string) => {
      if (e === "login") onSessionEnd();
      else setErr(e);
    },
    [onSessionEnd]
  );
  const load = useCallback(() => {
    adminCall<ApptData>("api_appts").then((r) => (r.ok ? (setData(r.data), setErr("")) : fail(r.error)));
  }, [fail]);
  useEffect(load, [load]);

  const replace = (a: Appt) => setData((d) => (d ? { ...d, appts: d.appts.map((x) => (x.nr === a.nr ? a : x)) } : d));
  const update = async (nr: string, p: Record<string, unknown>) => {
    setBusy(nr);
    const r = await adminCall<Appt>("api_apptUpdate", nr, p);
    setBusy("");
    if (r.ok) replace(r.data);
    else fail(r.error);
  };
  const toCalendar = async (nr: string) => {
    setBusy(nr);
    const r = await adminCall<Appt>("api_apptCalendar", nr);
    setBusy("");
    if (r.ok) replace(r.data);
    else fail(r.error);
  };

  const groups = useMemo(() => {
    if (!data) return null;
    const live = data.appts.filter((a) => a.status !== "Abgesagt");
    return {
      today: live.filter((a) => a.date === data.today),
      next: live.filter((a) => a.date > data.today),
      past: data.appts.filter((a) => a.date < data.today || a.status === "Abgesagt").reverse(),
    };
  }, [data]);

  if (!data || !groups) return <div className="at__card">{err ? t(`Laden fehlgeschlagen: ${err}`, `Loading failed: ${err}`) : t("Lade Termine aus der Google-Tabelle …", "Loading appointments …")}</div>;

  const table = (list: Appt[]) =>
    list.length ? (
      <div className="at__wrap">
        <table className="at__table">
          <thead>
            <tr>
              <th scope="col">{t("Datum", "Date")}</th>
              <th scope="col">{t("Zeit", "Time")}</th>
              <th scope="col">{t("Art", "Type")}</th>
              <th scope="col">{t("Kunde", "Customer")}</th>
              <th scope="col">{t("Adresse", "Address")}</th>
              <th scope="col">Status</th>
              <th scope="col">{t("Kalender", "Calendar")}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.nr} className={busy === a.nr ? "is-busy" : ""}>
                <td className="at__strong">{day(a.date)}</td>
                <td>
                  {a.time} <span className="at__dim">· {a.min} min</span>
                </td>
                <td>{(data.types[a.type] && (isEn ? data.types[a.type].en : data.types[a.type].de)) || a.type}</td>
                <td>
                  <span className="at__strong">{a.name}</span>
                  <span className="at__sub">
                    {a.phone && (
                      <a href={`tel:${a.phone.replace(/[^\d+]/g, "")}`}>
                        <Phone aria-hidden="true" /> {a.phone}
                      </a>
                    )}
                    {a.lead && (
                      <button type="button" className="at__link" onClick={() => onOpenLead(a.lead)}>
                        {a.lead}
                      </button>
                    )}
                  </span>
                </td>
                <td>
                  {a.address ? (
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.address)}`} target="_blank" rel="noopener noreferrer">
                      <MapPin aria-hidden="true" /> {a.address}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <select value={a.status} aria-label={t(`Status von ${a.nr}`, `Status of ${a.nr}`)} disabled={busy === a.nr} onChange={(e) => update(a.nr, { status: e.target.value })}>
                    {data.statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  {a.calendar ? (
                    <span className="at__ok">{t("Im Kalender", "In calendar")}</span>
                  ) : (
                    <button type="button" className="at__btn" disabled={busy === a.nr || a.status === "Abgesagt"} onClick={() => toCalendar(a.nr)}>
                      <CalendarPlus aria-hidden="true" /> {t("Eintragen", "Add")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="at__empty">{t("Keine Termine.", "No appointments.")}</p>
    );

  return (
    <div className="at">
      {err && <p className="at__err">{err}</p>}
      <section className="at__card">
        <h2 className="at__h">
          {t("Heute", "Today")} <span>{groups.today.length}</span>
        </h2>
        {table(groups.today)}
      </section>
      <section className="at__card">
        <h2 className="at__h">
          {t("Kommende Termine", "Upcoming")} <span>{groups.next.length}</span>
        </h2>
        {table(groups.next)}
      </section>
      <section className="at__card">
        <button type="button" className="at__fold" onClick={() => setPast(!past)} aria-expanded={past}>
          {t("Vergangene & abgesagte Termine", "Past & cancelled")} <span>{groups.past.length}</span>
        </button>
        {past && table(groups.past)}
      </section>
    </div>
  );
}
