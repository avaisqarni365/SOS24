"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileDown, Mail, Banknote, PencilLine, Plus, Search } from "lucide-react";
import { adminCall } from "@/lib/adminApi";
import { ADMIN_WEBAPP_URL } from "@/lib/backend";

type T = (de: string, en: string) => string;

/** A quote or invoice as the back office lists it (uiFormatDoc_ in Belege.js). */
interface Doc {
  nr: string;
  type: string;
  typeLabel: string;
  status: string;
  leadId: string;
  name: string;
  email: string;
  date: string;
  dueDate: string;
  gross: number;
  pdfUrl: string;
}

const eur = (v: number) => (Number(v) || 0).toLocaleString("de-DE", { style: "currency", currency: "EUR" });
const day = (iso: string) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso.split("-").reverse().join(".") : iso);
const editor = (nr?: string) => ADMIN_WEBAPP_URL + (nr ? `?b=${encodeURIComponent(nr)}` : "");

/**
 * The real quotes and invoices from the Google Sheet (GoBD numbering, PDF archive in Drive):
 * list, totals, PDF, payment and e-mail here; writing the lines of a new or draft document
 * happens in the back office's invoice editor, which opens in a new tab.
 */
export default function AdminInvoices({ t, onSessionEnd, onOpenLead }: { t: T; onSessionEnd: () => void; onOpenLead: (id: string) => void }) {
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState("");
  const [kind, setKind] = useState<"" | "offer" | "invoice">("");
  const [q, setQ] = useState("");
  const [pay, setPay] = useState<Doc | null>(null);

  const fail = useCallback(
    (e: string) => {
      if (e === "login") onSessionEnd();
      else setErr(e);
    },
    [onSessionEnd]
  );
  const load = useCallback(() => {
    adminCall<{ docs: Doc[] }>("api_docs").then((r) => (r.ok ? (setDocs(r.data.docs), setErr("")) : fail(r.error)));
  }, [fail]);
  useEffect(load, [load]);

  const act = async (nr: string, fn: string, ...args: unknown[]) => {
    setBusy(nr);
    setNote("");
    const r = await adminCall<Record<string, unknown>>(fn, nr, ...args);
    setBusy("");
    if (!r.ok) return fail(r.error), null;
    load();
    return r.data;
  };

  const rows = useMemo(() => {
    if (!docs) return [];
    const needle = q.trim().toLowerCase();
    return docs
      .filter((d) => !kind || (kind === "offer" ? d.type === "offer" : d.type !== "offer"))
      .filter((d) => !needle || [d.nr, d.name, d.leadId, d.typeLabel].join(" ").toLowerCase().includes(needle))
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [docs, kind, q]);

  const sums = useMemo(() => {
    const inv = (docs || []).filter((d) => d.type !== "offer" && d.status !== "Entwurf" && d.status !== "Storniert");
    return {
      open: inv.filter((d) => ["Offen", "Überfällig", "Teilbezahlt"].includes(d.status)).reduce((s, d) => s + d.gross, 0),
      overdue: inv.filter((d) => d.status === "Überfällig").length,
      paid: inv.filter((d) => d.status === "Bezahlt").reduce((s, d) => s + d.gross, 0),
    };
  }, [docs]);

  if (!docs) return <div className="at__card">{err ? t(`Laden fehlgeschlagen: ${err}`, `Loading failed: ${err}`) : t("Lade Belege aus der Google-Tabelle …", "Loading documents …")}</div>;

  return (
    <div className="at">
      <div className="at__kpis">
        <div>
          <span>{t("Offen", "Open")}</span>
          <strong>{eur(sums.open)}</strong>
        </div>
        <div>
          <span>{t("Überfällig", "Overdue")}</span>
          <strong className={sums.overdue ? "is-bad" : ""}>{sums.overdue}</strong>
        </div>
        <div>
          <span>{t("Bezahlt", "Paid")}</span>
          <strong>{eur(sums.paid)}</strong>
        </div>
        <a className="btn-shine at__new" href={editor()} target="_blank" rel="noopener noreferrer">
          <Plus aria-hidden="true" /> {t("Neues Angebot / neue Rechnung", "New quote / invoice")}
        </a>
      </div>

      <div className="at__tools">
        <label className="at__search">
          <Search aria-hidden="true" />
          <span className="visually-hidden">{t("Belege durchsuchen", "Search documents")}</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Nr., Kunde, Anfrage …", "No., customer, inquiry …")} />
        </label>
        <div className="at__chips" role="group">
          {([["", t("Alle", "All")], ["offer", t("Angebote", "Quotes")], ["invoice", t("Rechnungen", "Invoices")]] as const).map(([k, label]) => (
            <button key={k} type="button" className={`at__chip${kind === k ? " is-on" : ""}`} onClick={() => setKind(k)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {err && <p className="at__err">{err}</p>}
      {note && <p className="at__okline">{note}</p>}

      <div className="at__wrap">
        <table className="at__table">
          <thead>
            <tr>
              <th scope="col">{t("Nr.", "No.")}</th>
              <th scope="col">{t("Art", "Type")}</th>
              <th scope="col">{t("Kunde", "Customer")}</th>
              <th scope="col">{t("Datum", "Date")}</th>
              <th scope="col">{t("Fällig", "Due")}</th>
              <th scope="col" className="at__num">{t("Brutto", "Gross")}</th>
              <th scope="col">Status</th>
              <th scope="col">{t("Aktionen", "Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.nr} className={busy === d.nr ? "is-busy" : ""}>
                <td className="at__nr">{d.nr}</td>
                <td>{d.typeLabel}</td>
                <td>
                  <span className="at__strong">{d.name || "—"}</span>
                  {d.leadId && (
                    <span className="at__sub">
                      <button type="button" className="at__link" onClick={() => onOpenLead(d.leadId)}>
                        {d.leadId}
                      </button>
                    </span>
                  )}
                </td>
                <td>{day(d.date)}</td>
                <td>{d.type === "offer" ? "—" : day(d.dueDate)}</td>
                <td className="at__num at__strong">{eur(d.gross)}</td>
                <td>
                  <span className={`at__status at__status--${d.status.replace(/\s/g, "")}`}>{d.status}</span>
                </td>
                <td className="at__acts">
                  {d.status === "Entwurf" ? (
                    <a className="at__btn" href={editor(d.nr)} target="_blank" rel="noopener noreferrer">
                      <PencilLine aria-hidden="true" /> {t("Bearbeiten", "Edit")}
                    </a>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="at__btn"
                        disabled={busy === d.nr}
                        onClick={async () => {
                          if (d.pdfUrl) return void window.open(d.pdfUrl, "_blank", "noopener");
                          const r = (await act(d.nr, "api_docPdf")) as { pdfUrl?: string } | null;
                          if (r?.pdfUrl) window.open(r.pdfUrl, "_blank", "noopener");
                        }}
                      >
                        <FileDown aria-hidden="true" /> PDF
                      </button>
                      <button
                        type="button"
                        className="at__btn"
                        disabled={busy === d.nr || !d.email}
                        title={d.email || t("Keine E-Mail-Adresse", "No e-mail address")}
                        onClick={async () => {
                          if (!window.confirm(t(`${d.typeLabel} ${d.nr} jetzt an ${d.email} senden?`, `Send ${d.nr} to ${d.email} now?`))) return;
                          if (await act(d.nr, "api_docSend", {})) setNote(t(`${d.nr} wurde an ${d.email} gesendet.`, `${d.nr} sent to ${d.email}.`));
                        }}
                      >
                        <Mail aria-hidden="true" /> {t("Senden", "Send")}
                      </button>
                      {d.type !== "offer" && ["Offen", "Überfällig", "Teilbezahlt"].includes(d.status) && (
                        <button type="button" className="at__btn" disabled={busy === d.nr} onClick={() => setPay(d)}>
                          <Banknote aria-hidden="true" /> {t("Zahlung", "Payment")}
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="at__empty">{t("Keine Belege.", "No documents.")}</p>}
      </div>

      {pay && (
        <form
          className="at__pay"
          onSubmit={async (e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            // "1.234,56" as people type it; the back office expects 1234.56
            const amount = Number(String(f.get("amount") || "").replace(/\s|€/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", "."));
            const ok = await act(pay.nr, "api_docPay", { amount, date: f.get("date"), method: f.get("method") });
            if (ok) {
              setNote(t(`Zahlung zu ${pay.nr} erfasst.`, `Payment for ${pay.nr} recorded.`));
              setPay(null);
            }
          }}
        >
          <p className="at__h">
            {t("Zahlung erfassen", "Record payment")}: {pay.nr} · {pay.name}
          </p>
          <label>
            {t("Betrag (€)", "Amount (€)")}
            <input name="amount" inputMode="decimal" required defaultValue={(Number(pay.gross) || 0).toFixed(2).replace(".", ",")} />
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
          <div className="at__acts">
            <button type="button" className="at__btn" onClick={() => setPay(null)}>
              {t("Abbrechen", "Cancel")}
            </button>
            <button type="submit" className="btn-shine at__new" disabled={busy === pay.nr}>
              {t("Zahlung speichern", "Save payment")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
