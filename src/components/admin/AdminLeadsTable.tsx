"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import type { WorkspaceLead } from "@/lib/backend";
import { DataTable, Segments, status, type Column } from "@/components/admin/AdminKit";

type T = (de: string, en: string) => string;

const STATUS = ["Neu", "In Arbeit", "Angebot raus", "Gebucht", "Erledigt", "Verloren"];

/** "Essen" from "Niebuhrstraße 46, 45144 Essen" or "45144 Essen". */
const town = (a: string) => (a.split(",").pop() || "").replace(/^\s*\d{5}\s*/, "").trim() || a;
/** "28.10.26, 16:29" back to a sortable "26-10-28 16:29". */
const sortable = (s: string) => s.replace(/^(\d{2})\.(\d{2})\.(\d{2,4}),?\s*(.*)$/, "$3-$2-$1 $4");

/**
 * All enquiries at a glance: status filter with counts, search, sortable columns, pages.
 * A click on a row opens the single view.
 */
export default function AdminLeadsTable({ leads, t, onOpen, onNew }: { leads: WorkspaceLead[]; t: T; onOpen: (id: string) => void; onNew: () => void }) {
  const [q, setQ] = useState("");
  const [seg, setSeg] = useState("");

  const counts = useMemo(() => Object.fromEntries(STATUS.map((s) => [s, leads.filter((l) => l.status === s).length])), [leads]);
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter(
      (l) => (!seg || l.status === seg) && (!needle || [l.id, l.name, l.phone, l.email, l.address, l.damageType, l.message].join(" ").toLowerCase().includes(needle))
    );
  }, [leads, q, seg]);

  const columns: Column<WorkspaceLead>[] = [
    { key: "id", label: t("Nr.", "No."), sort: (l) => Number(l.id.replace(/\D/g, "")) || 0, className: "at__nr", cell: (l) => l.id },
    { key: "received", label: t("Eingang", "Received"), sort: (l) => sortable(l.received), cell: (l) => l.received },
    {
      key: "who",
      label: t("Kunde", "Customer"),
      sort: (l) => l.name.toLowerCase(),
      cell: (l) => (
        <>
          <span className="at__strong">{l.name || "—"}</span>
          {l.phone && <span className="at__sub">{l.phone}</span>}
        </>
      ),
    },
    { key: "town", label: t("Ort", "Town"), sort: (l) => town(l.address), cell: (l) => town(l.address) || "—" },
    { key: "what", label: t("Anliegen", "Request"), className: "at__clip", cell: (l) => l.damageType || l.message || "—" },
    { key: "date", label: t("Wunschtermin", "Preferred date"), sort: (l) => l.date || "", cell: (l) => (l.date ? l.date.split("-").reverse().join(".") : "—") },
    { key: "status", label: "Status", sort: (l) => STATUS.indexOf(l.status), cell: (l) => status(l.status) },
  ];

  return (
    <div className="at">
      <div className="at__tools">
        <Segments
          value={seg}
          onChange={setSeg}
          label={t("Nach Status filtern", "Filter by status")}
          items={[["", t("Alle", "All"), leads.length] as [string, string, number], ...STATUS.map((s) => [s, s, counts[s]] as [string, string, number])]}
        />
        <label className="at__search">
          <Search aria-hidden="true" />
          <span className="visually-hidden">{t("Anfragen durchsuchen", "Search inquiries")}</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Name, Telefon, Ort, Nr. …", "Name, phone, town, no. …")} />
        </label>
        <button type="button" className="btn-shine at__new" onClick={onNew}>
          <Plus aria-hidden="true" /> {t("Neue Anfrage", "New inquiry")}
        </button>
      </div>
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(l) => l.id}
        onOpen={(l) => onOpen(l.id)}
        t={t}
        empty={t("Keine Anfrage passt zur Suche.", "No inquiry matches.")}
        initialSort={{ key: "id", dir: -1 }}
      />
    </div>
  );
}
