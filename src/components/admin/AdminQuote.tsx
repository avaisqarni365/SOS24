"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Save, MessageCircle, Mail, FileText, Search } from "lucide-react";
import { adminCall } from "@/lib/adminApi";
import type { WorkspaceLead } from "@/lib/backend";
import { eur } from "@/components/admin/AdminKit";

type T = (de: string, en: string) => string;

/** title, detail, qty, unit, price, optional (upsell: shown with its price, not in the total) */
type QLine = [string, string, number, string, number, boolean?];
interface Rate {
  key: string;
  label: string;
  unit: string;
  price: number;
}
interface LeadView {
  lead: { id: string; name: string; phone: string; email: string; to: string; service: string; message: string };
  quote: { version: number; lines: QLine[]; saved: boolean; range?: number | null };
  minPrice: number;
}

const num = (v: string) => Number(String(v).replace(/\s|€/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".")) || 0;
const de = (n: number) => (Number(n) || 0).toLocaleString("de-DE", { maximumFractionDigits: 2, useGrouping: false });

/**
 * Aufmaß & Angebot: for one enquiry, the quote lines (suggested from the damage, or the last
 * saved version), adjusted on site with quantities and prices from the price list; saved as a
 * new quote version, sent by WhatsApp or e-mail, or turned into a quote document with a
 * GoBD number in Belege.
 */
