"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Copy, ExternalLink, Film, ImagePlus, Plus, Sparkles, Trash2 } from "lucide-react";
import { adminCall } from "@/lib/adminApi";
import { DataTable, Drawer, Segments, dayDe, type Column } from "@/components/admin/AdminKit";
import type { MediaItem } from "@/components/admin/AdminMedia";

type T = (de: string, en: string) => string;
type Platform = "facebook" | "instagram" | "tiktok" | "youtube" | "gbp";

interface Post {
  id: string;
  date: string;
  status: string;
  topic: string;
  text: string;
  platforms: Partial<Record<Platform, string>>;
  media: string[];
  link: string;
  done: Partial<Record<Platform, boolean>>;
  at?: string;
}
interface PostsState {
  posts: Post[];
  limits: Record<Platform, number>;
  ai: boolean;
  id?: string;
}

/** Where the owner publishes each platform's post by hand. */
const PLATFORMS: { key: Platform; label: string; open: string; hint: [string, string] }[] = [
  { key: "facebook", label: "Facebook", open: "https://business.facebook.com/latest/composer", hint: ["Meta Business Suite: Beitrag erstellen", "Meta Business Suite: create post"] },
  { key: "instagram", label: "Instagram", open: "https://www.instagram.com/", hint: ["Instagram: Plus-Symbol, Beitrag", "Instagram: plus icon, post"] },
  { key: "tiktok", label: "TikTok", open: "https://www.tiktok.com/upload", hint: ["TikTok: Video hochladen", "TikTok: upload video"] },
  { key: "youtube", label: "YouTube", open: "https://studio.youtube.com/", hint: ["YouTube Studio: Erstellen, Video hochladen", "YouTube Studio: create, upload video"] },
  { key: "gbp", label: "Google-Unternehmensprofil", open: "https://business.google.com/", hint: ["Unternehmensprofil: Beitrag hinzufügen", "Business Profile: add update"] },
];
const EMPTY: Post = { id: "", date: "", status: "Entwurf", topic: "", text: "", platforms: {}, media: [], link: "", done: {} };

/**
 * Beiträge: write a post once, let the AI adapt it per platform, attach photos or a video from
 * the Mediathek and plan a date. The owner publishes on each platform (copy the text, open the
 * platform, tick it off); the admin itself never posts anywhere.
 */
