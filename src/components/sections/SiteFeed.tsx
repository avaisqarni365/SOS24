"use client";

import { useEffect, useState } from "react";
import { Star, ExternalLink } from "lucide-react";
import { GAS_API_URL } from "@/lib/backend";
import type { SiteContent, SocialKey } from "@/lib/adminApi";
import { FACEBOOK_URL, INSTAGRAM_URL, TIKTOK_URL, YOUTUBE_URL } from "@/lib/social";

/**
 * What the owner publishes in the admin ("Website & Kanäle"): channel links, news and
 * customer reviews, read once per page view from the website API (cached there for five
 * minutes). Nothing shows until there is content, so an empty sheet leaves no gap.
 */
let once: Promise<SiteContent | null> | null = null;
function useSiteContent() {
  const [data, setData] = useState<SiteContent | null>(null);
  useEffect(() => {
    once ??= fetch(`${GAS_API_URL}?action=content`)
      .then((r) => r.json())
      .then((r) => (r && r.ok ? (r as SiteContent) : null))
      .catch(() => null);
    let alive = true;
    once.then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, []);
  return data;
}

const SOCIAL: Record<SocialKey, { label: string; path: string }> = {
  instagram: { label: "Instagram", path: "M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2ZM17 5.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2ZM12 3c-2.4 0-2.7 0-3.7.1-3.3.2-5 1.9-5.2 5.2C3 9.3 3 9.6 3 12s0 2.7.1 3.7c.2 3.3 1.9 5 5.2 5.2 1 .1 1.3.1 3.7.1s2.7 0 3.7-.1c3.3-.2 5-1.9 5.2-5.2.1-1 .1-1.3.1-3.7s0-2.7-.1-3.7c-.2-3.3-1.9-5-5.2-5.2C14.7 3 14.4 3 12 3Z" },
  facebook: { label: "Facebook", path: "M13.4 21v-7.7h2.6l.4-3h-3V8.4c0-.9.3-1.5 1.5-1.5h1.6V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.6V21h3.1Z" },
  youtube: { label: "YouTube", path: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" },
  tiktok: { label: "TikTok", path: "M16.6 3h-3v12.2a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.6a5.6 5.6 0 1 0 4.8 5.6V9.1a7 7 0 0 0 4 1.3v-3a4 4 0 0 1-4-4.4Z" },
  linkedin: { label: "LinkedIn", path: "M6.9 8.8H3.7V20h3.2V8.8ZM5.3 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM20.3 13.6c0-3-.7-5.1-4.1-5.1-1.7 0-2.8.9-3.2 1.8V8.8H9.9V20h3.2v-5.5c0-1.5.3-2.9 2.1-2.9 1.8 0 1.8 1.7 1.8 3V20h3.3v-6.4Z" },
  google_reviews: { label: "Google-Bewertungen", path: "M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8L12 3.5Z" },
  whatsapp_channel: { label: "WhatsApp-Kanal", path: "M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Zm4.4 12.4c-.2.5-1.1 1-1.6 1.1-.4.1-1 .1-1.6-.1a14 14 0 0 1-5.6-4.9c-.4-.6-.9-1.5-.9-2.4s.5-1.4.7-1.6c.2-.2.4-.3.6-.3h.4c.1 0 .3 0 .5.4l.7 1.6c.1.1.1.3 0 .4l-.3.5-.4.4c-.1.1-.3.3-.1.6.1.3.6 1.1 1.4 1.8 1 .8 1.8 1.1 2 1.2.3.1.4.1.6-.1l.8-1c.2-.2.3-.2.6-.1l1.6.8c.2.1.4.2.4.3.1.1.1.6-.2 1.2Z" },
};

/** The channels as icons, in the footer of every page. */
/** The channels that exist today, so the icons are in the page from the first paint
    (and for crawlers); a link set in the admin replaces its default. */
const DEFAULT_SOCIAL: Partial<Record<SocialKey, string>> = {
  instagram: INSTAGRAM_URL,
  facebook: FACEBOOK_URL,
  youtube: YOUTUBE_URL,
  tiktok: TIKTOK_URL,
};

/**
 * The channels in their brand colours. `icons`: round buttons (footer);
 * `labels`: buttons with the channel name ("Folgen Sie uns"); `mini`: small
 * icons for the header strip and the phone menu.
 */
export function SocialLinks({ variant = "icons", className = "" }: { variant?: "icons" | "labels" | "mini"; className?: string }) {
  const data = useSiteContent();
  const links = { ...DEFAULT_SOCIAL };
  for (const [k, v] of Object.entries(data?.social ?? {})) if (v) links[k as SocialKey] = v;
  const keys = (Object.keys(SOCIAL) as SocialKey[]).filter((k) => links[k]);
  if (!keys.length) return null;
  return (
    <ul className={`social social--${variant} ${className}`} aria-label="SOS-Abdichtung in sozialen Netzwerken">
      {keys.map((k) => (
        <li key={k}>
          <a href={links[k]} target="_blank" rel="noopener noreferrer" data-net={k} aria-label={SOCIAL[k].label} title={SOCIAL[k].label}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={SOCIAL[k].path} />
            </svg>
            {variant === "labels" ? <span>{SOCIAL[k].label}</span> : null}
          </a>
        </li>
      ))}
    </ul>
  );
}

const day = (iso: string) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso.split("-").reverse().join(".") : iso);

/** The newest news and reviews on the home page. */
export default function SiteFeed() {
  const data = useSiteContent();
  if (!data || (!data.news?.length && !data.reviews?.length)) return null;
  return (
    <section id="aktuelles" className="sc-section feed" aria-labelledby="feed-title">
      <div className="sc-wrap">
        <p className="sc-label">Aktuelles &amp; Kundenstimmen</p>
        <h2 id="feed-title" className="sc-display mt-3">
          Diese Woche bei uns <em>im Einsatz.</em>
        </h2>
        <div className="feed__grid">
          {data.news.map((n, i) => (
            <article key={"n" + i} className="feed__card">
              <p className="feed__date">{day(n.date)}</p>
              <h3 className="feed__t">{n.title}</h3>
              {n.text && <p className="feed__x">{n.text}</p>}
              {n.link && (
                <a href={n.link} target="_blank" rel="noopener noreferrer" className="feed__more">
                  Foto / Video ansehen <ExternalLink aria-hidden="true" />
                </a>
              )}
            </article>
          ))}
          {data.reviews.map((r, i) => (
            <figure key={"r" + i} className="feed__card feed__card--review">
              <p className="feed__stars" aria-label={`${r.stars} von 5 Sternen`}>
                {Array.from({ length: r.stars }, (_, j) => (
                  <Star key={j} aria-hidden="true" />
                ))}
              </p>
              <blockquote className="feed__x">„{r.text}“</blockquote>
              <figcaption className="feed__who">
                {r.name}
                {r.place ? `, ${r.place}` : ""}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
