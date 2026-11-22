"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, ImagePlus, Plus, Rocket, Search, Sparkles, Trash2 } from "lucide-react";
import { adminCall } from "@/lib/adminApi";
import { CITY_PAGES, SERVICE_PAGES } from "@/data/seo-pages";
import { DataTable, Drawer, Segments, dayDe, type Column } from "@/components/admin/AdminKit";
import { isImage, type MediaItem } from "@/components/admin/AdminMedia";

type T = (de: string, en: string) => string;
type TextKey = "title" | "metaDescription" | "h1" | "lede";

interface SavedPage {
  path: string;
  title: string;
  metaDescription: string;
  h1: string;
  lede: string;
  photos: { id: string; alt: string }[];
  sections?: Section[];
  faqs?: Qa[];
  at?: string;
  by?: string;
}
interface Section {
  heading: string;
  text: string;
}
interface Qa {
  q: string;
  a: string;
}
interface Draft {
  title: string;
  metaDescription: string;
  h1: string;
  lede: string;
  photos: { id: string; alt: string }[];
  sections: Section[];
  faqs: Qa[];
}
interface PagesState {
  pages: Record<string, SavedPage>;
  version: string;
  dirty: boolean;
}
interface PageRow {
  path: string;
  kind: "city" | "service";
  name: string;
  base: Record<TextKey, string>;
  /** what the page already says, shown for orientation */
  headings: string[];
  questions: string[];
}

/** Every page the owner can edit, with the text that is built into the site. */
const ROWS: PageRow[] = [
  ...CITY_PAGES.map((c) => ({ path: `/kellersanierung/${c.slug}/`, kind: "city" as const, name: c.name, base: { title: c.title, metaDescription: c.metaDescription, h1: c.h1, lede: c.lede }, headings: c.sections.map((s) => s.heading), questions: c.faqs.map((f) => f.q) })),
  ...SERVICE_PAGES.map((s) => ({ path: `/leistungen/${s.slug}/`, kind: "service" as const, name: s.navTitle, base: { title: s.title, metaDescription: s.metaDescription, h1: s.h1, lede: s.lede }, headings: s.sections.map((x) => x.heading), questions: s.faqs.map((f) => f.q) })),
];
const LIMIT: Record<TextKey, number> = { title: 60, metaDescription: 160, h1: 120, lede: 600 };
const EMPTY: Draft = { title: "", metaDescription: "", h1: "", lede: "", photos: [], sections: [], faqs: [] };
const fresh = (): Draft => ({ ...EMPTY, photos: [], sections: [], faqs: [] });
const MAX_SECTIONS = 6;
const MAX_FAQS = 8;

/**
 * Seiten & Fotos: per town and service page the owner can replace the four texts Google and
 * visitors see first, add own sections and own questions (with an AI draft to start from) and
 * attach photos from the Mediathek. "Speichern" keeps a draft in the
 * Google Sheet; "Veröffentlichen" sends all drafts to the website, which rebuilds in a few minutes.
 */
