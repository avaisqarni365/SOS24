"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, ExternalLink } from "lucide-react";
import { adminCall, SOCIAL_KEYS, type SiteContent, type SiteItem, type SocialKey } from "@/lib/adminApi";

type T = (de: string, en: string) => string;

const SOCIAL_LABEL: Record<SocialKey, [string, string]> = {
  instagram: ["Instagram", "https://instagram.com/…"],
  facebook: ["Facebook", "https://facebook.com/…"],
  youtube: ["YouTube", "https://youtube.com/@…"],
  tiktok: ["TikTok", "https://tiktok.com/@…"],
  linkedin: ["LinkedIn", "https://linkedin.com/company/…"],
  google_reviews: ["Google-Bewertungen", "https://g.page/r/…/review"],
  whatsapp_channel: ["WhatsApp-Kanal", "https://whatsapp.com/channel/…"],
};

const today = () => new Date().toISOString().slice(0, 10);
const blank = (kind: SiteItem["kind"]): SiteItem => ({ kind, date: today(), title: "", text: "", link: "", name: "", place: "", stars: kind === "Stimme" ? 5 : 0, visible: true });
const httpsOk = (v: string) => !v || /^https:\/\/\S{4,}$/.test(v.trim());

/**
 * "Website & Kanäle": what customers see change every day. The channels show in the
 * site footer, news and reviews on the home page, as soon as they are saved; entries
 * marked hidden stay drafts. Everything is kept in the Google Sheet (tab "Website").
 */
