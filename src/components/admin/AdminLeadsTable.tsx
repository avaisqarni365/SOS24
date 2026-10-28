"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { WorkspaceLead } from "@/lib/backend";

type T = (de: string, en: string) => string;

const STATUS = ["Neu", "In Arbeit", "Angebot raus", "Gebucht", "Erledigt", "Verloren"];

/** "Essen" from "Niebuhrstraße 46, 45144 Essen" or "45144 Essen". */
const town = (a: string) => (a.split(",").pop() || "").replace(/^\s*\d{5}\s*/, "").trim() || a;

/**
 * All enquiries at a glance: search, status filter with counts, newest first.
 * A click on a row opens the single view.
 */
export default function AdminLeadsTable({ leads, t, onOpen }: { leads: WorkspaceLead[]; t: T; onOpen: (id: string) => void }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  const counts = useMemo(() => Object.fromEntries(STATUS.map((s) => [s, leads.filter((l) => l.status === s).length])), [leads]);
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter(
      (l) =>
        (!status || l.status === status) &&
        (!needle || [l.id, l.name, l.phone, l.email, l.address, l.damageType, l.message].join(" ").toLowerCase().includes(needle))
    );
  }, [leads, q, status]);

  return (
    <div className="at">
      <div className="at__tools">
        <label className="at__search">
          <Search aria-hidden="true" />
          <span className="visually-hidden">{t("Anfragen durchsuchen", "Search inquiries")}</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Name, Telefon, Ort, Nr. …", "Name, phone, town, no. …")} />
        </label>
        <div className="at__chips" role="group" aria-label={t("Nach Status filtern", "Filter by status")}>
          <button type="button" className={`at__chip${status ? "" : " is-on"}`} onClick={() => setStatus("")}>
            {t("Alle", "All")} <span>{leads.length}</span>
          </button>
          {STATUS.map((s) => (
            <button key={s} type="button" className={`at__chip at__chip--${s.replace(/\s/g, "")}${status === s ? " is-on" : ""}`} onClick={() => setStatus(status === s ? "" : s)}>
              {s} <span>{counts[s]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="at__wrap">
        <table className="at__table">
          <thead>
            <tr>
              <th scope="col">{t("Nr.", "No.")}</th>
              <th scope="col">{t("Eingang", "Received")}</th>
              <th scope="col">{t("Kunde", "Customer")}</th>
              <th scope="col">{t("Ort", "Town")}</th>
              <th scope="col">{t("Anliegen", "Request")}</th>
              <th scope="col">{t("Telefon", "Phone")}</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id} tabIndex={0} onClick={() => onOpen(l.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onOpen(l.id))}>
                <td className="at__nr">{l.id}</td>
                <td>{l.received}</td>
                <td className="at__strong">{l.name || "—"}</td>
                <td>{town(l.address) || "—"}</td>
                <td className="at__clip">{l.damageType || l.message || "—"}</td>
                <td>
                  {l.phone ? (
                    <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} onClick={(e) => e.stopPropagation()}>
                      {l.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <span className={`at__status at__status--${l.status.replace(/\s/g, "")}`}>{l.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="at__empty">{t("Keine Anfrage passt zur Suche.", "No inquiry matches.")}</p>}
      </div>
    </div>
  );
}