export default function AdminSocial({ t, onSessionEnd, onOpenMedia }: { t: T; onSessionEnd: () => void; onOpenMedia: () => void }) {
  const [state, setState] = useState<PostsState | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState<"open" | "done" | "all">("open");
  const [draft, setDraft] = useState<Post | null>(null);
  const [formErr, setFormErr] = useState("");
  const [warn, setWarn] = useState<Partial<Record<Platform, string[]>>>({});
  const [busy, setBusy] = useState<"" | "save" | "ai" | "delete">("");
  const [copied, setCopied] = useState("");
  const [picking, setPicking] = useState(false);

  const fail = useCallback((e: string) => (e === "login" ? onSessionEnd() : setErr(e)), [onSessionEnd]);
  useEffect(() => {
    adminCall<PostsState>("api_posts").then((r) => (r.ok ? setState(r.data) : fail(r.error)));
    adminCall<{ items: MediaItem[] }>("api_mediaList").then((r) => (r.ok ? setMedia(r.data.items) : fail(r.error)));
  }, [fail]);

  const byId = useMemo(() => Object.fromEntries(media.map((m) => [m.id, m])), [media]);
  const open = (p: Post) => {
    setDraft({ ...p, platforms: { ...p.platforms }, done: { ...p.done }, media: p.media.slice() });
    setFormErr("");
    setWarn({});
    setPicking(false);
  };

  const save = async (next?: Post) => {
    const p = next || draft;
    if (!p) return;
    setBusy("save");
    setFormErr("");
    const r = await adminCall<PostsState>("api_postSave", p);
    setBusy("");
    if (!r.ok) return r.error === "login" ? onSessionEnd() : setFormErr(r.error);
    setState(r.data);
    if (next) {
      const saved = r.data.posts.find((x) => x.id === r.data.id);
      if (saved) setDraft({ ...saved, platforms: { ...saved.platforms }, done: { ...saved.done }, media: saved.media.slice() });
    } else setDraft(null);
  };

  const writeWithAi = async () => {
    if (!draft) return;
    const has = Object.values(draft.platforms).some((v) => (v || "").trim());
    if (has && !window.confirm(t("Es gibt schon Texte für einzelne Plattformen. Sollen sie durch neue KI-Entwürfe ersetzt werden?", "Some platforms already have a text. Replace them with new AI drafts?"))) return;
    setBusy("ai");
    setFormErr("");
    const r = await adminCall<{ platforms: Partial<Record<Platform, string>>; warnings: Partial<Record<Platform, string[]>> }>("api_aiSocial", { topic: draft.topic, text: draft.text, link: draft.link });
    setBusy("");
    if (!r.ok) return r.error === "login" ? onSessionEnd() : setFormErr(r.error);
    setDraft({ ...draft, platforms: { ...draft.platforms, ...r.data.platforms } });
    setWarn(r.data.warnings || {});
  };

  const remove = async () => {
    if (!draft?.id || !window.confirm(t(`Beitrag „${draft.topic}“ löschen?`, `Delete post "${draft.topic}"?`))) return;
    setBusy("delete");
    const r = await adminCall<PostsState>("api_postDelete", draft.id);
    setBusy("");
    if (!r.ok) return r.error === "login" ? onSessionEnd() : setFormErr(r.error);
    setState(r.data);
    setDraft(null);
  };

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? "" : c)), 2500);
    } catch {
      setFormErr(t("Kopieren hat nicht geklappt. Bitte den Text markieren und mit Strg+C kopieren.", "Copying failed. Please select the text and press Ctrl+C."));
    }
  };

  const rows = useMemo(() => (state?.posts || []).filter((p) => filter === "all" || (filter === "done" ? p.status === "Veröffentlicht" : p.status !== "Veröffentlicht")), [state, filter]);

  if (!state) return <div className="at__card">{err ? t(`Laden fehlgeschlagen: ${err}`, `Loading failed: ${err}`) : t("Lade Beiträge …", "Loading posts …")}</div>;

  const doneCount = state.posts.filter((p) => p.status === "Veröffentlicht").length;
  const progress = (p: Post) => {
    const keys = Object.keys(p.platforms) as Platform[];
    return keys.length ? `${keys.filter((k) => p.done[k]).length} / ${keys.length}` : "—";
  };
  const columns: Column<Post>[] = [
    { key: "date", label: t("Geplant für", "Planned for"), sort: (p) => p.date || "9999", cell: (p) => (p.date ? dayDe(p.date, true) : t("ohne Datum", "no date")) },
    { key: "topic", label: t("Thema", "Topic"), sort: (p) => p.topic.toLowerCase(), cell: (p) => <span className="at__strong">{p.topic}</span> },
    { key: "status", label: t("Stand", "State"), sort: (p) => p.status, cell: (p) => p.status },
    { key: "done", label: t("Veröffentlicht auf", "Published on"), sort: (p) => Object.keys(p.done).length, className: "at__num", cell: progress },
  ];

  return (
    <div className="at">
      <p className="sc__lead">{t("Einmal schreiben, für jede Plattform anpassen, Datum planen. Veröffentlichen tun Sie selbst: Text kopieren, Plattform öffnen, einfügen, abhaken.", "Write once, adapt per platform, plan a date. You publish yourself: copy the text, open the platform, paste, tick it off.")}</p>
      <div className="at__tools">
        <Segments
          value={filter}
          onChange={setFilter}
          label={t("Filter", "Filter")}
          items={[
            ["open", t("Offen", "Open"), state.posts.length - doneCount],
            ["done", t("Veröffentlicht", "Published"), doneCount],
            ["all", t("Alle", "All"), state.posts.length],
          ]}
        />
        <button type="button" className="btn-shine at__new" onClick={() => open(EMPTY)}>
          <Plus aria-hidden="true" /> {t("Neuer Beitrag", "New post")}
        </button>
      </div>
      {err && <p className="at__err" role="alert">{err}</p>}

      <DataTable rows={rows} columns={columns} rowKey={(p) => p.id} onOpen={open} activeKey={draft?.id || ""} t={t} empty={t("Noch keine Beiträge. Mit „Neuer Beitrag“ beginnen.", "No posts yet. Start with \"New post\".")} initialSort={{ key: "date", dir: 1 }} />

      <Drawer open={!!draft} onClose={() => setDraft(null)} t={t} wide title={draft?.id ? `${t("Beitrag", "Post")} ${draft.id}` : t("Neuer Beitrag", "New post")} sub={draft?.status || ""}>
        {draft && (
          <div className="ed pg__form">
            <fieldset className="ed__box" disabled={!!busy}>
              <legend>{t("1. Worum geht es?", "1. What is it about?")}</legend>
              <label>
                {t("Thema *", "Topic *")}
                <input value={draft.topic} maxLength={120} onChange={(e) => setDraft({ ...draft, topic: e.target.value })} placeholder={t("z. B. Feuchter Keller nach dem Regen in Essen", "e.g. Damp cellar after rain in Essen")} />
              </label>
              <label>
                {t("Stichworte oder Ihr eigener Text", "Notes or your own text")}
                <textarea rows={4} value={draft.text} maxLength={3000} onChange={(e) => setDraft({ ...draft, text: e.target.value })} placeholder={t("Was soll gesagt werden? Ein paar Stichworte genügen.", "What should it say? A few notes are enough.")} />
              </label>
              <div className="ed__row">
                <label>
                  {t("Geplant für", "Planned for")}
                  <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
                </label>
                <label className="ed__grow">
                  {t("Link zur passenden Seite", "Link to the matching page")}
                  <input type="url" value={draft.link} onChange={(e) => setDraft({ ...draft, link: e.target.value })} placeholder="https://sos-abdichtung.de/kellersanierung/essen/" />
                </label>
              </div>
              <div className="dw__acts">
                <button type="button" className="btn-shine at__new" disabled={!state.ai || !!busy} onClick={writeWithAi}>
                  <Sparkles aria-hidden="true" /> {busy === "ai" ? t("KI schreibt …", "AI is writing …") : t("Mit KI für alle Plattformen schreiben", "Write for all platforms with AI")}
                </button>
              </div>
              {!state.ai && <span className="pg__hint">{t("Die KI ist noch nicht eingerichtet (Gemini-Schlüssel fehlt). Die Texte unten können Sie auch selbst schreiben.", "The AI is not set up yet (Gemini key missing). You can also write the texts below yourself.")}</span>}
            </fieldset>

            <fieldset className="ed__box" disabled={!!busy}>
              <legend>{t("2. Fotos oder Video", "2. Photos or video")}</legend>
              {draft.media.length > 0 && (
                <ul className="pg__photos">
                  {draft.media.map((id) => {
                    const m = byId[id];
                    return (
                      <li key={id}>
                        {m?.thumb ? <img src={m.thumb} alt="" /> : <span className="ph__none">{m ? <Film aria-hidden="true" /> : id}</span>}
                        <span className="sc__file">{m?.name || id}</span>
                        <span className="pg__photo-acts">
                          {m && (
                            <a href={m.url} target="_blank" rel="noopener noreferrer" className="sc__icon" title={t("In Google Drive öffnen, um die Datei herunterzuladen", "Open in Google Drive to download the file")}>
                              <ExternalLink aria-hidden="true" />
                              <span className="visually-hidden">{t(`${m.name} in Google Drive öffnen`, `Open ${m.name} in Google Drive`)}</span>
                            </a>
                          )}
                          <button type="button" onClick={() => setDraft({ ...draft, media: draft.media.filter((x) => x !== id) })} aria-label={t("Datei vom Beitrag nehmen", "Remove file from post")}>
                            <Trash2 aria-hidden="true" />
                          </button>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="dw__acts">
                <button type="button" className="at__btn" disabled={draft.media.length >= 10} onClick={() => setPicking(!picking)}>
                  <ImagePlus aria-hidden="true" /> {picking ? t("Auswahl schließen", "Close picker") : t("Aus der Mediathek wählen", "Choose from library")}
                </button>
                <button type="button" className="at__btn" onClick={onOpenMedia}>
                  {t("Neue Dateien hochladen (Mediathek)", "Upload new files (library)")}
                </button>
              </div>
              {picking &&
                (media.filter((m) => !draft.media.includes(m.id)).length ? (
                  <ul className="ph__grid pg__pick">
                    {media
                      .filter((m) => !draft.media.includes(m.id))
                      .map((m) => (
                        <li key={m.id}>
                          <button type="button" title={m.name} onClick={() => draft.media.length < 10 && setDraft({ ...draft, media: [...draft.media, m.id] })}>
                            {m.thumb ? <img src={m.thumb} alt={m.name} loading="lazy" /> : <span className="ph__none">{m.name}</span>}
                          </button>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="at__empty">{t("Keine weiteren Dateien in der Mediathek.", "No more files in the library.")}</p>
                ))}
              <span className="pg__hint">{t("Zum Veröffentlichen die Datei in Google Drive öffnen und herunterladen; die Plattformen nehmen keine Links zu Drive.", "To publish, open the file in Google Drive and download it; the platforms don't accept Drive links.")}</span>
            </fieldset>

            <fieldset className="ed__box" disabled={!!busy}>
              <legend>{t("3. Text je Plattform", "3. Text per platform")}</legend>
              {PLATFORMS.map((pf) => {
                const text = draft.platforms[pf.key] || "";
                const limit = state.limits[pf.key] || 2200;
                return (
                  <div key={pf.key} className={`sc__pf${draft.done[pf.key] ? " is-done" : ""}`}>
                    <label>
                      {pf.label}
                      <textarea rows={text ? 6 : 2} value={text} maxLength={limit} onChange={(e) => setDraft({ ...draft, platforms: { ...draft.platforms, [pf.key]: e.target.value } })} placeholder={t("leer = nicht auf dieser Plattform", "empty = not on this platform")} />
                    </label>
                    {warn[pf.key]?.length ? <p className="sc__warn" role="status">{t("Bitte prüfen: Der Entwurf", "Please check: the draft")} {warn[pf.key]!.join(", ")}.</p> : null}
                    <div className="sc__pf-acts">
                      <span className="pg__hint">{text ? `${text.length} / ${limit}` : ""}</span>
                      <button type="button" className="at__btn" disabled={!text} onClick={() => copy(pf.key, text)}>
                        {copied === pf.key ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />} {copied === pf.key ? t("Kopiert", "Copied") : t("Text kopieren", "Copy text")}
                      </button>
                      <a className="at__btn" href={pf.open} target="_blank" rel="noopener noreferrer" title={t(pf.hint[0], pf.hint[1])}>
                        <ExternalLink aria-hidden="true" /> {t("Plattform öffnen", "Open platform")}
                      </a>
                      <label className="sc__tick">
                        <input type="checkbox" checked={!!draft.done[pf.key]} disabled={!text} onChange={(e) => setDraft({ ...draft, done: { ...draft.done, [pf.key]: e.target.checked } })} />
                        {t("veröffentlicht", "published")}
                      </label>
                    </div>
                  </div>
                );
              })}
            </fieldset>

            {formErr && <p className="at__err" role="alert">{formErr}</p>}
            <div className="dw__acts">
              <button type="button" className="btn-shine at__new" disabled={!!busy} onClick={() => save()}>
                {busy === "save" ? t("Speichert …", "Saving …") : t("Speichern und schließen", "Save and close")}
              </button>
              <button type="button" className="at__btn" disabled={!!busy} onClick={() => save(draft)}>
                {t("Zwischenspeichern", "Save and keep open")}
              </button>
              {draft.id && (
                <button type="button" className="at__btn" disabled={!!busy} onClick={remove}>
                  <Trash2 aria-hidden="true" /> {t("Beitrag löschen", "Delete post")}
                </button>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
