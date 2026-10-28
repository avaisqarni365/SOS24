"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileDown, Mail, Banknote, PencilLine, Plus, Search, FolderOpen, Phone } from "lucide-react";
import { adminCall } from "@/lib/adminApi";
import { ADMIN_WEBAPP_URL } from "@/lib/backend";
import { DataTable, Drawer, Field, Segments, status, dayDe, eur, telHref, type Column } from "@/components/admin/AdminKit";

type T = (de: string, en: string) => string;

/** A quote or invoice as the back office lists it (uiFormatDoc_ in Belege.js). */
interface Doc {
  nr: string;
  type: string;
  typeLabel: string;
  status: string;
  leadId: string;
  ref: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  validUntil: string;
  dueDate: string;
  net: number;
  vat: number;
  gross: number;
  laborGross: number;
  pdfUrl: string;
  sentAt: string;
  /** title, detail, unit, qty, price, labour */
  items: [string, string, string, number, number, boolean][];
}
interface Raw {
  payments?: { date: string; amount: number; method: string }[];
  log?: { at: string; by: string; what: string }[];
}
type Seg = "all" | "offer" | "invoice" | "open" | "overdue" | "draft";

const editor = (nr?: string) => ADMIN_WEBAPP_URL + (nr ? `?b=${encodeURIComponent(nr)}` : "");
const OPEN = ["Offen", "Überfällig", "Teilbezahlt"];

/**
 * Belege: the real quotes and invoices from the Google Sheet (GoBD numbers, PDFs in Drive)
 * as one table; a row opens the document with its lines, totals, payments and history.
 * Writing the lines of a new or draft document happens in the back office's invoice editor.
 */
