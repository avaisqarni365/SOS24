"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Camera, ExternalLink, FolderOpen, Search, Upload } from "lucide-react";
import { adminCall } from "@/lib/adminApi";
import { resizeImageToBase64, type WorkspaceLead } from "@/lib/backend";
import { DataTable, Drawer, dayDe, type Column } from "@/components/admin/AdminKit";

type T = (de: string, en: string) => string;

interface Folder {
  lead: string;
  count: number;
  last?: string;
  url: string;
}
interface Photo {
  id: string;
  name: string;
  type: string;
  at: string;
  size: number;
  url: string;
  thumb: string;
}

/**
 * Fotos: the customers' damage photos and the photos from site visits, one Drive folder per
 * enquiry ("SOS Abdichtung - Kundenfotos/<Nr.>"). A folder opens with previews; new photos
 * (e.g. taken on site with the phone) are shrunk to 1600 px and uploaded into it.
 */
export default function AdminPhotos({ t, leads, onSessionEnd, onOpenLead }: { t: T; leads: WorkspaceLead[]; onSessionEnd: () => void; onOpenLead: (id: string) => void }) {
  const [folders, setFolders] = useState<Folder[] | null>(null);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState("");
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [busy, setBusy] = useState("");
  const [target, setTarget] = useState("");
  const file = useRef<HTMLInputElement>(null);

  const fail = useCallback((e: string) => (e === "login" ? onSessionEnd() : setErr(e)), [onSessionEnd]);
  const load = useCallback(() => {
    adminCall<{ folders: Folder[] }>("api_photos").then((r) => (r.ok ? (setFolders(r.data.folders), setErr("")) : fail(r.error)));
  }, [fail]);
  useEffect(load, [load]);
  useEffect(() => {
    setPhotos(null);
    if (!open) return;
    adminCall<{ photos: Photo[] }>("api_photos", open).then((r) => (r.ok ? setPhotos(r.data.photos) : fail(r.error)));
  }, [open, fail]);

  const name = useMemo(() => Object.fromEntries(leads.map((l) => [l.id, l.name])), [leads]);
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (folders || []).filter((f) => !needle || (f.lead + " " + (name[f.lead] || "")).toLowerCase().includes(needle));
  }, [folders, q, name]);

  const upload = async (leadId: string, list: FileList | null) => {
    if (!list || !list.length) return;
    setBusy(leadId);
    setErr("");
    try {
      const images = await Promise.all(Array.from(list).slice(0, 10).map((f) => resizeImageToBase64(f, 1600)));
      const r = await adminCall<{ photos: Photo[] }>("api_photoUpload", leadId, images.map((i) => ({ type: i.type, data: i.data })));
      if (!r.ok) return fail(r.error);
      setOpen(leadId);
      setPhotos(r.data.photos);
      load();
    } catch (e) {
      setErr(String((e as Error).message || e));
    } finally {
      setBusy("");
      if (file.current) file.current.value = "";
    }
  };

  if (!folders) return <div className="at__card">{err ? t(`Laden fehlgeschlagen: ${err}`, `Loading failed: ${err}`) : t("Lade Foto-Ordner aus Google Drive …", "Loading photo folders …")}</div>;

  const columns: Column<Folder>[] = [
    { key: "lead", label: t("Anfrage", "Inquiry"), sort: (f) => Number(f.lead.replace(/\D/g, "")) || 0, className: "at__nr", cell: (f) => f.lead },
    { key: "who", label: t("Kunde", "Customer"), sort: (f) => (name[f.lead] || "").toLowerCase(), cell: (f) => <span className="at__strong">{name[f.lead] || "—"}</span> },
    { key: "count", label: t("Fotos", "Photos"), sort: (f) => f.count, className: "at__num", cell: (f) => f.count },
    { key: "last", label: t("Zuletzt", "Latest"), sort: (f) => f.last || "", cell: (f) => (f.last ? dayDe(f.last) : "—") },
  ];

  return (
    <div className="at">
      <div className="at__kpis">
        <div>
          <span>{t("Ordner", "Folders")}</span>
          <strong>{folders.length}</strong>
        </div>
        <div>
          <span>{t("Fotos gesamt", "Photos total")}</span>
          <strong>{folders.reduce((s, f) => s + f.count, 0)}</strong>
        </div>
      </div>

      <div className="at__tools">
        <label className="at__search">
          <Search aria-hidden="true" />
          <span className="visually-hidden">{t("Ordner suchen", "Search folders")}</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Anfrage-Nr. oder Name …", "Inquiry no. or name …")} />
        </label>
        <label className="ph__pick">
          <span className="visually-hidden">{t("Anfrage für neue Fotos", "Inquiry for new photos")}</span>
          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="">{t("Fotos hochladen zu …", "Upload photos to …")}</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.id} · {l.name}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn-shine at__new" disabled={!target || !!busy} onClick={() => file.current?.click()}>
          <Camera aria-hidden="true" /> {busy ? t("Lädt hoch …", "Uploading …") : t("Fotos aufnehmen / wählen", "Take / choose photos")}
        </button>
        <input ref={file} type="file" accept="image/*" multiple hidden onChange={(e) => upload(open || target, e.target.files)} />
      </div>

      {err && <p className="at__err">{err}</p>}

      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(f) => f.lead}
        onOpen={(f) => setOpen(f.lead)}
        activeKey={open}
        t={t}
        empty={t("Noch keine Fotos in Google Drive.", "No photos in Google Drive yet.")}
        initialSort={{ key: "last", dir: -1 }}
      />

      <Drawer open={!!open} onClose={() => setOpen("")} t={t} title={`${t("Fotos", "Photos")} · ${open}`} sub={name[open] || ""}>
        <div className="dw__acts">
          <button type="button" className="btn-shine at__new" disabled={!!busy} onClick={() => file.current?.click()}>
            <Upload aria-hidden="true" /> {busy ? t("Lädt hoch …", "Uploading …") : t("Fotos hinzufügen", "Add photos")}
          </button>
          {folders.find((f) => f.lead === open)?.url && (
            <a className="at__btn" href={folders.find((f) => f.lead === open)!.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden="true" /> {t("Ordner in Drive", "Folder in Drive")}
            </a>
          )}
          {name[open] && (
            <button
              type="button"
              className="at__btn"
              onClick={() => {
                const id = open;
                setOpen("");
                onOpenLead(id);
              }}
            >
              <FolderOpen aria-hidden="true" /> {t(`Anfrage ${open} öffnen`, `Open inquiry ${open}`)}
            </button>
          )}
        </div>
        {!photos ? (
          <p className="at__empty">{t("Lade Vorschauen …", "Loading previews …")}</p>
        ) : photos.length ? (
          <ul className="ph__grid">
            {photos.map((p) => (
              <li key={p.id}>
                <a href={p.url} target="_blank" rel="noopener noreferrer" title={p.name}>
                  {p.thumb ? <img src={p.thumb} alt={p.name} loading="lazy" /> : <span className="ph__none">{p.name}</span>}
                  <span className="ph__cap">{dayDe(p.at)}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="at__empty">{t("Noch keine Fotos in diesem Ordner.", "No photos in this folder yet.")}</p>
        )}
      </Drawer>
    </div>
  );
}
