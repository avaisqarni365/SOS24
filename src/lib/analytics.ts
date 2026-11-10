export const GA_TRACKING_ID = "G-X723SXRK6F";

/**
 * Dispatches custom conversion events to Google Analytics 4 (GA4).
 */
export function trackConversion(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", eventName, {
      ...params,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Counts taps on phone and WhatsApp links anywhere on the site (one listener for all of them),
 * so Google Ads can see which ad clicks led to a call or chat. Sends only the link type and the page,
 * never the number. Like trackConversion, it does nothing until the visitor accepted Google Analytics.
 * Returns a function that removes the listener.
 */
export function trackContactClicks(): () => void {
  if (typeof document === "undefined") return () => {};
  const onClick = (e: MouseEvent) => {
    const target = e.target as Element | null;
    const a = target?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a) return;
    const href = a.getAttribute("href") || "";
    let eventName: string | null = null;
    if (/^tel:/i.test(href)) eventName = "phone_click";
    else if (/^(https?:\/\/)?(wa\.me|api\.whatsapp\.com|(www\.)?whatsapp\.com)\//i.test(href) || /^whatsapp:/i.test(href)) {
      eventName = "whatsapp_click";
    }
    if (eventName) trackConversion(eventName, { page_path: window.location.pathname });
  };
  document.addEventListener("click", onClick, { capture: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}