export default function AdminSiteContent({ t, onSessionEnd }: { t: T; onSessionEnd: () => void }) {
  const [data, setData] = useState<SiteContent | null>(null);
  const [state, setState] = useState<"load" | "idle" | "save" | "saved" | "error">("load");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    adminCall<SiteContent & { ok: boolean }>("api_siteContent").then((r) => {
      if (r.ok) {
        setData({ social: r.data.social || {}, news: r.data.news || [], reviews: r.data.reviews || [] });
        setState("idle");
      } else if (r.error === "login") onSessionEnd();
      else {
        setState("error");
        setMsg(r.error);
      }
    });
  }, [onSessionEnd]);

  if (!data) {
    return <div className="asc__card">{state === "error" ? t(`Laden fehlgeschlagen: ${msg}`, `Loading failed: ${msg}`) : t("Lade Inhalte aus der Google-Tabelle …", "Loading content from the Google Sheet …")}</div>;
  }

  const badLinks = [...Object.values(data.social), ...data.news.map((n) => n.link), ...data.reviews.map((n) => n.link)].some((v) => !httpsOk(v || ""));

  const save = async () => {
    setState("save");
    const r = await adminCall<SiteContent>("api_siteSave", data);
    if (r.ok) {
      setData({ social: r.data.social || {}, news: r.data.news || [], reviews: r.data.reviews || [] });
      setState("saved");
    } else if (r.error === "login") onSessionEnd();
    else {
      setState("error");
      setMsg(r.error);
    }
  };

  const setItem = (list: "news" | "reviews", i: number, patch: Partial<SiteItem>) => {
    setState("idle");
    setData({ ...data, [list]: data[list].map((it, j) => (j === i ? { ...it, ...patch } : it)) });
  };
  const add = (list: "news" | "reviews") => {
    setState("idle");
    setData({ ...data, [list]: [blank(list === "news" ? "Aktuell" : "Stimme"), ...data[list]] });
  };
  const remove = (list: "news" | "reviews", i: number) => {
    setState("idle");
    setData({ ...data, [list]: data[list].filter((_, j) => j !== i) });
  };

  const items = (list: "news" | "reviews") =>
    data[list].map((it, i) => (
      <div key={i} className={`asc__item${it.visible ? "" : " is-draft"}`}>
        <div className="asc__row">
          <label>
            {t("Datum", "Date")}
            <input type="date" value={it.date} onChange={(e) => setItem(list, i, { date: e.target.value })} />
          </label>
          {list === "reviews" ? (
            <>
              <label>
                {t("Name", "Name")}
                <input value={it.name} placeholder="Familie K." onChange={(e) => setItem(list, i, { name: e.target.value })} />
              </label>
              <label>
                {t("Ort", "Town")}
                <input value={it.place} placeholder="Essen" onChange={(e) => setItem(list, i, { place: e.target.value })} />
              </label>
              <label>
                {t("Sterne", "Stars")}
                <select value={it.stars} onChange={(e) => setItem(list, i, { stars: Number(e.target.value) })}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {"★".repeat(n)}
                    </option>
                  ))}
                </select>
              </label>
            </>
          ) : (
            <label className="asc__grow">
              {t("Titel", "Title")}
              <input value={it.title} placeholder={t("z. B. Keller in Essen-Rüttenscheid trocken", "e.g. Basement in Essen dry again")} onChange={(e) => setItem(list, i, { title: e.target.value })} />
            </label>
          )}
        </div>
        <label>
          {list === "reviews" ? t("Was der Kunde sagt", "What the customer says") : t("Text", "Text")}
          <textarea rows={3} value={it.text} onChange={(e) => setItem(list, i, { text: e.target.value })} />
        </label>
        <div className="asc__row">
          <label className="asc__grow">
            {t("Link zu Foto, Video oder Beitrag (https://…)", "Link to photo, video or post (https://…)")}
            <input value={it.link} placeholder="https://instagram.com/p/…" aria-invalid={!httpsOk(it.link)} onChange={(e) => setItem(list, i, { link: e.target.value })} />
          </label>
          <label className="asc__check">
            <input type="checkbox" checked={it.visible} onChange={(e) => setItem(list, i, { visible: e.target.checked })} />
            {t("Auf der Website zeigen", "Show on the website")}
          </label>
          <button type="button" className="asc__del" onClick={() => remove(list, i)} aria-label={t("Eintrag löschen", "Delete entry")}>
            <Trash2 aria-hidden="true" />
          </button>
        </div>
      </div>
    ));

  return (
    <div className="asc">
      <div className="asc__card">
        <h2 className="asc__h">{t("Kanäle", "Channels")}</h2>
        <p className="asc__d">{t("Diese Links erscheinen als Symbole unten auf jeder Seite der Website. Leer lassen, was Sie nicht nutzen.", "These links show as icons at the foot of every page. Leave empty what you do not use.")}</p>
        <div className="asc__grid">
          {SOCIAL_KEYS.map((k) => (
            <label key={k}>
              {SOCIAL_LABEL[k][0]}
              <input
                value={data.social[k] || ""}
                placeholder={SOCIAL_LABEL[k][1]}
                aria-invalid={!httpsOk(data.social[k] || "")}
                onChange={(e) => {
                  setState("idle");
                  setData({ ...data, social: { ...data.social, [k]: e.target.value } });
                }}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="asc__card">
        <div className="asc__head">
          <h2 className="asc__h">{t("Aktuelles", "News")}</h2>
          <button type="button" className="asc__add" onClick={() => add("news")}>
            <Plus aria-hidden="true" /> {t("Neuer Beitrag", "New post")}
          </button>
        </div>
        <p className="asc__d">{t("Ein Satz zum heutigen Einsatz genügt: wo, was, Ergebnis. Die neuesten sechs stehen auf der Startseite.", "One sentence about today's job is enough: where, what, result. The newest six show on the home page.")}</p>
        {items("news")}
      </div>

      <div className="asc__card">
        <div className="asc__head">
          <h2 className="asc__h">{t("Kundenstimmen", "Customer reviews")}</h2>
          <button type="button" className="asc__add" onClick={() => add("reviews")}>
            <Plus aria-hidden="true" /> {t("Neue Stimme", "New review")}
          </button>
        </div>
        <p className="asc__d">{t("Nur echte Aussagen mit Einverständnis des Kunden; Name gern abgekürzt (Familie K.).", "Only real statements with the customer's consent; the name may be shortened (Familie K.).")}</p>
        {items("reviews")}
      </div>

      <div className="asc__save">
        {badLinks && <p className="asc__err">{t("Links müssen mit https:// beginnen.", "Links must start with https://.")}</p>}
        {state === "saved" && <p className="asc__ok">{t("Gespeichert. Die Website zeigt es in wenigen Minuten.", "Saved. The website shows it within a few minutes.")}</p>}
        {state === "error" && <p className="asc__err">{t(`Fehler: ${msg}`, `Error: ${msg}`)}</p>}
        <a href="/" target="_blank" rel="noopener noreferrer" className="asc__view">
          {t("Website ansehen", "View website")} <ExternalLink aria-hidden="true" />
        </a>
        <button type="button" className="btn-shine asc__btn" onClick={save} disabled={state === "save" || badLinks}>
          <Save aria-hidden="true" /> {state === "save" ? t("Speichert …", "Saving …") : t("Speichern & veröffentlichen", "Save & publish")}
        </button>
      </div>
    </div>
  );
}
