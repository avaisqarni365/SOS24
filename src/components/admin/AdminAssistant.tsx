"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Sparkles } from "lucide-react";
import { adminCall } from "@/lib/adminApi";

type T = (de: string, en: string) => string;
type Kind = "review" | "lead";

interface Draft {
  name: string;
  stars: string;
  text: string;
  out: string;
  warnings: string[];
  err: string;
  busy: boolean;
}
const EMPTY: Draft = { name: "", stars: "5", text: "", out: "", warnings: [], err: "", busy: false };

/**
 * KI-Assistent: reply drafts from Google Gemini for a Google review and for a customer's message.
 * The owner pastes the text, reads and edits the draft, and sends it himself; nothing is sent
 * from here. The house rules (no prices, no invented facts, …) are enforced in the back office.
 */
export default function AdminAssistant({ t, onSessionEnd }: { t: T; onSessionEnd: () => void }) {
  const [ready, setReady] = useState<boolean | null>(null);
  const [form, setForm] = useState<Record<Kind, Draft>>({ review: { ...EMPTY }, lead: { ...EMPTY, stars: "" } });
  const [copied, setCopied] = useState<Kind | "">("");

  useEffect(() => {
    adminCall<{ ai: boolean }>("api_posts").then((r) => (r.ok ? setReady(r.data.ai) : r.error === "login" ? onSessionEnd() : setReady(false)));
  }, [onSessionEnd]);

  const set = (k: Kind, patch: Partial<Draft>) => setForm((f) => ({ ...f, [k]: { ...f[k], ...patch } }));

  const write = async (k: Kind) => {
    const d = form[k];
    set(k, { busy: true, err: "" });
    const r = await adminCall<{ text: string; warnings: string[] }>("api_aiReply", { kind: k, text: d.text, name: d.name, stars: Number(d.stars) || 0 });
    if (!r.ok) return r.error === "login" ? onSessionEnd() : set(k, { busy: false, err: r.error });
    set(k, { busy: false, out: r.data.text, warnings: r.data.warnings || [] });
  };

  const copy = async (k: Kind) => {
    try {
      await navigator.clipboard.writeText(form[k].out);
      setCopied(k);
      window.setTimeout(() => setCopied((c) => (c === k ? "" : c)), 2500);
    } catch {
      set(k, { err: t("Kopieren hat nicht geklappt. Bitte den Text markieren und mit Strg+C kopieren.", "Copying failed. Please select the text and press Ctrl+C.") });
    }
  };

  const card = (k: Kind, title: string, intro: string, textLabel: string, placeholder: string) => {
    const d = form[k];
    return (
      <section className="at__card ed">
        <h2 className="at__h">{title}</h2>
        <p className="pg__hint">{intro}</p>
        <fieldset className="ed__box" disabled={d.busy}>
          <legend>{t("Vorgabe", "Input")}</legend>
          <div className="ed__row">
            <label className="ed__grow">
              {t("Name des Kunden (freiwillig)", "Customer's name (optional)")}
              <input value={d.name} maxLength={80} onChange={(e) => set(k, { name: e.target.value })} autoComplete="off" />
            </label>
            {k === "review" && (
              <label>
                {t("Sterne", "Stars")}
                <select value={d.stars} onChange={(e) => set(k, { stars: e.target.value })}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <label>
            {textLabel}
            <textarea rows={5} value={d.text} maxLength={3000} onChange={(e) => set(k, { text: e.target.value })} placeholder={placeholder} />
          </label>
          <div className="dw__acts">
            <button type="button" className="btn-shine at__new" disabled={!ready || d.busy || d.text.trim().length < 5} onClick={() => write(k)}>
              <Sparkles aria-hidden="true" /> {d.busy ? t("KI schreibt …", "AI is writing …") : t("Antwort entwerfen", "Draft a reply")}
            </button>
          </div>
        </fieldset>
        {d.err && <p className="at__err" role="alert">{d.err}</p>}
        {d.out && (
          <fieldset className="ed__box">
            <legend>{t("Entwurf: bitte lesen und anpassen", "Draft: please read and adjust")}</legend>
            {d.warnings.length > 0 && <p className="sc__warn" role="status">{t("Bitte prüfen: Der Entwurf", "Please check: the draft")} {d.warnings.join(", ")}.</p>}
            <label>
              <span className="visually-hidden">{t("Entwurf", "Draft")}</span>
              <textarea rows={8} value={d.out} onChange={(e) => set(k, { out: e.target.value })} />
            </label>
            <div className="dw__acts">
              <button type="button" className="at__btn" onClick={() => copy(k)}>
                {copied === k ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />} {copied === k ? t("Kopiert", "Copied") : t("Text kopieren", "Copy text")}
              </button>
            </div>
          </fieldset>
        )}
      </section>
    );
  };

  return (
    <div className="at">
      <p className="sc__lead">{t("Die KI schreibt Entwürfe; Sie lesen, ändern und senden selbst. Von hier aus wird nichts verschickt oder veröffentlicht.", "The AI writes drafts; you read, change and send them yourself. Nothing is sent or published from here.")}</p>
      {ready === false && (
        <div className="pg__bar is-dirty">
          <div>
            <strong>{t("Die KI ist noch nicht eingerichtet.", "The AI is not set up yet.")}</strong>
            <span>{t("Es fehlt der Gemini-Schlüssel von Google AI Studio in den Skripteigenschaften des Backoffice (Name: GEMINI_API_KEY).", "The Gemini key from Google AI Studio is missing in the back office's script properties (name: GEMINI_API_KEY).")}</span>
          </div>
        </div>
      )}
      {card(
        "review",
        t("Antwort auf eine Google-Bewertung", "Reply to a Google review"),
        t("Bewertung aus dem Unternehmensprofil hier einfügen. Die Antwort veröffentlichen Sie dort selbst.", "Paste the review from the Business Profile here. You publish the reply there yourself."),
        t("Text der Bewertung *", "Review text *"),
        t("Bewertung hier einfügen …", "Paste the review here …"),
      )}
      {card(
        "lead",
        t("Antwort auf eine Kundenanfrage", "Reply to a customer inquiry"),
        t("Nachricht des Kunden aus WhatsApp oder E-Mail einfügen. Der Entwurf schlägt die kostenlose Feuchtemessung vor und nennt keine Preise.", "Paste the customer's message from WhatsApp or e-mail. The draft suggests the free moisture measurement and names no prices."),
        t("Nachricht des Kunden *", "Customer's message *"),
        t("Nachricht hier einfügen …", "Paste the message here …"),
      )}
    </div>
  );
}
