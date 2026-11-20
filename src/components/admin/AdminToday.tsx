"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Inbox, Megaphone, Star, Zap } from "lucide-react";
import { adminCall } from "@/lib/adminApi";
import { dayDe } from "@/components/admin/AdminKit";

type T = (de: string, en: string) => string;
type Go = "leads" | "termine" | "social" | "reviews" | "auto";

interface PostDue {
  id: string;
  date: string;
  topic: string;
  open: string[];
}
interface Appt {
  nr: string;
  date: string;
  time: string;
  name: string;
  address: string;
  type: string;
}
interface Today {
  date: string;
  postsToday: PostDue[];
  postsLate: PostDue[];
  apptsToday: Appt[];
  apptsTomorrow: Appt[];
  leadsNew: number;
  leads: { id: string; name: string; received: string }[];
  reviewsOpen: number;
  autosOn: number;
  autosAll: number;
}

/**
 * Heute: the short list of what needs doing today, from the Google Sheet. Every line leads to the
 * page where it is done. Shown at the top of the overview.
 */
export default function AdminToday({ t, onGo, onSessionEnd }: { t: T; onGo: (tab: Go) => void; onSessionEnd: () => void }) {
  const [data, setData] = useState<Today | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    adminCall<Today>("api_today").then((r) => (r.ok ? setData(r.data) : r.error === "login" ? onSessionEnd() : setErr(r.error)));
  }, [onSessionEnd]);

  if (err) return <p className="at__err" role="alert">{t(`„Heute“ konnte nicht geladen werden: ${err}`, `“Today” could not be loaded: ${err}`)}</p>;
  if (!data) return <div className="at__card">{t("Lade, was heute ansteht …", "Loading today's tasks …")}</div>;

  const posts = data.postsToday.length + data.postsLate.length;
  const nothing = !data.leadsNew && !data.apptsToday.length && !data.apptsTomorrow.length && !posts && !data.reviewsOpen;
  const appt = (a: Appt) => `${a.time} ${a.name}${a.address ? `, ${a.address}` : ""}`;

  return (
    <section className="at__card td" aria-labelledby="td-title">
      <div className="td__head">
        <h2 id="td-title">{t("Heute", "Today")} · {dayDe(data.date, true)}</h2>
        <button type="button" className="td__auto" onClick={() => onGo("auto")}>
          <Zap aria-hidden="true" /> {t(`Automatik: ${data.autosOn} von ${data.autosAll} an`, `Automations: ${data.autosOn} of ${data.autosAll} on`)}
        </button>
      </div>
      {nothing && <p className="at__empty">{t("Für heute steht nichts an.", "Nothing is due today.")}</p>}
      <ul className="td__list">
        {data.leadsNew > 0 && (
          <li>
            <Inbox aria-hidden="true" />
            <div>
              <strong>{t(`${data.leadsNew} neue ${data.leadsNew === 1 ? "Anfrage" : "Anfragen"} beantworten`, `Answer ${data.leadsNew} new ${data.leadsNew === 1 ? "inquiry" : "inquiries"}`)}</strong>
              <span>{data.leads.map((l) => `${l.id} ${l.name}`).join(" · ")}</span>
            </div>
            <button type="button" className="at__btn" onClick={() => onGo("leads")}>{t("Anfragen", "Inquiries")}</button>
          </li>
        )}
        {(data.apptsToday.length > 0 || data.apptsTomorrow.length > 0) && (
          <li>
            <CalendarClock aria-hidden="true" />
            <div>
              <strong>{t(`Termine: ${data.apptsToday.length} heute, ${data.apptsTomorrow.length} morgen`, `Appointments: ${data.apptsToday.length} today, ${data.apptsTomorrow.length} tomorrow`)}</strong>
              {data.apptsToday.map((a) => <span key={a.nr}>{t("Heute", "Today")} {appt(a)}</span>)}
              {data.apptsTomorrow.map((a) => <span key={a.nr}>{t("Morgen", "Tomorrow")} {appt(a)}</span>)}
            </div>
            <button type="button" className="at__btn" onClick={() => onGo("termine")}>{t("Termine", "Appointments")}</button>
          </li>
        )}
        {posts > 0 && (
          <li>
            <Megaphone aria-hidden="true" />
            <div>
              <strong>{t(`${posts} ${posts === 1 ? "Beitrag" : "Beiträge"} veröffentlichen`, `Publish ${posts} ${posts === 1 ? "post" : "posts"}`)}</strong>
              {data.postsToday.map((p) => <span key={p.id}>{t("Heute", "Today")}: {p.topic} ({p.open.join(", ")})</span>)}
              {data.postsLate.map((p) => <span key={p.id}>{t("Überfällig seit", "Overdue since")} {dayDe(p.date)}: {p.topic} ({p.open.join(", ")})</span>)}
            </div>
            <button type="button" className="at__btn" onClick={() => onGo("social")}>{t("Beiträge", "Posts")}</button>
          </li>
        )}
        {data.reviewsOpen > 0 && (
          <li>
            <Star aria-hidden="true" />
            <div>
              <strong>{t(`${data.reviewsOpen} ${data.reviewsOpen === 1 ? "Kunden" : "Kunden"} um eine Bewertung bitten`, `Ask ${data.reviewsOpen} ${data.reviewsOpen === 1 ? "customer" : "customers"} for a review`)}</strong>
              <span>{t("Die Nachricht mit Ort und Bewertungslink ist fertig.", "The message with town and review link is ready.")}</span>
            </div>
            <button type="button" className="at__btn" onClick={() => onGo("reviews")}>{t("Bewertungen", "Reviews")}</button>
          </li>
        )}
      </ul>
    </section>
  );
}
