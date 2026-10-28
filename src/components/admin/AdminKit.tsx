"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, X } from "lucide-react";

type T = (de: string, en: string) => string;

export interface Column<R> {
  key: string;
  label: string;
  cell: (row: R) => ReactNode;
  /** a value to sort by; columns without it are not sortable */
  sort?: (row: R) => string | number;
  className?: string;
}

/**
 * The one table of the admin: sortable columns, pagination, a click (or Enter) on a row
 * opens its detail. Every list in the admin uses it, so they look and behave the same.
 */
export function DataTable<R>({
  rows,
  columns,
  rowKey,
  onOpen,
  activeKey,
  t,
  empty,
  initialSort,
}: {
  rows: R[];
  columns: Column<R>[];
  rowKey: (row: R) => string;
  onOpen?: (row: R) => void;
  activeKey?: string;
  t: T;
  empty: string;
  initialSort?: { key: string; dir: 1 | -1 };
}) {
  const [sort, setSort] = useState(initialSort || null);
  const [size, setSize] = useState(15);
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    const col = sort && columns.find((c) => c.key === sort.key);
    if (!col?.sort) return rows;
    const get = col.sort;
    return [...rows].sort((a, b) => {
      const x = get(a), y = get(b);
      return (x < y ? -1 : x > y ? 1 : 0) * sort!.dir;
    });
  }, [rows, columns, sort]);

  const pages = Math.max(1, Math.ceil(sorted.length / size));
  // a new filter or search starts on the first page
  useEffect(() => setPage(0), [rows.length, size]);
  const from = Math.min(page, pages - 1) * size;
  const shown = sorted.slice(from, from + size);

  return (
    <div className="dt">
      <div className="at__wrap">
        <table className="at__table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={c.className} aria-sort={sort?.key === c.key ? (sort.dir === 1 ? "ascending" : "descending") : undefined}>
                  {c.sort ? (
                    <button type="button" className="dt__sort" onClick={() => setSort(sort?.key === c.key ? { key: c.key, dir: sort.dir === 1 ? -1 : 1 } : { key: c.key, dir: 1 })}>
                      {c.label}
                      {sort?.key === c.key ? sort.dir === 1 ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" /> : null}
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => {
              const k = rowKey(r);
              return (
                <tr
                  key={k}
                  tabIndex={onOpen ? 0 : undefined}
                  className={activeKey === k ? "is-active" : undefined}
                  onClick={onOpen ? () => onOpen(r) : undefined}
                  onKeyDown={onOpen ? (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onOpen(r)) : undefined}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={c.className}>
                      {c.cell(r)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        {!rows.length && <p className="at__empty">{empty}</p>}
      </div>
      {rows.length > 0 && (
        <div className="dt__foot">
          <span>
            {from + 1}–{Math.min(from + size, sorted.length)} {t("von", "of")} {sorted.length}
          </span>
          <label className="dt__size">
            {t("pro Seite", "per page")}
            <select value={size} onChange={(e) => setSize(Number(e.target.value))}>
              {[15, 30, 50].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <div className="dt__pager">
            <button type="button" className="at__btn" disabled={page === 0} onClick={() => setPage(page - 1)} aria-label={t("Vorherige Seite", "Previous page")}>
              <ChevronLeft aria-hidden="true" />
            </button>
            <span>
              {Math.min(page, pages - 1) + 1} / {pages}
            </span>
            <button type="button" className="at__btn" disabled={page >= pages - 1} onClick={() => setPage(page + 1)} aria-label={t("Nächste Seite", "Next page")}>
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * The detail panel: slides in from the right on wide screens, fills the screen on phones.
 * Esc, the close button or a click beside it closes it.
 */
export function Drawer({ open, title, sub, onClose, children, t, wide }: { open: boolean; title: ReactNode; sub?: ReactNode; onClose: () => void; children: ReactNode; t: T; wide?: boolean }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const before = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("keydown", esc);
      before?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="dw" role="presentation" onClick={onClose}>
      <div className={`dw__panel${wide ? " dw__panel--wide" : ""}`} role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : undefined} tabIndex={-1} ref={panel} onClick={(e) => e.stopPropagation()}>
        <div className="dw__head">
          <div>
            {/* blocks, not paragraphs: the site sizes every paragraph in the page */}
            <div className="dw__t">{title}</div>
            {sub && <div className="dw__sub">{sub}</div>}
          </div>
          <button type="button" className="dw__x" onClick={onClose} aria-label={t("Schließen", "Close")}>
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="dw__body">{children}</div>
      </div>
    </div>
  );
}

/** A label and its value, compact; empty values are left out. */
export function Field({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  if (children === "" || children === null || children === undefined) return null;
  return (
    <div className={`dw__f${wide ? " dw__f--wide" : ""}`}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/** Segmented filter with counts. */
export function Segments<K extends string>({ value, onChange, items, label }: { value: K; onChange: (k: K) => void; items: [K, string, number?][]; label: string }) {
  return (
    <div className="at__chips" role="group" aria-label={label}>
      {items.map(([k, text, n]) => (
        <button key={k} type="button" className={`at__chip${value === k ? " is-on" : ""}`} aria-pressed={value === k} onClick={() => onChange(k)}>
          {text}
          {n !== undefined && <span>{n}</span>}
        </button>
      ))}
    </div>
  );
}

export const status = (s: string) => <span className={`at__status at__status--${s.replace(/\s/g, "")}`}>{s}</span>;
export const dayDe = (iso: string, weekday = false) => {
  if (!/^\d{4}-\d{2}-\d{2}/.test(iso || "")) return iso || "";
  const d = new Date(iso.slice(0, 10) + "T12:00:00");
  return d.toLocaleDateString("de-DE", weekday ? { weekday: "short", day: "2-digit", month: "2-digit" } : { day: "2-digit", month: "2-digit", year: "numeric" });
};
export const eur = (v: number) => (Number(v) || 0).toLocaleString("de-DE", { style: "currency", currency: "EUR" });
export const telHref = (p: string) => `tel:${p.replace(/[^\d+]/g, "")}`;
export const waHref = (p: string) => {
  const d = p.replace(/\D/g, "").replace(/^00/, "").replace(/^0/, "49");
  return `https://wa.me/${d}`;
};
export const mapsHref = (a: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}`;
