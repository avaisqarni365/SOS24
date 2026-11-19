"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { ExternalLink, Film, Trash2, Upload } from "lucide-react";
import { adminCall } from "@/lib/adminApi";
import { Segments, dayDe } from "@/components/admin/AdminKit";

type T = (de: string, en: string) => string;

export interface MediaItem {
  id: string;
  name: string;
  type: string;
  w: number;
  h: number;
  size: number;
  at: string;
  by: string;
  thumb: string;
  url: string;
}
interface MediaList {
  items: MediaItem[];
  folderUrl: string;
  limits: { image: number; video: number };
  saved?: number;
  skipped?: string[];
}

const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const VIDEO_MAX = 25 * 1024 * 1024;
export const isImage = (m: { type: string }) => m.type.startsWith("image/");
const mb = (bytes: number) => (bytes < 1024 * 1024 ? Math.max(1, Math.round(bytes / 1024)) + " KB" : (bytes / 1024 / 1024).toLocaleString("de-DE", { maximumFractionDigits: 1 }) + " MB");

/** Shrinks a photo to at most `max` px (JPEG) and returns it with its size and a small preview. */
async function encodeImage(file: File, max = 2000): Promise<{ name: string; type: string; data: string; w: number; h: number; thumb: string }> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error(`${file.name}: Dieses Bildformat kann der Browser nicht lesen (z. B. HEIC vom iPhone). Bitte als JPG speichern.`));
      i.src = url;
    });
    const draw = (limit: number, quality: number) => {
      const k = Math.min(1, limit / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * k));
      const h = Math.max(1, Math.round(img.naturalHeight * k));
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      if (!ctx) throw new Error("Canvas nicht verfügbar.");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      return { w, h, url: c.toDataURL("image/jpeg", quality) };
    };
    const full = draw(max, 0.85);
    const small = draw(320, 0.7);
    return { name: file.name, type: "image/jpeg", data: full.url.replace(/^data:[^,]*,/, ""), w: full.w, h: full.h, thumb: small.url };
  } finally {
    URL.revokeObjectURL(url);
  }
}

const readBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(new Error(`${file.name}: Datei konnte nicht gelesen werden.`));
    r.onload = () => resolve(String(r.result).replace(/^data:[^,]*,/, ""));
    r.readAsDataURL(file);
  });

/**
 * Mediathek: the photos and short videos for the website and for social media posts, kept in
 * one Drive folder. Photos are shrunk in the browser before the upload; videos go up as they are.
 */
