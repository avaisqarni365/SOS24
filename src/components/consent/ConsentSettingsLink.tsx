"use client";

import { CONSENT_OPEN_EVENT } from "@/components/consent/ConsentBanner";

/** Reopens the consent question, so a yes can be withdrawn as easily as it was given. */
export default function ConsentSettingsLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      className="underline-offset-2 hover:underline"
    >
      Cookie-Einstellungen
    </button>
  );
}