export default function AdminPages({ t, onSessionEnd, onOpenMedia }: { t: T; onSessionEnd: () => void; onOpenMedia: () => void }) {
  const [state, setState] = useState<PagesState | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<"all" | "city" | "service" | "changed">("all");
  const [open, setOpen] = useState("");
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [aiTopic, setAiTopic] = useState({ section: "", faq: "" });
  const [aiBusy, setAiBusy] = useState<"" | "section" | "faq">("");
  const [aiWarn, setAiWarn] = useState("");
  const [aiReady, setAiReady] = useState<boolean | null>(null);
  const [formErr, setFormErr] = useState("");
  const [busy, setBusy] = useState<"" | "save" | "publish">("");
  const [picking, setPicking] = useState(false);

  const fail = useCallback((e: string) => (e === "login" ? onSessionEnd() : setErr(e)), [onSessionEnd]);
  useEffect(() => {
    adminCall<PagesState>("api_pages").then((r) => (r.ok ? setState(r.data) : fail(r.error)));
    adminCall<{ items: MediaItem[] }>("api_mediaList").then((r) => (r.ok ? setMedia(r.data.items) : fail(r.error)));
    adminCall<{ ai: boolean }>("api_posts").then((r) => r.ok && setAiReady(!!r.data.ai));
  }, [fail]);

  const byId = useMemo(() => Object.fromEntries(media.map((m) => [m.id, m])), [media]);
  const row = ROWS.find((r) => r.path === open);

  const openPage = (r: PageRow) => {
    const s = state?.pages[r.path];
    setDraft(s ? { title: s.title, metaDescription: s.metaDescription, h1: s.h1, lede: s.lede, photos: s.photos.map((p) => ({ ...p })), sections: (s.sections || []).map((x) => ({ ...x })), faqs: (s.faqs || []).map((x) => ({ ...x })) } : fresh());
    setAiTopic({ section: "", faq: "" });
    setAiWarn("");
    setFormErr("");
    setPicking(false);
    setOpen(r.path);
  };

  const save = async () => {
    if (!row) return;
    setBusy("save");
    setFormErr("");
    const r = await adminCall<PagesState>("api_pageSave", row.path, draft);
    setBusy("");
    if (!r.ok) return r.error === "login" ? onSessionEnd() : setFormErr(r.error);
    setState(r.data);
    setNote(t(`„${row.name}“ gespeichert. Noch nicht auf der Website – dafür oben „Veröffentlichen“ drücken.`, `"${row.name}" saved. Not on the website yet – press "Publish" above.`));
    setOpen("");
  };

  /** The AI writes one section or one question as a draft; it lands in the form, nothing is saved. */
  const aiDraft = async (kind: "section" | "faq") => {
    if (!row) return;
    setAiBusy(kind);
    setFormErr("");
    const r = await adminCall<{ heading?: string; text?: string; q?: string; a?: string; warnings: string[] }>("api_aiPage", { path: row.path, kind, topic: aiTopic[kind], name: row.name });
    setAiBusy("");
    if (!r.ok) return r.error === "login" ? onSessionEnd() : setFormErr(r.error);
    if (kind === "section") setDraft((d) => ({ ...d, sections: [...d.sections, { heading: r.data.heading || "", text: r.data.text || "" }] }));
    else setDraft((d) => ({ ...d, faqs: [...d.faqs, { q: r.data.q || "", a: r.data.a || "" }] }));
    setAiTopic((x) => ({ ...x, [kind]: "" }));
    if (r.data.warnings.length) setAiWarn((w) => [w, r.data.warnings.join(", ")].filter(Boolean).join(", "));
  };

  const publish = async () => {
    if (!window.confirm(t("Alle gespeicherten Änderungen jetzt auf sos-abdichtung.de veröffentlichen?", "Publish all saved changes to sos-abdichtung.de now?"))) return;
    setBusy("publish");
    setErr("");
    setNote("");
    const r = await adminCall<{ version: string; pages: number; photos: number }>("api_pagesPublish");
    setBusy("");
    if (!r.ok) return fail(r.error);
    setState((s) => (s ? { ...s, dirty: false, version: r.data.version } : s));
    setNote(
      t(
        `Veröffentlicht (${r.data.pages} Seiten, ${r.data.photos} neue Fotos). Die Website wird jetzt neu gebaut; nach etwa 5 Minuten ist die Änderung sichtbar.`,
        `Published (${r.data.pages} pages, ${r.data.photos} new photos). The website is rebuilding now; the change is visible after about 5 minutes.`,
      ),
    );
  };

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ROWS.filter((r) => (kind === "all" || (kind === "changed" ? !!state?.pages[r.path] : r.kind === kind)) && (!needle || (r.name + " " + r.path).toLowerCase().includes(needle)));
  }, [q, kind, state]);

  if (!state) return <div className="at__card">{err ? t(`Laden fehlgeschlagen: ${err}`, `Loading failed: ${err}`) : t("Lade Seiten …", "Loading pages …")}</div>;

  const changed = Object.keys(state.pages).length;
  const columns: Column<PageRow>[] = [
    { key: "name", label: t("Seite", "Page"), sort: (r) => r.name.toLowerCase(), cell: (r) => <span className="at__strong">{r.name}</span> },
    { key: "kind", label: t("Art", "Kind"), sort: (r) => r.kind, cell: (r) => (r.kind === "city" ? t("Stadtseite", "Town page") : t("Leistung", "Service")) },
    { key: "path", label: t("Adresse", "Address"), sort: (r) => r.path, cell: (r) => r.path },
    { key: "own", label: t("Eigene Abschnitte / Fragen", "Own sections / questions"), sort: (r) => (state.pages[r.path]?.sections?.length || 0) + (state.pages[r.path]?.faqs?.length || 0), className: "at__num", cell: (r) => { const p = state.pages[r.path]; const n = (p?.sections?.length || 0) + (p?.faqs?.length || 0); return n ? `${p?.sections?.length || 0} / ${p?.faqs?.length || 0}` : "—"; } },
    { key: "photos", label: t("Fotos", "Photos"), sort: (r) => state.pages[r.path]?.photos.length || 0, className: "at__num", cell: (r) => state.pages[r.path]?.photos.length || "—" },
    { key: "state", label: t("Stand", "State"), sort: (r) => (state.pages[r.path] ? 1 : 0), cell: (r) => (state.pages[r.path] ? `${t("Eigene Inhalte", "Own content")} · ${dayDe(state.pages[r.path].at || "")}` : t("Standard", "Default")) },
  ];
  const images = media.filter(isImage).filter((m) => !draft.photos.some((p) => p.id === m.id));
  const textField = (key: TextKey, label: string, hint: string, rowsN = 2) => {
    const len = draft[key].length;
    return (
      <label>
        {label}
        <textarea rows={rowsN} value={draft[key]} maxLength={LIMIT[key]} placeholder={row?.base[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} />
        <span className="pg__hint">
          {hint} · {len ? `${len} / ${LIMIT[key]}` : t("leer = Standardtext (grau)", "empty = default text (grey)")}
        </span>
      </label>
    );
  };

  const aiBox = (kind: "section" | "faq", full: boolean, placeholder: string) => (
    <div className="pg__ai">
      <label>
        {t("Stichwort für die KI", "Keyword for the AI")}
        <input type="text" maxLength={160} value={aiTopic[kind]} placeholder={placeholder} onChange={(e) => setAiTopic({ ...aiTopic, [kind]: e.target.value })} />
      </label>
      <button type="button" className="at__btn" disabled={full || !aiReady || !!aiBusy || aiTopic[kind].trim().length < 3} onClick={() => aiDraft(kind)}>
        <Sparkles aria-hidden="true" /> {aiBusy === kind ? t("KI schreibt …", "AI is writing …") : t("KI-Entwurf hinzufügen", "Add AI draft")}
      </button>
    </div>
  );

  return (
    <div className="at">
      <ol className="pg__how" aria-label={t("So bearbeiten Sie eine Seite", "How to edit a page")}>
        <li>{t("Seite in der Liste anklicken.", "Click a page in the list.")}</li>
        <li>{t("Texte ändern, eigene Abschnitte, Fragen und Fotos hinzufügen.", "Change texts, add your own sections, questions and photos.")}</li>
        <li>{t("„Speichern“ drücken (noch nicht öffentlich).", "Press “Save” (not public yet).")}</li>
        <li>{t("Oben „Veröffentlichen“ drücken: nach etwa 5 Minuten steht es auf der Website.", "Press “Publish” at the top: after about 5 minutes it is on the website.")}</li>
      </ol>
      <div className={`pg__bar${state.dirty ? " is-dirty" : ""}`}>
        <div>
          <strong>{state.dirty ? t("Es gibt gespeicherte Änderungen, die noch nicht auf der Website sind.", "There are saved changes that are not on the website yet.") : t("Die Website ist auf dem Stand Ihrer Eingaben.", "The website matches your entries.")}</strong>
          <span>{state.version ? t(`Zuletzt veröffentlicht: Version ${state.version}`, `Last published: version ${state.version}`) : t("Noch nie veröffentlicht.", "Never published yet.")}</span>
        </div>
        <button type="button" className="btn-shine at__new" disabled={!state.dirty || !!busy} onClick={publish}>
          <Rocket aria-hidden="true" /> {busy === "publish" ? t("Veröffentliche …", "Publishing …") : t("Veröffentlichen", "Publish")}
        </button>
      </div>

      {note && <p className="md__ok" role="status">{note}</p>}
      {err && <p className="at__err" role="alert">{err}</p>}

      <div className="at__tools">
        <label className="at__search">
          <Search aria-hidden="true" />
          <span className="visually-hidden">{t("Seite suchen", "Search page")}</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Stadt oder Leistung …", "Town or service …")} />
        </label>
        <Segments
          value={kind}
          onChange={setKind}
          label={t("Filter", "Filter")}
          items={[
            ["all", t("Alle", "All"), ROWS.length],
            ["city", t("Städte", "Towns"), CITY_PAGES.length],
            ["service", t("Leistungen", "Services"), SERVICE_PAGES.length],
            ["changed", t("Eigene Inhalte", "Own content"), changed],
          ]}
        />
      </div>

      <DataTable rows={rows} columns={columns} rowKey={(r) => r.path} onOpen={openPage} activeKey={open} t={t} empty={t("Keine Seite gefunden.", "No page found.")} initialSort={{ key: "name", dir: 1 }} />

      <Drawer open={!!row} onClose={() => setOpen("")} t={t} wide title={row ? row.name : ""} sub={row ? `sos-abdichtung.de${row.path}` : ""}>
        {row && (
          <div className="ed pg__form">
            <div className="dw__acts">
              <a className="at__btn" href={row.path} target="_blank" rel="noopener noreferrer">
                <ExternalLink aria-hidden="true" /> {t("Seite ansehen", "View page")}
              </a>
            </div>

            <fieldset className="ed__box" disabled={!!busy}>
              <legend>{t("Texte", "Texts")}</legend>
            {textField("title", t("Titel in Google", "Title in Google"), t("die blaue Zeile im Suchergebnis", "the blue line in the search result"), 1)}
            {textField("metaDescription", t("Beschreibung in Google", "Description in Google"), t("der Text unter dem Titel, am besten 70 bis 160 Zeichen", "the text under the title, ideally 70 to 160 characters"))}
            {textField("h1", t("Überschrift der Seite", "Page headline"), t("die große Überschrift ganz oben", "the large headline at the top"))}
            {textField("lede", t("Einleitung", "Intro"), t("der erste Absatz unter der Überschrift", "the first paragraph under the headline"), 5)}
            </fieldset>

            <fieldset className="ed__box" disabled={!!busy}>
              <legend>{t(`Eigene Abschnitte (${draft.sections.length} von ${MAX_SECTIONS})`, `Own sections (${draft.sections.length} of ${MAX_SECTIONS})`)}</legend>
              <p className="pg__hint">
                {t(
                  "Ein Abschnitt ist eine Zwischenüberschrift mit Text. Er erscheint unter den vorhandenen Abschnitten der Seite. Eine Leerzeile beginnt einen neuen Absatz.",
                  "A section is a subheading with text. It appears below the page's existing sections. A blank line starts a new paragraph.",
                )}
              </p>
              {row.headings.length > 0 && (
                <details className="pg__have">
                  <summary>{t(`Schon auf der Seite: ${row.headings.length} Abschnitte`, `Already on the page: ${row.headings.length} sections`)}</summary>
                  <ul>
                    {row.headings.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </details>
              )}
              {draft.sections.map((s, i) => {
                const set = (patch: Partial<Section>) => setDraft({ ...draft, sections: draft.sections.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
                const move = (d: number) => {
                  const list = draft.sections.slice();
                  const [x] = list.splice(i, 1);
                  list.splice(i + d, 0, x);
                  setDraft({ ...draft, sections: list });
                };
                return (
                  <div key={i} className="pg__block">
                    <label>
                      {t(`Überschrift von Abschnitt ${i + 1}`, `Heading of section ${i + 1}`)}
                      <input type="text" maxLength={120} value={s.heading} onChange={(e) => set({ heading: e.target.value })} placeholder={t("z. B. Hangwasser in Velbert-Mitte: nur eine Wand ist nass", "e.g. Slope water in Velbert-Mitte: only one wall is wet")} />
                    </label>
                    <label>
                      {t("Text", "Text")}
                      <textarea rows={7} maxLength={2000} value={s.text} onChange={(e) => set({ text: e.target.value })} />
                      <span className="pg__hint">{s.text.length} / 2000</span>
                    </label>
                    <span className="pg__photo-acts">
                      <button type="button" disabled={i === 0} onClick={() => move(-1)} aria-label={t("Abschnitt nach oben", "Move section up")}>
                        <ArrowUp aria-hidden="true" />
                      </button>
                      <button type="button" disabled={i === draft.sections.length - 1} onClick={() => move(1)} aria-label={t("Abschnitt nach unten", "Move section down")}>
                        <ArrowDown aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => setDraft({ ...draft, sections: draft.sections.filter((_, j) => j !== i) })} aria-label={t(`Abschnitt ${i + 1} löschen`, `Delete section ${i + 1}`)}>
                        <Trash2 aria-hidden="true" />
                      </button>
                    </span>
                  </div>
                );
              })}
              <div className="dw__acts">
                <button type="button" className="at__btn" disabled={draft.sections.length >= MAX_SECTIONS} onClick={() => setDraft({ ...draft, sections: [...draft.sections, { heading: "", text: "" }] })}>
                  <Plus aria-hidden="true" /> {t("Leeren Abschnitt hinzufügen", "Add empty section")}
                </button>
              </div>
              {aiBox("section", draft.sections.length >= MAX_SECTIONS, t("z. B. Fachwerkhäuser in Langenberg, Feuchte im Bruchstein", "e.g. half-timbered houses in Langenberg, damp in rubble stone"))}
            </fieldset>

            <fieldset className="ed__box" disabled={!!busy}>
              <legend>{t(`Eigene Fragen und Antworten (${draft.faqs.length} von ${MAX_FAQS})`, `Own questions and answers (${draft.faqs.length} of ${MAX_FAQS})`)}</legend>
              <p className="pg__hint">
                {t(
                  "Fragen, die Kunden Ihnen wirklich stellen. Sie erscheinen bei den häufigen Fragen der Seite; Google kann sie im Suchergebnis zeigen.",
                  "Questions customers really ask you. They appear in the page's frequent questions; Google can show them in the search result.",
                )}
              </p>
              {row.questions.length > 0 && (
                <details className="pg__have">
                  <summary>{t(`Schon auf der Seite: ${row.questions.length} Fragen`, `Already on the page: ${row.questions.length} questions`)}</summary>
                  <ul>
                    {row.questions.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </details>
              )}
              {draft.faqs.map((f, i) => {
                const set = (patch: Partial<Qa>) => setDraft({ ...draft, faqs: draft.faqs.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
                return (
                  <div key={i} className="pg__block">
                    <label>
                      {t(`Frage ${i + 1}`, `Question ${i + 1}`)}
                      <input type="text" maxLength={160} value={f.q} onChange={(e) => set({ q: e.target.value })} placeholder={t("z. B. Sanieren Sie auch Keller in Neviges?", "e.g. Do you also renovate cellars in Neviges?")} />
                    </label>
                    <label>
                      {t("Antwort", "Answer")}
                      <textarea rows={4} maxLength={800} value={f.a} onChange={(e) => set({ a: e.target.value })} />
                      <span className="pg__hint">{f.a.length} / 800</span>
                    </label>
                    <span className="pg__photo-acts">
                      <button type="button" onClick={() => setDraft({ ...draft, faqs: draft.faqs.filter((_, j) => j !== i) })} aria-label={t(`Frage ${i + 1} löschen`, `Delete question ${i + 1}`)}>
                        <Trash2 aria-hidden="true" />
                      </button>
                    </span>
                  </div>
                );
              })}
              <div className="dw__acts">
                <button type="button" className="at__btn" disabled={draft.faqs.length >= MAX_FAQS} onClick={() => setDraft({ ...draft, faqs: [...draft.faqs, { q: "", a: "" }] })}>
                  <Plus aria-hidden="true" /> {t("Leere Frage hinzufügen", "Add empty question")}
                </button>
              </div>
              {aiBox("faq", draft.faqs.length >= MAX_FAQS, t("z. B. Dauer der Arbeiten, Garantie, Aufgraben nötig?", "e.g. duration of the work, guarantee, digging needed?"))}
            </fieldset>

            {aiReady === false && <p className="pg__hint">{t("Die KI ist noch nicht eingerichtet (GEMINI_API_KEY fehlt im Backoffice). Abschnitte und Fragen können Sie trotzdem selbst schreiben.", "The AI is not set up yet (GEMINI_API_KEY is missing in the back office). You can still write sections and questions yourself.")}</p>}
            {aiWarn && <p className="sc__warn" role="status">{t("Bitte den KI-Entwurf prüfen: Er", "Please check the AI draft: it")} {aiWarn}.</p>}

            <fieldset className="ed__box" disabled={!!busy}>
              <legend>{t(`Fotos auf dieser Seite (${draft.photos.length} von 12)`, `Photos on this page (${draft.photos.length} of 12)`)}</legend>
            <p className="pg__hint">{t("Nur eigene, echte Fotos von Ihren Baustellen. Zu jedem Foto kurz beschreiben, was zu sehen ist: Google und Vorleseprogramme lesen diesen Text.", "Only your own real photos from your jobs. Describe briefly what each photo shows: Google and screen readers read this text.")}</p>
            {draft.photos.length > 0 && (
              <ul className="pg__photos">
                {draft.photos.map((p, i) => {
                  const m = byId[p.id];
                  const move = (d: number) => {
                    const list = draft.photos.slice();
                    const [x] = list.splice(i, 1);
                    list.splice(i + d, 0, x);
                    setDraft({ ...draft, photos: list });
                  };
                  return (
                    <li key={p.id}>
                      {m?.thumb ? <img src={m.thumb} alt="" /> : <span className="ph__none">{m?.name || p.id}</span>}
                      <label>
                        <span className="visually-hidden">{t(`Beschreibung von Foto ${i + 1}`, `Description of photo ${i + 1}`)}</span>
                        <input
                          type="text"
                          maxLength={140}
                          value={p.alt}
                          placeholder={t("z. B. Abgedichtete Kellerwand in Rüttenscheid", "e.g. Sealed cellar wall in Rüttenscheid")}
                          onChange={(e) => setDraft({ ...draft, photos: draft.photos.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)) })}
                        />
                      </label>
                      <span className="pg__photo-acts">
                        <button type="button" disabled={i === 0} onClick={() => move(-1)} aria-label={t("nach oben", "move up")}>
                          <ArrowUp aria-hidden="true" />
                        </button>
                        <button type="button" disabled={i === draft.photos.length - 1} onClick={() => move(1)} aria-label={t("nach unten", "move down")}>
                          <ArrowDown aria-hidden="true" />
                        </button>
                        <button type="button" onClick={() => setDraft({ ...draft, photos: draft.photos.filter((_, j) => j !== i) })} aria-label={t("Foto von der Seite nehmen", "Remove photo from page")}>
                          <Trash2 aria-hidden="true" />
                        </button>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="dw__acts">
              <button type="button" className="at__btn" disabled={draft.photos.length >= 12} onClick={() => setPicking(!picking)}>
                <ImagePlus aria-hidden="true" /> {picking ? t("Auswahl schließen", "Close picker") : t("Foto aus der Mediathek wählen", "Choose photo from library")}
              </button>
              <button type="button" className="at__btn" onClick={onOpenMedia}>
                {t("Neue Fotos hochladen (Mediathek)", "Upload new photos (library)")}
              </button>
            </div>
            {picking &&
              (images.length ? (
                <ul className="ph__grid pg__pick">
                  {images.map((m) => (
                    <li key={m.id}>
                      <button
                        type="button"
                        title={m.name}
                        onClick={() => {
                          if (draft.photos.length >= 12) return;
                          setDraft({ ...draft, photos: [...draft.photos, { id: m.id, alt: "" }] });
                        }}
                      >
                        {m.thumb ? <img src={m.thumb} alt={m.name} loading="lazy" /> : <span className="ph__none">{m.name}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="at__empty">{t("Keine weiteren Fotos in der Mediathek. Laden Sie dort zuerst Fotos hoch.", "No more photos in the library. Upload photos there first.")}</p>
              ))}
            </fieldset>

            {formErr && <p className="at__err" role="alert">{formErr}</p>}
            <div className="dw__acts">
              <button type="button" className="btn-shine at__new" disabled={!!busy} onClick={save}>
                {busy === "save" ? t("Speichert …", "Saving …") : t("Speichern", "Save")}
              </button>
              <button type="button" className="at__btn" disabled={!!busy} onClick={() => setDraft(fresh())}>
                {t("Alles auf Standard zurücksetzen", "Reset everything to default")}
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
