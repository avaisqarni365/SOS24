"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { GAS_API_URL } from "@/lib/backend";

/* Counts page views without cookies, without browser storage and without any visitor ID.
 * Sent per page view: the path, a coarse source ("Google", "Facebook", "Direkt" …), the device class and
 * the language. The backend only adds 1 to a daily counter for that combination (hit_ in Website.js),
 * so there is nothing that could be traced back to a person. See /datenschutz/ section 6. */

let entered = false; // first page view since this page load; lives in memory only

function source(): string {
  const q = new URLSearchParams(window.location.search);
  if (q.has("gclid") || q.has("gbraid") || q.has("wbraid")) return "Google-Anzeige";
  let host = "";
  try {
    host = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : "";
  } catch {
    host = "";
  }
  if (!host || host === window.location.hostname.replace(/^www\./, "")) return "Direkt";
  if (/(^|\.)google\./.test(host)) return "Google";
  if (/(^|\.)bing\.com$/.test(host)) return "Bing";
  if (/(^|\.)duckduckgo\.com$/.test(host)) return "DuckDuckGo";
  if (/facebook\.com$|fb\.com$|fb\.me$/.test(host)) return "Facebook";
  if (/instagram\.com$/.test(host)) return "Instagram";
  if (/tiktok\.com$/.test(host)) return "TikTok";
  if (/youtube\.com$|youtu\.be$/.test(host)) return "YouTube";
  if (/whatsapp\.com$|wa\.me$/.test(host)) return "WhatsApp";
  return host.slice(0, 40);
}

export default function VisitBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (!/^https:\/\/script\.google\.com\//.test(GAS_API_URL)) return;
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") return;
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (nav.webdriver || /bot|crawl|spider|lighthouse|headless/i.test(nav.userAgent)) return;
    if (nav.doNotTrack === "1" || nav.globalPrivacyControl) return;
    const first = !entered;
    entered = true;
    const w = window.innerWidth;
    const body = JSON.stringify({
      action: "hit",
      p: pathname.slice(0, 80),
      s: first ? source() : "Intern",
      d: w < 700 ? "Handy" : w < 1100 ? "Tablet" : "Computer",
      l: document.documentElement.lang === "en" ? "en" : "de",
      e: first,
    });
    const t = window.setTimeout(() => {
      fetch(GAS_API_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body, keepalive: true }).catch(() => {});
    }, 1500);
    return () => window.clearTimeout(t);
  }, [pathname]);
  return null;
}
