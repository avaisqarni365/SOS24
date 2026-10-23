"use client";

import { COMPANY_INFO } from "@/data/content-data";

/** Shown when a form could not reach the office: what happened, and the two ways that always work. */
export default function SendError({ error, what = "Ihre Anfrage", plural = false, title }: { error?: string; what?: string; plural?: boolean; title?: string }) {
  if (!error) return null;
  const why =
    error === "limit"
      ? "Von dieser Telefonnummer oder E-Mail-Adresse kamen gerade sehr viele Anfragen."
      : error === "slot"
        ? "Dieser Termin ist inzwischen vergeben."
        : error === "token" || error === "not_found"
          ? "Der Link ist nicht mehr gültig."
          : "Die Verbindung zu unserem Büro hat nicht geklappt.";
  return (
    <div role="alert" className="rounded-xl border border-red-700 bg-white p-4 text-sm leading-relaxed text-ink">
      <p className="font-bold text-red-700">{title || `${what} ${plural ? "wurden" : "wurde"} nicht gesendet.`}</p>
      <p className="mt-1">
        {why} Bitte rufen Sie uns an unter{" "}
        <a href={`tel:${COMPANY_INFO.phoneTel}`} className="font-bold underline underline-offset-2">
          {COMPANY_INFO.phoneDisplay}
        </a>{" "}
        oder schreiben Sie uns per{" "}
        <a href={COMPANY_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2">
          WhatsApp
        </a>
        .
      </p>
    </div>
  );
}