export default function AdminMedia({ t, onSessionEnd }: { t: T; onSessionEnd: () => void }) {
  const [list, setList] = useState<MediaList | null>(null);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState("");
  const [over, setOver] = useState(false);
  const [kind, setKind] = useState<"all" | "image" | "video">("all");
  const input = useRef<HTMLInputElement>(null);

  const fail = useCallback((e: string) => (e === "login" ? onSessionEnd() : setErr(e)), [onSessionEnd]);
  useEffect(() => {
    adminCall<MediaList>("api_mediaList").then((r) => (r.ok ? setList(r.data) : fail(r.error)));
  }, [fail]);

  const upload = async (files: File[]) => {
    if (!files.length || busy) return;
    setErr("");
    setNote("");
    const images = files.filter((f) => f.type.startsWith("image/"));
    const videos = files.filter((f) => VIDEO_TYPES.includes(f.type));
    const problems: string[] = files.filter((f) => !images.includes(f) && !videos.includes(f)).map((f) => `${f.name}: ${t("Format nicht erlaubt", "format not allowed")}`);
    let saved = 0;
    let done = 0;
    const total = images.length + videos.length;
    const send = async (payload: unknown[]) => {
      const r = await adminCall<MediaList>("api_mediaUpload", payload);
      if (!r.ok) {
        if (r.error === "login") return onSessionEnd();
        problems.push(r.error);
        return;
      }
      setList(r.data);
      saved += r.data.saved || 0;
      (r.data.skipped || []).forEach((s) => problems.push(s));
    };
    try {
      for (let i = 0; i < images.length; i += 4) {
        const part = images.slice(i, i + 4);
        setBusy(t(`Lade Foto ${done + 1} bis ${done + part.length} von ${total} …`, `Uploading photo ${done + 1} to ${done + part.length} of ${total} …`));
        const encoded: unknown[] = [];
        for (const f of part) {
          try {
            encoded.push(await encodeImage(f));
          } catch (e) {
            problems.push(String((e as Error).message || e));
          }
        }
        if (encoded.length) await send(encoded);
        done += part.length;
      }
      for (const v of videos) {
        done += 1;
        if (v.size > VIDEO_MAX) {
          problems.push(`${v.name}: ${mb(v.size)} – ${t("Videos bis 25 MB. Längere Filme bitte bei YouTube hochladen.", "videos up to 25 MB. Please upload longer films to YouTube.")}`);
          continue;
        }
        setBusy(t(`Lade Video ${done} von ${total} (${mb(v.size)}) …`, `Uploading video ${done} of ${total} (${mb(v.size)}) …`));
        await send([{ name: v.name, type: v.type, data: await readBase64(v) }]);
      }
    } catch (e) {
      problems.push(String((e as Error).message || e));
    } finally {
      setBusy("");
      if (input.current) input.current.value = "";
    }
    if (saved) setNote(t(`${saved} Datei(en) gespeichert.`, `${saved} file(s) saved.`));
    if (problems.length) setErr(problems.join(" · "));
  };

  const remove = async (m: MediaItem) => {
    if (!window.confirm(t(`„${m.name}“ löschen? Die Datei bleibt 30 Tage im Papierkorb von Google Drive.`, `Delete "${m.name}"? The file stays in the Google Drive bin for 30 days.`))) return;
    setErr("");
    setNote("");
    const r = await adminCall<MediaList>("api_mediaDelete", m.id);
    if (r.ok) setList(r.data);
    else fail(r.error);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    upload(Array.from(e.dataTransfer.files || []));
  };

  const items = useMemo(() => (list?.items || []).filter((m) => kind === "all" || (kind === "image" ? isImage(m) : !isImage(m))), [list, kind]);

  if (!list) return <div className="at__card">{err ? t(`Laden fehlgeschlagen: ${err}`, `Loading failed: ${err}`) : t("Lade Mediathek …", "Loading media library …")}</div>;

  const photos = list.items.filter(isImage).length;
  return (
    <div className="at">
      <div className="at__kpis">
        <div>
          <span>{t("Fotos", "Photos")}</span>
          <strong>{photos}</strong>
        </div>
        <div>
          <span>{t("Videos", "Videos")}</span>
          <strong>{list.items.length - photos}</strong>
        </div>
      </div>

      <div
        className={`md__drop${over ? " is-over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
      >
        <Upload aria-hidden="true" />
        <p className="md__drop-t">{busy || t("Fotos und Videos hierher ziehen", "Drag photos and videos here")}</p>
        <p className="md__drop-s">{t("JPG, PNG oder WebP in jeder Größe (wird automatisch verkleinert) · MP4, WebM oder MOV bis 25 MB", "JPG, PNG or WebP of any size (shrunk automatically) · MP4, WebM or MOV up to 25 MB")}</p>
        <button type="button" className="btn-shine at__new" disabled={!!busy} onClick={() => input.current?.click()}>
          {busy ? t("Lädt hoch …", "Uploading …") : t("Dateien auswählen", "Choose files")}
        </button>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" multiple hidden onChange={(e) => upload(Array.from(e.target.files || []))} />
      </div>

      {note && <p className="md__ok" role="status">{note}</p>}
      {err && <p className="at__err" role="alert">{err}</p>}

      <div className="at__tools">
        <Segments
          value={kind}
          onChange={setKind}
          label={t("Art", "Kind")}
          items={[
            ["all", t("Alle", "All"), list.items.length],
            ["image", t("Fotos", "Photos"), photos],
            ["video", t("Videos", "Videos"), list.items.length - photos],
          ]}
        />
        {list.folderUrl && (
          <a className="at__btn" href={list.folderUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink aria-hidden="true" /> {t("Ordner in Google Drive", "Folder in Google Drive")}
          </a>
        )}
      </div>

      {items.length ? (
        <ul className="md__grid">
          {items.map((m) => (
            <li key={m.id} className="md__item">
              <a href={m.url} target="_blank" rel="noopener noreferrer" className="md__pic" title={t("In Google Drive öffnen", "Open in Google Drive")}>
                {m.thumb ? <img src={m.thumb} alt="" loading="lazy" /> : <Film aria-hidden="true" />}
              </a>
              <div className="md__meta">
                <span className="md__name" title={m.name}>{m.name}</span>
                <span className="md__sub">
                  <span>
                    {isImage(m) && m.w ? `${m.w} × ${m.h} · ` : ""}
                    {mb(m.size)}
                  </span>
                  <span>{dayDe(m.at)}</span>
                </span>
              </div>
              <button type="button" className="md__del" onClick={() => remove(m)} aria-label={t(`${m.name} löschen`, `Delete ${m.name}`)}>
                <Trash2 aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="at__empty">{t("Noch keine Dateien. Laden Sie oben die ersten Fotos hoch.", "No files yet. Upload the first photos above.")}</p>
      )}
    </div>
  );
}
