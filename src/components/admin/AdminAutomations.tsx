"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { adminCall } from "@/lib/adminApi";
import { dayDe } from "@/components/admin/AdminKit";

type T = (de: string, en: string) => string;

interface Auto {
  key: string;
  label: string;
  text: string;
  on: boolean;
  last?: string;
}
interface State {
  to: string;
  hour: number;
  items: Auto[];
}

const EN: Record<string, [string, string]> = {
  weekly: ["Weekly report", "Every Monday: inquiries, appointments, visits and planned posts of the week by e-mail."],
  posts: ["Reminder for planned posts", "On every day with a planned post: an e-mail with the topic and the platforms that are still open."],
  reviews: ["Reminder: ask for a review", "The day after a job was set to “Erledigt”: an e-mail with the customer and a ready WhatsApp text including the review link."],
};

/**
 * Automatik: three e-mails Google sends to the office on its own (daily trigger at 07:00, see
 * runAutomations_ in Shared.js). Each is off until switched on here. They go to the office address
 * only; nothing is ever sent to a customer or posted anywhere.
 */
export default function AdminAutomations({ t, lang, onSessionEnd }: { t: T; lang: "de" | "en"; onSessionEnd: () => void }) {
  const [data, setData] = useState<State | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState<{ key: string; text: string } | null>(null);

  const fail = (e: string) => (e === "login" ? onSessionEnd() : setErr(e));

  useEffect(() => {
    adminCall<State>("api_automations").then((r) => (r.ok ? setData(r.data) : r.error === "login" ? onSessionEnd() : setErr(r.error)));
  }, [onSessionEnd]);

  const toggle = async (a: Auto) => {
    setBusy(a.key);
    setErr("");
    setNote(null);
    const r = await adminCall<State>("api_automationSet", a.key, !a.on);
    setBusy("");
    if (r.ok) setData(r.data);
    else fail(r.error);
  };

  const test = async (a: Auto) => {
    setBusy(a.key + ":test");
    setErr("");
    setNote(null);
    const r = await adminCall<{ sent: boolean; to: string; why?: string }>("api_automationTest", a.key);
    setBusy("");
    if (!r.ok) return fail(r.error);
    setNote({
      key: a.key,
      text: r.data.sent ? t(`Test-E-Mail gesendet an ${r.data.to}.`, `Test e-mail sent to ${r.data.to}.`) : r.data.why || t("Heute gäbe es keine E-Mail.", "There would be no e-mail today."),
    });
  };

  return (
    <div className="at">
      <p className="sc__lead">
        {t(
          "Diese E-Mails schickt Google von selbst, jeden Morgen gegen 7 Uhr. Sie gehen nur an das Büro, nie an Kunden, und es wird nichts veröffentlicht.",
          "Google sends these e-mails on its own, every morning around 7 o'clock. They only go to the office, never to customers, and nothing is published.",
        )}
      </p>
      {err && <p className="at__err" role="alert">{t(`Fehlgeschlagen: ${err}`, `Failed: ${err}`)}</p>}
      {!data && !err && <div className="at__card">{t("Lade Einstellungen …", "Loading settings …")}</div>}
      {data && (
        <>
          <div className={"pg__bar" + (data.to ? "" : " is-dirty")}>
            <div>
              <strong>{data.to ? t(`Empfänger: ${data.to}`, `Recipient: ${data.to}`) : t("Es ist keine Büro-Adresse hinterlegt.", "No office address is set.")}</strong>
              <span>{t("Die Adresse steht in der Google-Tabelle im Blatt „Konfiguration“ (notify_email).", "The address is in the Google Sheet, tab “Konfiguration” (notify_email).")}</span>
            </div>
          </div>
          {data.items.map((a) => {
            const [label, text] = lang === "en" && EN[a.key] ? EN[a.key] : [a.label, a.text];
            return (
              <section key={a.key} className="at__card au__card">
                <div className="au__head">
                  <div>
                    <h3>{label}</h3>
                    <p>{text}</p>
                    <p className="au__last">{a.last ? t(`Zuletzt gesendet: ${dayDe(a.last, true)}`, `Last sent: ${dayDe(a.last, true)}`) : t("Noch nie gesendet.", "Never sent yet.")}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={a.on}
                    aria-label={label}
                    className={"au__switch" + (a.on ? " is-on" : "")}
                    disabled={busy === a.key}
                    onClick={() => toggle(a)}
                  >
                    <span aria-hidden="true" />
                    <b>{a.on ? t("Ein", "On") : t("Aus", "Off")}</b>
                  </button>
                </div>
                <div className="dw__acts">
                  <button type="button" className="at__btn" disabled={!data.to || busy === a.key + ":test"} onClick={() => test(a)}>
                    <Send aria-hidden="true" /> {busy === a.key + ":test" ? t("Sende …", "Sending …") : t("Jetzt als Test senden", "Send a test now")}
                  </button>
                </div>
                {note?.key === a.key && <p className="pg__hint" role="status">{note.text}</p>}
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
