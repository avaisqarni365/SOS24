"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Save, Eye, Stamp, ArrowUp, ArrowDown, Copy, Ban } from "lucide-react";
import { adminCall } from "@/lib/adminApi";
import { Drawer, eur } from "@/components/admin/AdminKit";

type T = (de: string, en: string) => string;

interface Line {
  title: string;
  detail: string;
  qty: number;
  unit: string;
  price: number;
  vat: number;
  disc: number;
  labour: boolean;
}
/** A document as the back office stores it (newDoc_ / cleanDoc_ in Belege.js). */
interface Raw {
  nr: string;
  type: string;
  status: string;
  lead: string;
  ref: string;
  date: string;
  subject: string;
  intro: string;
  outro: string;
  to: { kind: string; name: string; company: string; street: string; city: string; country: string; email: string; phone: string; vatId: string };
  serviceFrom: string;
  serviceTo: string;
  validUntil: string;
  payDays: number;
  payMethod: string;
  priceMode: string;
  discount: { type: string; value: number };
  deposit: number;
  lines: Line[];
}
interface DocView {
  doc: { net: number; vat: number; gross: number; laborGross: number; typeLabel: string };
  rawDoc: Raw;
  problems: string[];
  payMethods: string[];
  types: Record<string, string>;
}

const blankLine = (): Line => ({ title: "", detail: "", qty: 1, unit: "Pausch.", price: 0, vat: 19, disc: 0, labour: false });
const num = (v: string) => Number(String(v).replace(/\s|€/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".")) || 0;
const de = (n: number) => (Number(n) || 0).toLocaleString("de-DE", { maximumFractionDigits: 2, useGrouping: false });