export default function AdminQuote({ t, leads, startId, onSessionEnd, onOpenDoc }: { t: T; leads: WorkspaceLead[]; startId?: string; onSessionEnd: () => void; onOpenDoc: (nr: string) => void }) {
  // only an enquiry that is in the (real) list: a sample id from before the data loaded is ignored
  const known = (x?: string) => (x && leads.some((l) => l.id === x) ? x : "");
  const [id, setId] = useState(known(startId));
  const [q, setQ] = useState("");
  const [view, setView] = useState<LeadView | null>(null);
  const [lines, setLines] = useState<QLine[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const fail = useCallback((e: string) => (e === "login" ? onSessionEnd() : setErr(e)), [onSessionEnd]);
  useEffect(() => {
    adminCall<Rate[]>("api_rateList").then((r) => (r.ok ? setRates(r.data) : fail(r.error)));
  }, [fail]);
  useEffect(() => {
    const k = known(startId);
    if (k) setId(k);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startId, leads]);
  useEffect(() => {
    setView(null);
    setMsg("");
    setErr("");
    if (!id) return;
    adminCall<LeadView>("api_lead", id).then((r) => {
      if (!r.ok) return fail(r.error);
      if (!r.data?.lead) return setErr(t(`Anfrage ${id} nicht gefunden.`, `Inquiry ${id} not found.`));
      setView(r.data);
      setLines(r.data.quote.lines.map((l) => [...l] as QLine));
      setDirty(false);
    });
  }, [id, fail]);

  const total = useMemo(() => lines.reduce((s, l) => s + (l[5] ? 0 : (Number(l[2]) || 0) * (Number(l[4]) || 0)), 0), [lines]);
  const optTotal = useMemo(() => lines.reduce((s, l) => s + (l[5] ? (Number(l[2]) || 0) * (Number(l[4]) || 0) : 0), 0), [lines]);
  const [asOption, setAsOption] = useState(false);
  const pick = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter((l) => !needle || [l.id, l.name, l.address].join(" ").toLowerCase().includes(needle)).slice(0, 40);
  }, [leads, q]);

  const edit = (i: number, k: number, v: string | number | boolean) => {
    setLines(lines.map((l, j) => (j === i ? (Object.assign([...l], { [k]: v }) as QLine) : l)));
    setDirty(true);
    setMsg("");
  };
  const run = async <R,>(fn: string, ...args: unknown[]) => {
    setBusy(true);
    setErr("");
    const r = await adminCall<R>(fn, ...args);
    setBusy(false);
    if (!r.ok) {
      fail(r.error);
      return null;
    }
    return r.data;
  };
  const save = async () => {
    const r = await run<{ version: number; total: number }>("api_saveQuote", id, lines.filter((l) => l[0]));
    if (r) {
      setDirty(false);
      setView((v) => (v ? { ...v, quote: { ...v.quote, version: r.version, saved: true } } : v));
      setMsg(t(`Angebot gespeichert (Version ${r.version}, ${eur(r.total)}).`, `Quote saved (version ${r.version}, ${eur(r.total)}).`));
    }
    return r;
  };
  const text = () =>
    [
      t(`Guten Tag ${view?.lead.name || ""},`, `Hello ${view?.lead.name || ""},`),
      "",
      t("hier unser Festpreis-Angebot:", "here is our fixed-price quote:"),
      ...lines.filter((l) => l[0] && !l[5]).map((l) => `• ${l[0]}: ${de(l[2])} ${l[3]} × ${eur(l[4])} = ${eur(l[2] * l[4])}`),
      "",
      t(`Gesamt: ${eur(total)} inkl. MwSt.`, `Total: ${eur(total)} incl. VAT`),
      ...(lines.some((l) => l[5] && l[0])
        ? ["", t("Optional zubuchbar:", "Optional extras:"), ...lines.filter((l) => l[5] && l[0]).map((l) => `+ ${l[0]}: ${eur(l[2] * l[4])}`)]
        : []),
      t("10 Jahre Garantie auf die Arbeit. Bei Fragen: 0172 2064177.", "10-year guarantee on the work."),
      "",
      "Shahzad Mahmood · SOS-Abdichtung",
    ].join("\n");
  const send = async (channel: "wa" | "mail") => {
    if (dirty && !(await save())) return;
    const r = await run<{ wa: string; mail: string }>("api_sendQuote", id, text(), channel === "mail" ? "mail" : "wa");
    const url = r && (channel === "mail" ? r.mail : r.wa);
    if (url) window.open(url, "_blank", "noopener");
    else if (r) setErr(channel === "mail" ? t("Keine E-Mail-Adresse bei dieser Anfrage.", "No e-mail address.") : t("Keine Telefonnummer bei dieser Anfrage.", "No phone number."));
  };
  const toDoc = async () => {
    if ((dirty || !view?.quote.saved) && !(await save())) return;
    const nr = await run<string>("api_docNew", "offer", id);
    if (nr) onOpenDoc(nr);
  };

  return (
    <div className="qt">
      <aside className="at__card qt__pick">
        <h2 className="at__h">{t("Anfrage wählen", "Choose inquiry")}</h2>
        <label className="at__search">
          <Search aria-hidden="true" />
          <span className="visually-hidden">{t("Anfrage suchen", "Search inquiry")}</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Name, Nr., Ort …", "Name, no., town …")} />
        </label>
        <ul className="qt__list">
          {pick.map((l) => (
            <li key={l.id}>
              <button type="button" className={`qt__lead${l.id === id ? " is-on" : ""}`} onClick={() => setId(l.id)}>
                <span className="at__nr">{l.id}</span>
                <span className="at__strong">{l.name || "—"}</span>
                <span className="at__sub">{l.damageType || l.status}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="at__card qt__main">
        {!id ? (
          <p className="at__empty">{t("Links eine Anfrage wählen: die Positionen werden aus dem Schadensbild vorgeschlagen.", "Choose an inquiry on the left: lines are suggested from the damage.")}</p>
        ) : !view ? (
          <p className="at__empty">{err || t("Lade Anfrage …", "Loading inquiry …")}</p>
        ) : (
          <>
            <div className="qt__head">
              <div>
                <h2 className="at__h">
                  {view.lead.id} · {view.lead.name}
                </h2>
                <p className="at__sub">
                  {[view.lead.service, view.lead.to].filter(Boolean).join(" · ")}
                  {" · "}
                  {view.quote.saved ? t(`gespeicherte Version ${view.quote.version}`, `saved version ${view.quote.version}`) : t("Vorschlag, noch nicht gespeichert", "suggestion, not saved yet")}
                </p>
              </div>
            </div>
            {err && <p className="at__err">{err}</p>}
            {msg && <p className="at__okline">{msg}</p>}

            <div className="at__wrap">
              <table className="at__table qt__table">
                <thead>
                  <tr>
                    <th scope="col">{t("Leistung", "Item")}</th>
                    <th scope="col" className="at__num">{t("Menge", "Qty")}</th>
                    <th scope="col">{t("Einheit", "Unit")}</th>
                    <th scope="col" className="at__num">{t("Preis €", "Price €")}</th>
                    <th scope="col" className="at__num">{t("Summe", "Sum")}</th>
                    <th scope="col">{t("Option", "Option")}</th>
                    <th scope="col">
                      <span className="visually-hidden">{t("Löschen", "Delete")}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l, i) => (
                    <tr key={i}>
                      <td>
                        <input className="qt__in qt__in--title" value={l[0]} placeholder={t("Bezeichnung", "Title")} onChange={(e) => edit(i, 0, e.target.value)} aria-label={t(`Position ${i + 1}`, `Line ${i + 1}`)} />
                        <input className="qt__in qt__in--detail" value={l[1]} placeholder={t("Beschreibung", "Description")} onChange={(e) => edit(i, 1, e.target.value)} aria-label={t(`Beschreibung ${i + 1}`, `Description ${i + 1}`)} />
                      </td>
                      <td className="at__num">
                        <input className="qt__in qt__in--num" inputMode="decimal" defaultValue={de(l[2])} key={`q${i}-${l[2]}`} onBlur={(e) => edit(i, 2, num(e.target.value))} aria-label={t("Menge", "Qty")} />
                      </td>
                      <td>
                        <input className="qt__in qt__in--unit" value={l[3]} onChange={(e) => edit(i, 3, e.target.value)} aria-label={t("Einheit", "Unit")} />
                      </td>
                      <td className="at__num">
                        <input className="qt__in qt__in--num" inputMode="decimal" defaultValue={de(l[4])} key={`p${i}-${l[4]}`} onBlur={(e) => edit(i, 4, num(e.target.value))} aria-label={t("Preis", "Price")} />
                      </td>
                      <td className={`at__num at__strong${l[5] ? " qt__opt" : ""}`}>{l[5] ? "+ " : ""}{eur(l[2] * l[4])}</td>
                      <td>
                        <label className="ed__check" title={t("Upsell: im Angebot zur Wahl, nicht in der Summe", "Upsell: offered, not in the total")}>
                          <input type="checkbox" checked={!!l[5]} onChange={(e) => edit(i, 5, e.target.checked)} />
                          <span className="visually-hidden">{t("Optional", "Optional")}</span>
                        </label>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="at__btn"
                          aria-label={t("Position löschen", "Delete line")}
                          onClick={() => {
                            setLines(lines.filter((_, j) => j !== i));
                            setDirty(true);
                          }}
                        >
                          <Trash2 aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="qt__add">
              <span className="at__dim">{t("Aus der Preisliste:", "From the price list:")}</span>
              <label className="ed__check qt__asopt">
                <input type="checkbox" checked={asOption} onChange={(e) => setAsOption(e.target.checked)} />
                {t("als Option (Upsell)", "as option (upsell)")}
              </label>
              {rates.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  className="at__chip"
                  onClick={() => {
                    setLines([...lines, [r.label.replace(/\s*je\s+\S+$/i, ""), "", 1, r.unit, r.price, asOption]]);
                    setDirty(true);
                  }}
                >
                  <Plus aria-hidden="true" /> {r.label.replace(/\s*\(.*?\)/g, "")} <span>{eur(r.price)}</span>
                </button>
              ))}
              <button
                type="button"
                className="at__chip"
                onClick={() => {
                  setLines([...lines, ["", "", 1, "Pausch.", 0]]);
                  setDirty(true);
                }}
              >
                <Plus aria-hidden="true" /> {t("Freie Position", "Free line")}
              </button>
            </div>

            <div className="qt__total">
              <span>{t("Festpreis gesamt (inkl. MwSt.)", "Fixed price total (incl. VAT)")}</span>
              <strong>{eur(total)}</strong>
              {optTotal > 0 && <span className="qt__opt">{t(`+ Optionen bis ${eur(optTotal)}`, `+ options up to ${eur(optTotal)}`)}</span>}
              {total > 0 && total < view.minPrice && <em className="at__err">{t(`Unter dem Mindestauftragswert von ${eur(view.minPrice)}.`, `Below the minimum order of ${eur(view.minPrice)}.`)}</em>}
            </div>

            <div className="ed__bar">
              <button type="button" className="at__btn" onClick={save} disabled={busy || !dirty}>
                <Save aria-hidden="true" /> {t("Speichern", "Save")}
              </button>
              <button type="button" className="at__btn" onClick={() => send("wa")} disabled={busy || !lines.length}>
                <MessageCircle aria-hidden="true" /> {t("Per WhatsApp senden", "Send via WhatsApp")}
              </button>
              <button type="button" className="at__btn" onClick={() => send("mail")} disabled={busy || !lines.length}>
                <Mail aria-hidden="true" /> {t("Per E-Mail senden", "Send by e-mail")}
              </button>
              <button type="button" className="btn-shine at__new" onClick={toDoc} disabled={busy || !lines.length}>
                <FileText aria-hidden="true" /> {t("Angebot als Beleg erstellen", "Create quote document")}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