export default function AdminInvoices({ t, onSessionEnd, onOpenLead }: { t: T; onSessionEnd: () => void; onOpenLead: (id: string) => void }) {
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [seg, setSeg] = useState<Seg>("all");
  const [q, setQ] = useState("");
  const [openNr, setOpenNr] = useState("");
  const [raw, setRaw] = useState<Raw | null>(null);
  const [paying, setPaying] = useState(false);

  const fail = useCallback((e: string) => (e === "login" ? onSessionEnd() : setErr(e)), [onSessionEnd]);
  const load = useCallback(() => {
    adminCall<{ docs: Doc[] }>("api_docs").then((r) => (r.ok ? (setDocs(r.data.docs), setErr("")) : fail(r.error)));
  }, [fail]);
  useEffect(load, [load]);

  // payments and history come with the full document, fetched when it is opened
  useEffect(() => {
    setRaw(null);
    setPaying(false);
    if (!openNr) return;
    adminCall<{ rawDoc: Raw }>("api_doc", openNr).then((r) => r.ok && setRaw(r.data.rawDoc || {}));
  }, [openNr]);

  const act = async (nr: string, fn: string, ...args: unknown[]) => {
    setBusy(true);
    setNote("");
    const r = await adminCall<Record<string, unknown>>(fn, nr, ...args);
    setBusy(false);
    if (!r.ok) return fail(r.error), null;
    load();
    return r.data;
  };

  const split = useMemo(() => {
    const all = docs || [];
    return {
      all,
      offer: all.filter((d) => d.type === "offer"),
      invoice: all.filter((d) => d.type !== "offer"),
      open: all.filter((d) => d.type !== "offer" && OPEN.includes(d.status)),
      overdue: all.filter((d) => d.status === "Überfällig"),
      draft: all.filter((d) => d.status === "Entwurf"),
    };
  }, [docs]);
  const sums = useMemo(
    () => ({
      open: split.open.reduce((s, d) => s + d.gross, 0),
      paid: split.invoice.filter((d) => d.status === "Bezahlt").reduce((s, d) => s + d.gross, 0),
      offers: split.offer.filter((d) => ["Offen", "Versendet"].includes(d.status)).reduce((s, d) => s + d.gross, 0),
    }),
    [split]
  );
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return split[seg].filter((d) => !needle || [d.nr, d.name, d.leadId, d.typeLabel, d.service, d.email].join(" ").toLowerCase().includes(needle));
  }, [split, seg, q]);

  if (!docs) return <div className="at__card">{err ? t(`Laden fehlgeschlagen: ${err}`, `Loading failed: ${err}`) : t("Lade Belege aus der Google-Tabelle …", "Loading documents …")}</div>;

  const cur = docs.find((d) => d.nr === openNr) || null;

  const columns: Column<Doc>[] = [
    { key: "nr", label: t("Nr.", "No."), sort: (d) => d.nr, className: "at__nr", cell: (d) => d.nr },
    { key: "type", label: t("Art", "Type"), sort: (d) => d.typeLabel, cell: (d) => d.typeLabel },
    {
      key: "who",
      label: t("Kunde", "Customer"),
      sort: (d) => d.name.toLowerCase(),
      cell: (d) => (
        <>
          <span className="at__strong">{d.name || "—"}</span>
          {d.service && <span className="at__sub at__clip">{d.service}</span>}
        </>
      ),
    },
    { key: "date", label: t("Datum", "Date"), sort: (d) => d.date, cell: (d) => dayDe(d.date) },
    { key: "due", label: t("Fällig / gültig", "Due / valid"), sort: (d) => (d.type === "offer" ? d.validUntil : d.dueDate), cell: (d) => dayDe(d.type === "offer" ? d.validUntil : d.dueDate) || "—" },
    { key: "gross", label: t("Brutto", "Gross"), sort: (d) => d.gross, className: "at__num", cell: (d) => <span className="at__strong">{eur(d.gross)}</span> },
    { key: "status", label: "Status", sort: (d) => d.status, cell: (d) => status(d.status) },
  ];

  return (
    <div className="at">
      <div className="at__kpis">
        <div>
          <span>{t("Offene Rechnungen", "Open invoices")}</span>
          <strong>{eur(sums.open)}</strong>
        </div>
        <div>
          <span>{t("Überfällig", "Overdue")}</span>
          <strong className={split.overdue.length ? "is-bad" : ""}>{split.overdue.length}</strong>
        </div>
        <div>
          <span>{t("Angebote offen", "Open quotes")}</span>
          <strong>{eur(sums.offers)}</strong>
        </div>
        <div>
          <span>{t("Bezahlt", "Paid")}</span>
          <strong>{eur(sums.paid)}</strong>
        </div>
      </div>

      <div className="at__tools">
        <Segments
          value={seg}
          onChange={setSeg}
          label={t("Belege filtern", "Filter documents")}
          items={[
            ["all", t("Alle", "All"), split.all.length],
            ["offer", t("Angebote", "Quotes"), split.offer.length],
            ["invoice", t("Rechnungen", "Invoices"), split.invoice.length],
            ["open", t("Offen", "Open"), split.open.length],
            ["overdue", t("Überfällig", "Overdue"), split.overdue.length],
            ["draft", t("Entwürfe", "Drafts"), split.draft.length],
          ]}
        />
        <label className="at__search">
          <Search aria-hidden="true" />
          <span className="visually-hidden">{t("Belege durchsuchen", "Search documents")}</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Nr., Kunde, Anfrage …", "No., customer, inquiry …")} />
        </label>
        <a className="btn-shine at__new" href={editor()} target="_blank" rel="noopener noreferrer">
          <Plus aria-hidden="true" /> {t("Neuer Beleg", "New document")}
        </a>
      </div>

      {err && <p className="at__err">{err}</p>}
      {note && <p className="at__okline">{note}</p>}

      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(d) => d.nr}
        onOpen={(d) => setOpenNr(d.nr)}
        activeKey={openNr}
        t={t}
        empty={t("Keine Belege in dieser Ansicht.", "No documents in this view.")}
        initialSort={{ key: "date", dir: -1 }}
      />

      <Drawer open={!!cur} onClose={() => setOpenNr("")} t={t} title={cur ? `${cur.typeLabel} ${cur.nr}` : ""} sub={cur ? `${cur.name} · ${dayDe(cur.date)}` : ""}>
        {cur && (
          <>
            <div className="dw__acts">
              {cur.status === "Entwurf" ? (
                <a className="btn-shine at__new" href={editor(cur.nr)} target="_blank" rel="noopener noreferrer">
                  <PencilLine aria-hidden="true" /> {t("Im Beleg-Editor bearbeiten", "Edit in the invoice editor")}
                </a>
              ) : (
                <>
                  <button
                    type="button"
                    className="at__btn"
                    disabled={busy}
                    onClick={async () => {
                      if (cur.pdfUrl) return void window.open(cur.pdfUrl, "_blank", "noopener");
                      const r = (await act(cur.nr, "api_docPdf")) as { pdfUrl?: string } | null;
                      if (r?.pdfUrl) window.open(r.pdfUrl, "_blank", "noopener");
                    }}
                  >
                    <FileDown aria-hidden="true" /> PDF
                  </button>
                  <button
                    type="button"
                    className="at__btn"
                    disabled={busy || !cur.email}
                    title={cur.email || t("Keine E-Mail-Adresse", "No e-mail address")}
                    onClick={async () => {
                      if (!window.confirm(t(`${cur.typeLabel} ${cur.nr} jetzt an ${cur.email} senden?`, `Send ${cur.nr} to ${cur.email} now?`))) return;
                      if (await act(cur.nr, "api_docSend", {})) setNote(t(`${cur.nr} wurde an ${cur.email} gesendet.`, `${cur.nr} sent to ${cur.email}.`));
                    }}
                  >
                    <Mail aria-hidden="true" /> {t("Per E-Mail senden", "Send by e-mail")}
                  </button>
                  {cur.type !== "offer" && OPEN.includes(cur.status) && (
                    <button type="button" className="at__btn" disabled={busy} onClick={() => setPaying(true)}>
                      <Banknote aria-hidden="true" /> {t("Zahlung erfassen", "Record payment")}
                    </button>
                  )}
                </>
              )}
              {cur.phone && (
                <a className="at__btn" href={telHref(cur.phone)}>
                  <Phone aria-hidden="true" /> {t("Anrufen", "Call")}
                </a>
              )}
            </div>

            {paying && (
              <form
                className="dw__pay"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  // "1.234,56" as people type it; the back office expects 1234.56
                  const amount = Number(String(f.get("amount") || "").replace(/\s|€/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", "."));
                  const ok = await act(cur.nr, "api_docPay", { amount, date: f.get("date"), method: f.get("method") });
                  if (ok) {
                    setNote(t(`Zahlung zu ${cur.nr} erfasst.`, `Payment for ${cur.nr} recorded.`));
                    setPaying(false);
                    setOpenNr(cur.nr);
                  }
                }}
              >
                <label>
                  {t("Betrag (€)", "Amount (€)")}
                  <input name="amount" inputMode="decimal" required defaultValue={(Number(cur.gross) || 0).toFixed(2).replace(".", ",")} />
                </label>
                <label>
                  {t("Datum", "Date")}
                  <input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
                </label>
                <label>
                  {t("Zahlungsart", "Method")}
                  <select name="method" defaultValue="Überweisung">
                    {["Überweisung", "Bar", "EC-/Kreditkarte", "PayPal"].map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </label>
                <div className="dw__acts">
                  <button type="button" className="at__btn" onClick={() => setPaying(false)}>
                    {t("Abbrechen", "Cancel")}
                  </button>
                  <button type="submit" className="btn-shine at__new" disabled={busy}>
                    {t("Zahlung speichern", "Save payment")}
                  </button>
                </div>
              </form>
            )}

            <dl className="dw__grid">
              <Field label="Status">{status(cur.status)}</Field>
              <Field label={cur.type === "offer" ? t("Gültig bis", "Valid until") : t("Fällig am", "Due")}>{dayDe(cur.type === "offer" ? cur.validUntil : cur.dueDate)}</Field>
              <Field label={t("Kunde", "Customer")} wide>
                {[cur.name, cur.address].filter(Boolean).join(" · ")}
              </Field>
              <Field label={t("E-Mail", "E-mail")}>{cur.email}</Field>
              <Field label={t("Telefon", "Phone")}>{cur.phone}</Field>
              <Field label={t("Betreff", "Subject")} wide>
                {cur.service}
              </Field>
              <Field label={t("Versendet", "Sent")}>{cur.sentAt ? dayDe(cur.sentAt) : ""}</Field>
              <Field label={t("Bezug", "Reference")}>{cur.ref}</Field>
            </dl>

            {cur.items?.length > 0 && (
              <div className="dw__lines">
                <table>
                  <thead>
                    <tr>
                      <th>{t("Leistung", "Item")}</th>
                      <th className="at__num">{t("Menge", "Qty")}</th>
                      <th className="at__num">{t("Preis", "Price")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cur.items.map(([title, detail, unit, qty, price], i) => (
                      <tr key={i}>
                        <td>
                          <span className="at__strong">{title}</span>
                          {detail && <span className="at__sub">{detail}</span>}
                        </td>
                        <td className="at__num">
                          {qty} {unit}
                        </td>
                        <td className="at__num">{eur(price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <dl className="dw__sum">
                  <div>
                    <dt>{t("Netto", "Net")}</dt>
                    <dd>{eur(cur.net)}</dd>
                  </div>
                  <div>
                    <dt>{t("USt.", "VAT")}</dt>
                    <dd>{eur(cur.vat)}</dd>
                  </div>
                  <div className="is-total">
                    <dt>{t("Brutto", "Gross")}</dt>
                    <dd>{eur(cur.gross)}</dd>
                  </div>
                  {cur.laborGross > 0 && (
                    <div>
                      <dt>{t("davon Arbeitslohn (§ 35a)", "of which labour (§ 35a)")}</dt>
                      <dd>{eur(cur.laborGross)}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {raw?.payments && raw.payments.length > 0 && (
              <div className="dw__hist">
                <p className="dw__h">{t("Zahlungen", "Payments")}</p>
                <ul>
                  {raw.payments.map((p, i) => (
                    <li key={i}>
                      {dayDe(p.date)} · {eur(p.amount)} · {p.method}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {raw?.log && raw.log.length > 0 && (
              <div className="dw__hist">
                <p className="dw__h">{t("Verlauf", "History")}</p>
                <ul>
                  {raw.log
                    .slice()
                    .reverse()
                    .map((l, i) => (
                      <li key={i}>
                        {dayDe(l.at)} · {l.what}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {cur.leadId && (
              <div className="dw__acts">
                <button
                  type="button"
                  className="at__btn"
                  onClick={() => {
                    setOpenNr("");
                    onOpenLead(cur.leadId);
                  }}
                >
                  <FolderOpen aria-hidden="true" /> {t(`Anfrage ${cur.leadId} öffnen`, `Open inquiry ${cur.leadId}`)}
                </button>
              </div>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
}