/** A number typed the German way ("1,5", "1.234,56"): the text stays as typed, the value is parsed. */
function NumIn({ value, onValue, label }: { value: number; onValue: (n: number) => void; label?: string }) {
  const [text, setText] = useState(de(value));
  // follow outside changes (another line moved here, a reload), not our own typing
  useEffect(() => {
    if (num(text) !== value) setText(de(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <input
      inputMode="decimal"
      aria-label={label}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onValue(num(e.target.value));
      }}
      onBlur={() => setText(de(value))}
    />
  );
}

/**
 * The invoice editor: a draft quote or invoice with customer, lines (VAT, § 35a labour,
 * discount), dates and texts; save, preview as it will print, and issue it, which gives the
 * GoBD number and locks it. Issued documents can be copied (e.g. quote to invoice) or
 * cancelled with a cancellation invoice. Everything runs in the back office (Belege.js).
 */
export default function AdminDocEditor({ nr, t, onClose, onChanged, onSessionEnd, onOpenDoc }: { nr: string; t: T; onClose: () => void; onChanged: () => void; onSessionEnd: () => void; onOpenDoc: (nr: string) => void }) {
  const [view, setView] = useState<DocView | null>(null);
  const [d, setD] = useState<Raw | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState("");

  const fail = useCallback((e: string) => (e === "login" ? onSessionEnd() : setErr(e)), [onSessionEnd]);
  const take = (v: DocView) => {
    setView(v);
    setD(JSON.parse(JSON.stringify(v.rawDoc)));
    setDirty(false);
  };
  useEffect(() => {
    if (!nr) return;
    setView(null);
    setPreview("");
    setErr("");
    setMsg("");
    adminCall<DocView>("api_doc", nr).then((r) => (r.ok ? take(r.data) : fail(r.error)));
  }, [nr, fail]);

  const draft = d?.status === "Entwurf";
  const set = (patch: Partial<Raw>) => {
    if (!d) return;
    setD({ ...d, ...patch });
    setDirty(true);
    setMsg("");
  };
  const setTo = (patch: Partial<Raw["to"]>) => d && set({ to: { ...d.to, ...patch } });
  const setLine = (i: number, patch: Partial<Line>) => d && set({ lines: d.lines.map((l, j) => (j === i ? { ...l, ...patch } : l)) });
  const move = (i: number, by: number) => {
    if (!d) return;
    const ls = [...d.lines], j = i + by;
    if (j < 0 || j >= ls.length) return;
    [ls[i], ls[j]] = [ls[j], ls[i]];
    set({ lines: ls });
  };

  // a quick sum while typing; the exact totals (rounding, VAT split) come from the back office on save
  const quick = useMemo(() => (d ? d.lines.reduce((s, l) => s + l.qty * l.price * (1 - (l.disc || 0) / 100), 0) : 0), [d]);

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
    const v = await run<DocView>("api_docSave", d);
    if (v) {
      take(v);
      setMsg(t("Entwurf gespeichert.", "Draft saved."));
      onChanged();
    }
    return v;
  };
  const showPreview = async () => {
    const html = await run<string>("api_docPreview", d);
    if (html) setPreview(html);
  };
  const issue = async () => {
    if (dirty && !(await save())) return;
    if (!window.confirm(t("Jetzt ausstellen? Der Beleg bekommt seine endgültige Nummer und kann danach nicht mehr geändert werden (GoBD).", "Issue now? The document gets its final number and can no longer be changed."))) return;
    const v = await run<DocView>("api_docIssue", d);
    if (v) {
      onChanged();
      onOpenDoc(v.rawDoc.nr);
    }
  };
  const remove = async () => {
    if (!window.confirm(t("Diesen Entwurf endgültig löschen?", "Delete this draft for good?"))) return;
    if (await run("api_docDelete", d!.nr)) {
      onChanged();
      onClose();
    }
  };
  const copyAs = async (type: string) => {
    const r = await run<string>("api_docCopy", d!.nr, type);
    if (r) {
      onChanged();
      onOpenDoc(r);
    }
  };
  const cancel = async () => {
    const reason = window.prompt(t("Grund der Stornierung (erscheint auf der Stornorechnung):", "Reason for the cancellation:"), "");
    if (reason === null) return;
    const r = await run<string>("api_docCancel", d!.nr, reason);
    if (r) {
      onChanged();
      onOpenDoc(r);
    }
  };

  const title = view ? `${view.doc.typeLabel} ${d?.nr || ""}` : t("Beleg", "Document");
  return (
    <Drawer open={!!nr} onClose={onClose} t={t} title={title} sub={d ? `${d.status}${d.lead ? " · " + d.lead : ""}` : ""} wide>
      {!view || !d ? (
        <p className="at__empty">{err || t("Lade Beleg …", "Loading document …")}</p>
      ) : (
        <div className="ed">
          {err && <p className="at__err">{err}</p>}
          {msg && <p className="at__okline">{msg}</p>}
          {draft && view.problems.length > 0 && !dirty && (
            <ul className="ed__probs">
              {view.problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}

          <fieldset className="ed__box" disabled={!draft || busy}>
            <legend>{t("Kunde", "Customer")}</legend>
            <div className="ed__row">
              <label>
                {t("Art", "Kind")}
                <select value={d.to.kind} onChange={(e) => setTo({ kind: e.target.value })}>
                  <option value="privat">{t("Privat", "Private")}</option>
                  <option value="firma">{t("Firma", "Company")}</option>
                </select>
              </label>
              <label className="ed__grow">
                {t("Name", "Name")}
                <input value={d.to.name} onChange={(e) => setTo({ name: e.target.value })} />
              </label>
              {d.to.kind === "firma" && (
                <label className="ed__grow">
                  {t("Firma", "Company")}
                  <input value={d.to.company} onChange={(e) => setTo({ company: e.target.value })} />
                </label>
              )}
            </div>
            <div className="ed__row">
              <label className="ed__grow">
                {t("Straße & Nr.", "Street")}
                <input value={d.to.street} onChange={(e) => setTo({ street: e.target.value })} />
              </label>
              <label className="ed__grow">
                {t("PLZ & Ort", "Postcode & town")}
                <input value={d.to.city} onChange={(e) => setTo({ city: e.target.value })} />
              </label>
            </div>
            <div className="ed__row">
              <label className="ed__grow">
                {t("E-Mail", "E-mail")}
                <input type="email" value={d.to.email} onChange={(e) => setTo({ email: e.target.value })} />
              </label>
              <label className="ed__grow">
                {t("Telefon", "Phone")}
                <input value={d.to.phone} onChange={(e) => setTo({ phone: e.target.value })} />
              </label>
              {d.to.kind === "firma" && (
                <label>
                  {t("USt-IdNr.", "VAT ID")}
                  <input value={d.to.vatId} onChange={(e) => setTo({ vatId: e.target.value })} />
                </label>
              )}
            </div>
          </fieldset>

          <fieldset className="ed__box" disabled={!draft || busy}>
            <legend>{t("Beleg", "Document")}</legend>
            <div className="ed__row">
              <label>
                {t("Belegart", "Type")}
                <select value={d.type} onChange={(e) => set({ type: e.target.value })}>
                  {Object.entries(view.types)
                    .filter(([k]) => k !== "storno")
                    .map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                </select>
              </label>
              <label>
                {t("Datum", "Date")}
                <input type="date" value={d.date} onChange={(e) => set({ date: e.target.value })} />
              </label>
              {d.type === "offer" ? (
                <label>
                  {t("Gültig bis", "Valid until")}
                  <input type="date" value={d.validUntil} onChange={(e) => set({ validUntil: e.target.value })} />
                </label>
              ) : (
                <>
                  <label>
                    {t("Leistung von", "Service from")}
                    <input type="date" value={d.serviceFrom} onChange={(e) => set({ serviceFrom: e.target.value })} />
                  </label>
                  <label>
                    {t("bis", "to")}
                    <input type="date" value={d.serviceTo} onChange={(e) => set({ serviceTo: e.target.value })} />
                  </label>
                  <label>
                    {t("Zahlungsziel (Tage)", "Payment term (days)")}
                    <NumIn value={d.payDays} onValue={(n) => set({ payDays: n })} />
                  </label>
                  <label>
                    {t("Zahlungsart", "Method")}
                    <select value={d.payMethod} onChange={(e) => set({ payMethod: e.target.value })}>
                      {view.payMethods.map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </label>
                </>
              )}
            </div>
            <label>
              {t("Betreff", "Subject")}
              <input value={d.subject} onChange={(e) => set({ subject: e.target.value })} placeholder={t("z. B. Horizontalsperre Kellerwand Nord, 14 lfm", "e.g. horizontal barrier, 14 m")} />
            </label>
            <label>
              {t("Einleitung", "Intro")}
              <textarea rows={2} value={d.intro} onChange={(e) => set({ intro: e.target.value })} />
            </label>
          </fieldset>

          <fieldset className="ed__box" disabled={!draft || busy}>
            <legend>{t("Positionen", "Lines")}</legend>
            <div className="ed__lines">
              {d.lines.map((l, i) => (
                <div key={i} className="ed__line">
                  <span className="ed__pos">{i + 1}</span>
                  <div className="ed__line-main">
                    <input className="ed__title" value={l.title} placeholder={t("Bezeichnung", "Title")} onChange={(e) => setLine(i, { title: e.target.value })} aria-label={t(`Position ${i + 1} Bezeichnung`, `Line ${i + 1} title`)} />
                    <input value={l.detail} placeholder={t("Beschreibung (optional)", "Description (optional)")} onChange={(e) => setLine(i, { detail: e.target.value })} aria-label={t(`Position ${i + 1} Beschreibung`, `Line ${i + 1} description`)} />
                    <div className="ed__line-nums">
                      <label>
                        {t("Menge", "Qty")}
                        <NumIn value={l.qty} onValue={(n) => setLine(i, { qty: n })} />
                      </label>
                      <label>
                        {t("Einheit", "Unit")}
                        <input value={l.unit} onChange={(e) => setLine(i, { unit: e.target.value })} />
                      </label>
                      <label>
                        {t("Preis €", "Price €")}
                        <NumIn value={l.price} onValue={(n) => setLine(i, { price: n })} />
                      </label>
                      <label>
                        {t("USt.", "VAT")}
                        <select value={l.vat} onChange={(e) => setLine(i, { vat: Number(e.target.value) })}>
                          {[19, 7, 0].map((v) => (
                            <option key={v} value={v}>
                              {v} %
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        {t("Rabatt %", "Disc. %")}
                        <NumIn value={l.disc} onValue={(n) => setLine(i, { disc: n })} />
                      </label>
                      <label className="ed__check">
                        <input type="checkbox" checked={l.labour} onChange={(e) => setLine(i, { labour: e.target.checked })} />
                        {t("Arbeitslohn § 35a", "Labour § 35a")}
                      </label>
                    </div>
                  </div>
                  <div className="ed__line-side">
                    <span className="at__strong">{eur(l.qty * l.price * (1 - (l.disc || 0) / 100))}</span>
                    <div className="ed__line-acts">
                      <button type="button" className="at__btn" onClick={() => move(i, -1)} aria-label={t("Nach oben", "Up")} disabled={i === 0}>
                        <ArrowUp aria-hidden="true" />
                      </button>
                      <button type="button" className="at__btn" onClick={() => move(i, 1)} aria-label={t("Nach unten", "Down")} disabled={i === d.lines.length - 1}>
                        <ArrowDown aria-hidden="true" />
                      </button>
                      <button type="button" className="at__btn" onClick={() => set({ lines: d.lines.filter((_, j) => j !== i) })} aria-label={t("Position löschen", "Delete line")}>
                        <Trash2 aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="at__btn" onClick={() => set({ lines: [...d.lines, blankLine()] })}>
              <Plus aria-hidden="true" /> {t("Position hinzufügen", "Add line")}
            </button>
            <div className="ed__row">
              <label>
                {t("Preise sind", "Prices are")}
                <select value={d.priceMode} onChange={(e) => set({ priceMode: e.target.value })}>
                  <option value="gross">{t("Brutto (inkl. USt.)", "Gross (incl. VAT)")}</option>
                  <option value="net">{t("Netto (zzgl. USt.)", "Net (plus VAT)")}</option>
                </select>
              </label>
              <label>
                {t("Gesamtrabatt", "Total discount")}
                <NumIn value={d.discount.value} onValue={(n) => set({ discount: { ...d.discount, value: n } })} />
              </label>
              <label>
                {t("als", "as")}
                <select value={d.discount.type} onChange={(e) => set({ discount: { ...d.discount, type: e.target.value } })}>
                  <option value="pct">%</option>
                  <option value="eur">€</option>
                </select>
              </label>
              {d.type !== "offer" && (
                <label>
                  {t("Abschlag bereits gezahlt €", "Deposit paid €")}
                  <NumIn value={d.deposit} onValue={(n) => set({ deposit: n })} />
                </label>
              )}
            </div>
          </fieldset>

          <div className="ed__sum">
            {dirty ? (
              <span>
                {t("Summe Positionen", "Lines total")}: <strong>{eur(quick)}</strong> <em>{t("(genaue Summen nach dem Speichern)", "(exact totals after saving)")}</em>
              </span>
            ) : (
              <>
                <span>
                  {t("Netto", "Net")} <strong>{eur(view.doc.net)}</strong>
                </span>
                <span>
                  {t("USt.", "VAT")} <strong>{eur(view.doc.vat)}</strong>
                </span>
                <span className="is-total">
                  {t("Brutto", "Gross")} <strong>{eur(view.doc.gross)}</strong>
                </span>
                {view.doc.laborGross > 0 && (
                  <span>
                    {t("davon Arbeitslohn § 35a", "labour § 35a")} <strong>{eur(view.doc.laborGross)}</strong>
                  </span>
                )}
              </>
            )}
          </div>

          <fieldset className="ed__box" disabled={!draft || busy}>
            <legend>{t("Schlusstext", "Closing text")}</legend>
            <textarea rows={3} value={d.outro} onChange={(e) => set({ outro: e.target.value })} />
          </fieldset>

          {preview && (
            <div className="ed__preview">
              <div className="ed__preview-bar">
                <strong>{t("Vorschau", "Preview")}</strong>
                <button type="button" className="at__btn" onClick={() => setPreview("")}>
                  {t("Schließen", "Close")}
                </button>
              </div>
              <iframe title={t("Vorschau des Belegs", "Document preview")} srcDoc={preview} sandbox="" />
            </div>
          )}

          <div className="ed__bar">
            {draft ? (
              <>
                <button type="button" className="at__btn" onClick={remove} disabled={busy}>
                  <Trash2 aria-hidden="true" /> {t("Entwurf löschen", "Delete draft")}
                </button>
                <button type="button" className="at__btn" onClick={showPreview} disabled={busy}>
                  <Eye aria-hidden="true" /> {t("Vorschau", "Preview")}
                </button>
                <button type="button" className="at__btn" onClick={save} disabled={busy || !dirty}>
                  <Save aria-hidden="true" /> {busy ? t("Speichert …", "Saving …") : t("Speichern", "Save")}
                </button>
                <button type="button" className="btn-shine at__new" onClick={issue} disabled={busy}>
                  <Stamp aria-hidden="true" /> {t("Ausstellen", "Issue")}
                </button>
              </>
            ) : (
              <>
                <button type="button" className="at__btn" onClick={showPreview} disabled={busy}>
                  <Eye aria-hidden="true" /> {t("Ansehen", "View")}
                </button>
                {d.type === "offer" && (
                  <button type="button" className="btn-shine at__new" onClick={() => copyAs("invoice")} disabled={busy}>
                    <Copy aria-hidden="true" /> {t("Als Rechnung übernehmen", "Turn into invoice")}
                  </button>
                )}
                {d.type !== "offer" && d.type !== "storno" && d.status !== "Storniert" && (
                  <button type="button" className="at__btn" onClick={cancel} disabled={busy}>
                    <Ban aria-hidden="true" /> {t("Stornieren", "Cancel")}
                  </button>
                )}
                <button type="button" className="at__btn" onClick={() => copyAs(d.type === "storno" ? "invoice" : d.type)} disabled={busy}>
                  <Copy aria-hidden="true" /> {t("Kopieren", "Copy")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}
