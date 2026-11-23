"use client";

import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, MessageCircle } from "lucide-react";
import { adminCall } from "@/lib/adminApi";
import { Segments, dayDe } from "@/components/admin/AdminKit";

type T = (de: string, en: string) => string;

interface Item {
  id: string;
  name: string;
  phone: string;
  finished: string;
  asked: string;
  got: string;
  text: string;
  wa: string;
  town: string;
  area: string;
  region: string;
  service: string;
}
interface State {
  link: string;
  items: Item[];
  open: number;
  asked: number;
  got: number;
}

/**
 * Bewertungen: every finished job with a complete, ready message that asks for a Google review.
 * The message names the customer's town and the work done (region-specific) and asks for an
 * honest review; it never proposes the wording or the stars. The owner sends it himself by
 * WhatsApp and ticks off who was asked and who has reviewed.
 */
export default function AdminReviews({ t, onSessionEnd }: { t: T; onSessionEnd: () => void }) {
  const [data, setData] = useState<State | null>(null);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState<"open" | "asked" | "all">("open");
  const [busy, setBusy] = useState("");
  const [copied, setCopied] = useState("");
  const [shown, setShown] = useState("");
  // a customer from before the admin: not in the list, so the owner types name, mobile, town and job
  const [past, setPast] = useState({ name: "", phone: "", plz: "", town: "", service: "" });
  const [draft, setDraft] = useState<{ text: string; wa: string } | null>(null);

  useEffect(() => {
    adminCall<State>("api_reviews").then((r) => (r.ok ? setData(r.data) : r.error === "login" ? onSessionEnd() : setErr(r.error)));
  }, [onSessionEnd]);

  const mark = async (x: Item, field: "asked" | "got", on: boolean) => {
    setBusy(x.id + field);
    setErr("");
    const r = await adminCall<State>("api_reviewMark", x.id, field, on);
    setBusy("");
    if (r.ok) setData(r.data);
    else if (r.error === "login") onSessionEnd();
    else setErr(r.error);
  };
  const makeDraft = async () => {
    setBusy("draft");
    setErr("");
    setDraft(null);
    const r = await adminCall<{ text: string; wa: string }>("api_reviewDraft", past.name, past.phone, `${past.plz} ${past.town}`.trim(), past.service);
    setBusy("");
    if (r.ok) setDraft(r.data);
    else if (r.error === "login") onSessionEnd();
    else setErr(r.error);
  };
  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? "" : c)), 2500);
    } catch {
      setErr(t("Kopieren hat nicht geklappt. Bitte den Text markieren und mit Strg+C kopieren.", "Copying failed. Please select the text and press Ctrl+C."));
    }
  };

  if (!data) return <div className="at__card">{err ? t(`Laden fehlgeschlagen: ${err}`, `Loading failed: ${err}`) : t("Lade abgeschlossene Aufträge …", "Loading finished jobs …")}</div>;

  const rows = data.items.filter((x) => (filter === "all" ? true : filter === "open" ? !x.asked && !x.got : !!x.asked || !!x.got));

  return (
    <div className="at">
      <p className="sc__lead">
        {t(
          "Jeder abgeschlossene Auftrag bekommt hier eine fertige Nachricht mit Ort, Leistung und Bewertungslink. Sie senden sie selbst per WhatsApp und haken ab. Bitte alle Kunden fragen, nicht nur die zufriedenen, und nichts als Gegenleistung anbieten (Regel von Google).",
          "Every finished job gets a ready message here with town, service and review link. You send it yourself by WhatsApp and tick it off. Please ask all customers, not only the happy ones, and offer nothing in return (Google's rule).",
        )}
      </p>
      <div className="at__kpis">
        <div>
          <strong>{data.open}</strong>
          <span>{t("noch nicht gefragt", "not asked yet")}</span>
        </div>
        <div>
          <strong>{data.asked}</strong>
          <span>{t("gefragt", "asked")}</span>
        </div>
        <div>
          <strong>{data.got}</strong>
          <span>{t("Bewertung erhalten", "review received")}</span>
        </div>
      </div>
      <div className="at__tools">
        <Segments
          value={filter}
          onChange={setFilter}
          label={t("Filter", "Filter")}
          items={[
            ["open", t("Offen", "Open"), data.open],
            ["asked", t("Gefragt", "Asked"), data.asked],
            ["all", t("Alle", "All"), data.items.length],
          ]}
        />
        <button type="button" className="at__btn" onClick={() => copy("link", data.link)}>
          {copied === "link" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />} {copied === "link" ? t("Kopiert", "Copied") : t("Bewertungslink kopieren", "Copy review link")}
        </button>
        <a className="at__btn" href="https://business.google.com/reviews" target="_blank" rel="noopener noreferrer">
          <ExternalLink aria-hidden="true" /> {t("Bewertungen bei Google", "Reviews on Google")}
        </a>
      </div>
      {err && <p className="at__err" role="alert">{err}</p>}
      <section className="at__card rv__card" aria-labelledby="rv-past-title">
        <div className="rv__head">
          <div>
            <h3 id="rv-past-title">{t("Früheren Kunden fragen", "Ask a past customer")}</h3>
            <p>
              {t(
                "Für Kunden, die nicht in den Anfragen stehen, zum Beispiel Aufträge aus den letzten Jahren. Sie bekommen dieselbe Nachricht mit Ort, Leistung und Bewertungslink. Gespeichert wird nichts.",
                "For customers who are not in the inquiries, for example jobs from the last years. They get the same message with town, service and review link. Nothing is stored."
              )}
            </p>
          </div>
        </div>
        <div className="rv__form">
          <label>
            {t("Anrede und Name", "Salutation and name")}
            <input value={past.name} placeholder="Herr Schmidt" autoComplete="off" onChange={(e) => setPast({ ...past, name: e.target.value })} />
          </label>
          <label>
            {t("Mobilnummer", "Mobile number")}
            <input value={past.phone} placeholder="0171 2345678" inputMode="tel" autoComplete="off" onChange={(e) => setPast({ ...past, phone: e.target.value })} />
          </label>
          <label>
            {t("PLZ", "Postcode")}
            <input value={past.plz} placeholder="45144" inputMode="numeric" maxLength={5} autoComplete="off" onChange={(e) => setPast({ ...past, plz: e.target.value })} />
          </label>
          <label>
            {t("Ort", "Town")}
            <input value={past.town} placeholder="Essen" autoComplete="off" onChange={(e) => setPast({ ...past, town: e.target.value })} />
          </label>
          <label>
            {t("Was wurde gemacht?", "What was done?")}
            <input value={past.service} placeholder="Kellerabdichtung von innen" autoComplete="off" onChange={(e) => setPast({ ...past, service: e.target.value })} />
          </label>
        </div>
        <div className="dw__acts">
          <button type="button" className="at__btn" disabled={busy === "draft" || past.name.trim().length < 2} onClick={makeDraft}>
            {busy === "draft" ? t("Erstelle …", "Creating …") : t("Nachricht erstellen", "Create message")}
          </button>
          {draft &&
            (draft.wa ? (
              <a className="btn-shine at__new" href={draft.wa} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden="true" /> {t("WhatsApp mit Text öffnen", "Open WhatsApp with text")}
              </a>
            ) : (
              <span className="pg__hint">{t("Ohne Mobilnummer: Text kopieren und per E-Mail oder SMS senden.", "Without a mobile number: copy the text and send it by e-mail or SMS.")}</span>
            ))}
          {draft && (
            <button type="button" className="at__btn" onClick={() => copy("draft", draft.text)}>
              {copied === "draft" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />} {copied === "draft" ? t("Kopiert", "Copied") : t("Text kopieren", "Copy text")}
            </button>
          )}
        </div>
        {draft && <pre className="rv__text">{draft.text}</pre>}
      </section>
      {rows.length === 0 && (
        <p className="at__empty">
          {data.items.length === 0
            ? t("Noch kein Auftrag steht auf „Erledigt“. Sobald Sie eine Anfrage auf „Erledigt“ setzen, erscheint sie hier.", "No job is set to “Erledigt” yet. As soon as you set an inquiry to “Erledigt”, it appears here.")
            : t("Hier ist nichts offen.", "Nothing open here.")}
        </p>
      )}
      {rows.map((x) => (
        <section key={x.id} className="at__card rv__card">
          <div className="rv__head">
            <div>
              <h3>
                {x.name || "—"} <small>{x.id}</small>
              </h3>
              <p>
                {[x.town ? `${x.town} (${x.area})` : x.area, x.service, x.finished ? t(`erledigt am ${dayDe(x.finished)}`, `finished on ${dayDe(x.finished)}`) : ""].filter(Boolean).join(" · ")}
              </p>
            </div>
            {x.got ? <span className="rv__tag is-got">{t("Bewertung erhalten", "Review received")}</span> : x.asked ? <span className="rv__tag">{t(`gefragt am ${dayDe(x.asked)}`, `asked on ${dayDe(x.asked)}`)}</span> : null}
          </div>
          <div className="dw__acts">
            {x.wa ? (
              <a className="btn-shine at__new" href={x.wa} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden="true" /> {t("WhatsApp mit Text öffnen", "Open WhatsApp with text")}
              </a>
            ) : (
              <span className="pg__hint">{t("Keine Mobilnummer hinterlegt: Text kopieren und per E-Mail senden.", "No mobile number on file: copy the text and send it by e-mail.")}</span>
            )}
            <button type="button" className="at__btn" onClick={() => copy(x.id, x.text)}>
              {copied === x.id ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />} {copied === x.id ? t("Kopiert", "Copied") : t("Text kopieren", "Copy text")}
            </button>
            <button type="button" className="at__btn" aria-expanded={shown === x.id} onClick={() => setShown(shown === x.id ? "" : x.id)}>
              {shown === x.id ? t("Text ausblenden", "Hide text") : t("Text ansehen", "Show text")}
            </button>
          </div>
          {shown === x.id && <pre className="rv__text">{x.text}</pre>}
          <div className="sc__pf-acts">
            <label className="sc__tick">
              <input type="checkbox" checked={!!x.asked} disabled={busy === x.id + "asked"} onChange={(e) => mark(x, "asked", e.target.checked)} />
              {t("Kunde wurde gefragt", "Customer was asked")}
            </label>
            <label className="sc__tick">
              <input type="checkbox" checked={!!x.got} disabled={busy === x.id + "got"} onChange={(e) => mark(x, "got", e.target.checked)} />
              {t("Bewertung ist da", "Review is in")}
            </label>
          </div>
        </section>
      ))}
    </div>
  );
}
