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
