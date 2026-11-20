"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { adminCall } from "@/lib/adminApi";
import { Segments, dayDe } from "@/components/admin/AdminKit";

type T = (de: string, en: string) => string;

interface Traffic {
  days: { date: string; views: number; entries: number }[];
  totals: { views: number; entries: number };
  pages: [string, number][];
  sources: [string, number][];
  devices: [string, number][];
  funnel: { visits: number; routes: number; planner: number; requests: number; appts: number; booked: number };
  period: number;
  updated: string;
}

/** Google's own tools: the admin links to them and does not copy or imitate their numbers. */
const TOOLS: { name: string; href: string; de: string; en: string }[] = [
  { name: "Google Ads", href: "https://ads.google.com/aw/campaigns", de: "Kampagnen, Budget, Klicks und Kosten", en: "Campaigns, budget, clicks and cost" },
  { name: "Google Analytics", href: "https://analytics.google.com/", de: "Besucher mit Einwilligung, Ereignisse, Conversions", en: "Visitors with consent, events, conversions" },
  { name: "Search Console", href: "https://search.google.com/search-console?resource_id=https%3A%2F%2Fsos-abdichtung.de%2F", de: "Suchbegriffe, Positionen, Indexierung", en: "Search terms, positions, indexing" },
  { name: "Google-Unternehmensprofil", href: "https://business.google.com/", de: "Profil, Beiträge, Bewertungen, Anrufe und Routen", en: "Profile, posts, reviews, calls and directions" },
];

/**
 * Google & Zahlen: the visits the website counts itself (tab "Besuche" in the Google Sheet) and
 * what came of them, plus links to Google's tools. Every number on this page is real; the former
 * demo figures and switches are gone.
 */
