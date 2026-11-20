"use client";

import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { adminCall } from "@/lib/adminApi";
import { Segments } from "@/components/admin/AdminKit";

type T = (de: string, en: string) => string;

interface Idea {
  topic: string;
  text: string;
  date: string;
  warnings: string[];
  pick: boolean;
}

/**
 * Wochenplan mit KI: the AI proposes topics with a date (Mon, Wed, Fri). The owner edits, ticks
 * the ones he wants and saves them as planned posts; the platform texts are written later, post
 * by post. Nothing is saved before "anlegen" and nothing is published from here.
 */
export default function AdminPostPlan<S>({ t, ai, onAdded, onSessionEnd }: { t: T; ai: boolean; onAdded: (state: S, count: number) => void; onSessionEnd: () => void }) {
  const [count, setCount] = useState<"3" | "6" | "9">("6");
  const [focus, setFocus] = useState("");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [busy, setBusy] = useState<"" | "ai" | "save">("");
  const [err, setErr] = useState("");

  const fail = (e: string) => (e === "login" ? onSessionEnd() : setErr(e));
  const set = (i: number, patch: Partial<Idea>) => setIdeas((list) => list.map((x, n) => (n === i ? { ...x, ...patch } : x)));
  const picked = ideas.filter((x) => x.pick && x.topic.trim().length >= 3);

  const plan = async () => {
    setBusy("ai");
    setErr("");
    const r = await adminCall<{ ideas: Omit<Idea, "pick">[] }>("api_aiPlan", { count: Number(count), focus });
    setBusy("");
    if (!r.ok) return fail(r.error);
    setIdeas(r.data.ideas.map((x) => ({ ...x, pick: x.warnings.length === 0 })));
  };

  const add = async () => {
    setBusy("save");
    setErr("");
    const r = await adminCall<S>("api_postsAdd", picked.map(({ topic, text, date }) => ({ topic, text, date })));
    setBusy("");
    if (!r.ok) return fail(r.error);
    onAdded(r.data, picked.length);
  };

  return (
    <div className="ed pg__form">
      {!ai && (
        <div className="pg__bar is-dirty">
          <div>
            <strong>{t("Die KI ist noch nicht eingerichtet.", "The AI is not set up yet.")}</strong>
            <span>{t("Es fehlt der Gemini-Schlüssel in den Skripteigenschaften des Backoffice (GEMINI_API_KEY).", "The Gemini key is missing in the back office's script properties (GEMINI_API_KEY).")}</span>
          </div>
        </div>
      )}
      <fieldset className="ed__box" disabled={!!busy}>
        <legend>{t("1. Was soll geplant werden?", "1. What should be planned?")}</legend>
        <Segments
          value={count}
          onChange={setCount}
          label={t("Anzahl", "Number")}
          items={[
            ["3", t("3 Beiträge (1 Woche)", "3 posts (1 week)")],
            ["6", t("6 Beiträge (2 Wochen)", "6 posts (2 weeks)")],
            ["9", t("9 Beiträge (3 Wochen)", "9 posts (3 weeks)")],
          ]}
        />
        <label>
          {t("Schwerpunkt (freiwillig)", "Focus (optional)")}
          <input value={focus} maxLength={200} onChange={(e) => setFocus(e.target.value)} placeholder={t("z. B. Winter, Schimmel im Keller, Bochum und Gelsenkirchen", "e.g. winter, mould in the cellar, Bochum and Gelsenkirchen")} />
        </label>
        <p className="pg__hint">{t("Die Termine fallen auf Montag, Mittwoch und Freitag. Themen, die es schon gibt, werden nicht wiederholt.", "Dates fall on Monday, Wednesday and Friday. Existing topics are not repeated.")}</p>
        <div className="dw__acts">
          <button type="button" className="btn-shine at__new" disabled={!ai || !!busy} onClick={plan}>
            <Sparkles aria-hidden="true" /> {busy === "ai" ? t("KI plant …", "AI is planning …") : ideas.length ? t("Neue Vorschläge", "New suggestions") : t("Themen vorschlagen", "Suggest topics")}
          </button>
        </div>
      </fieldset>
      {err && <p className="at__err" role="alert">{err}</p>}

      {ideas.length > 0 && (
        <fieldset className="ed__box" disabled={!!busy}>
          <legend>{t("2. Auswählen und anpassen", "2. Pick and adjust")}</legend>
          {ideas.map((x, i) => (
            <div key={i} className={"sc__pf pl__idea" + (x.pick ? "" : " is-off")}>
              <label className="sc__tick">
                <input type="checkbox" checked={x.pick} onChange={(e) => set(i, { pick: e.target.checked })} />
                {t("Übernehmen", "Use")}
              </label>
              <div className="pl__row">
                <label>
                  {t("Thema", "Topic")}
                  <input value={x.topic} maxLength={120} onChange={(e) => set(i, { topic: e.target.value })} />
                </label>
                <label>
                  {t("Datum", "Date")}
                  <input type="date" value={x.date} onChange={(e) => set(i, { date: e.target.value })} />
                </label>
              </div>
              <label>
                {t("Stichpunkte", "Notes")}
                <textarea rows={2} value={x.text} maxLength={600} onChange={(e) => set(i, { text: e.target.value })} />
              </label>
              {x.warnings.length > 0 && <p className="sc__warn" role="status">{t("Bitte prüfen: Der Vorschlag", "Please check: the suggestion")} {x.warnings.join(", ")}.</p>}
            </div>
          ))}
          <div className="dw__acts">
            <button type="button" className="btn-shine at__new" disabled={!picked.length || !!busy} onClick={add}>
              <Plus aria-hidden="true" /> {busy === "save" ? t("Lege an …", "Saving …") : t(`${picked.length} als geplante Beiträge anlegen`, `Save ${picked.length} as planned posts`)}
            </button>
          </div>
          <p className="pg__hint">{t("Die Texte für Facebook, Instagram und Co. schreiben Sie danach in jedem Beitrag (dort hilft die KI wieder).", "You write the texts for Facebook, Instagram etc. afterwards in each post (the AI helps there again).")}</p>
        </fieldset>
      )}
    </div>
  );
}