export default function AdminNumbers({ t, onSessionEnd }: { t: T; onSessionEnd: () => void }) {
  const [days, setDays] = useState<"7" | "30" | "90">("30");
  const [data, setData] = useState<Traffic | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    setData(null);
    setErr("");
    adminCall<Traffic>("api_traffic", Number(days)).then((r) => (r.ok ? setData(r.data) : r.error === "login" ? onSessionEnd() : setErr(r.error)));
  }, [days, onSessionEnd]);

  const max = Math.max(1, ...(data?.days || []).map((d) => d.views));
  const list = (rows: [string, number][], empty: string) =>
    rows.length ? (
      <ol className="nm__list">
        {rows.map(([k, v]) => (
          <li key={k}>
            <span>{k || "—"}</span>
            <strong>{v.toLocaleString("de-DE")}</strong>
          </li>
        ))}
      </ol>
    ) : (
      <p className="at__empty">{empty}</p>
    );

  return (
    <div className="at">
      <div className="at__tools">
        <Segments
          value={days}
          onChange={setDays}
          label={t("Zeitraum", "Period")}
          items={[
            ["7", t("7 Tage", "7 days")],
            ["30", t("30 Tage", "30 days")],
            ["90", t("90 Tage", "90 days")],
          ]}
        />
      </div>
      {err && <p className="at__err" role="alert">{t(`Laden fehlgeschlagen: ${err}`, `Loading failed: ${err}`)}</p>}
      {!data && !err && <div className="at__card">{t("Lade Zahlen aus der Google-Tabelle …", "Loading numbers from the Google Sheet …")}</div>}

      {data && (
        <>
          <div className="at__kpis">
            <div>
              <span>{t("Besuche", "Visits")}</span>
              <strong>{data.funnel.visits.toLocaleString("de-DE")}</strong>
            </div>
            <div>
              <span>{t("Seitenaufrufe", "Page views")}</span>
              <strong>{data.totals.views.toLocaleString("de-DE")}</strong>
            </div>
            <div>
              <span>{t("Anfragen", "Inquiries")}</span>
              <strong>{data.funnel.requests.toLocaleString("de-DE")}</strong>
            </div>
            <div>
              <span>{t("Termine", "Appointments")}</span>
              <strong>{data.funnel.appts.toLocaleString("de-DE")}</strong>
            </div>
            <div>
              <span>{t("Gebucht / erledigt", "Booked / done")}</span>
              <strong>{data.funnel.booked.toLocaleString("de-DE")}</strong>
            </div>
          </div>
          {data.totals.views > 0 ? (
            <p className="pg__hint">{t(`Besuche und Seitenaufrufe zählt die Website selbst. Stand: ${dayDe(data.updated)}. Google Analytics zeigt weniger, weil es nur Besucher mit Einwilligung zählt.`, `The website counts visits and page views itself. As of: ${dayDe(data.updated)}. Google Analytics shows fewer, because it only counts visitors who consented.`)}</p>
          ) : (
            <p className="sc__warn" role="status">{t("Die Website zählt derzeit keine Besuche: Die Zählung ist im Hintergrund vorbereitet, aber noch nicht eingeschaltet. Anfragen und Termine unten sind echte Zahlen aus der Google-Tabelle. Besucherzahlen finden Sie bis dahin in Google Analytics.", "The website does not count visits at the moment: the counter is prepared in the background but not switched on yet. Inquiries and appointments are real numbers from the Google Sheet. Until then, visitor numbers are in Google Analytics.")}</p>
          )}

          {data.totals.views > 0 && (<>
          <section className="at__card">
            <h2 className="at__h">{t("Seitenaufrufe pro Tag", "Page views per day")}</h2>
            <ul className="nm__bars" aria-label={t("Seitenaufrufe pro Tag", "Page views per day")}>
              {data.days.map((d) => (
                <li key={d.date} title={`${dayDe(d.date)}: ${d.views}`}>
                  <span style={{ height: `${Math.round((d.views / max) * 100)}%` }} />
                  <span className="visually-hidden">
                    {dayDe(d.date)}: {d.views}
                  </span>
                </li>
              ))}
            </ul>
            <p className="nm__axis">
              <span>{dayDe(data.days[0]?.date || "")}</span>
              <span>{t(`höchster Tag: ${max.toLocaleString("de-DE")}`, `busiest day: ${max.toLocaleString("de-DE")}`)}</span>
              <span>{dayDe(data.days[data.days.length - 1]?.date || "")}</span>
            </p>
          </section>

          <div className="nm__cols">
            <section className="at__card">
              <h2 className="at__h">{t("Meistbesuchte Seiten", "Most visited pages")}</h2>
              {list(data.pages, t("Noch keine Besuche in diesem Zeitraum.", "No visits in this period yet."))}
            </section>
            <section className="at__card">
              <h2 className="at__h">{t("Woher die Besucher kommen", "Where visitors come from")}</h2>
              {list(data.sources, t("Noch keine Daten.", "No data yet."))}
              <h2 className="at__h nm__gap">{t("Geräte", "Devices")}</h2>
              {list(data.devices, t("Noch keine Daten.", "No data yet."))}
            </section>
          </div>
          </>)}
        </>
      )}

      <section className="at__card">
        <h2 className="at__h">{t("Googles eigene Werkzeuge", "Google's own tools")}</h2>
        <p className="pg__hint">{t("Budget, Kampagnen und Suchbegriffe ändern und lesen Sie direkt bei Google. Hier im Admin gibt es dafür bewusst keine Schalter mehr: Die früheren hatten bei Google nichts bewirkt.", "You change and read budget, campaigns and search terms directly at Google. The admin deliberately has no switches for this any more: the former ones had no effect at Google.")}</p>
        <ul className="nm__tools">
          {TOOLS.map((x) => (
            <li key={x.name}>
              <a href={x.href} target="_blank" rel="noopener noreferrer">
                <strong>
                  {x.name} <ExternalLink aria-hidden="true" />
                </strong>
                <span>{t(x.de, x.en)}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
