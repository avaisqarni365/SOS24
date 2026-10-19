/**
 * Calendar & Appointment Helper for SOS Abdichtung
 * Generates direct Google Calendar web links, downloadable .ics files,
 * and standard trade inspection time slots.
 */

export interface InspectionSlot {
  id: string;
  label: string;
  timeRange: string;
  startTime: string; // HH:mm
  durationMinutes: number;
  icon: string;
}

export const INSPECTION_SLOTS: InspectionSlot[] = [
  {
    id: "morning",
    label: "Vormittags",
    timeRange: "08:00 – 11:00 Uhr",
    startTime: "08:00",
    durationMinutes: 180,
    icon: "🌅",
  },
  {
    id: "midday",
    label: "Mittags",
    timeRange: "11:00 – 14:00 Uhr",
    startTime: "11:00",
    durationMinutes: 180,
    icon: "☀️",
  },
  {
    id: "afternoon",
    label: "Nachmittags",
    timeRange: "14:00 – 17:00 Uhr",
    startTime: "14:00",
    durationMinutes: 180,
    icon: "🌇",
  },
  {
    id: "evening",
    label: "Feierabend-Termin",
    timeRange: "17:00 – 19:00 Uhr",
    startTime: "17:00",
    durationMinutes: 120,
    icon: "🌙",
  },
];

/**
 * Builds a direct 1-click Google Calendar Event Creation URL
 */
export function buildGoogleCalendarUrl({
  title,
  description,
  location,
  startDate, // YYYY-MM-DD
  startTime = "10:00",
  durationMinutes = 60,
}: {
  title: string;
  description: string;
  location: string;
  startDate: string;
  startTime?: string;
  durationMinutes?: number;
}): string {
  const cleanDate = (startDate || new Date().toISOString().slice(0, 10)).replace(/-/g, "");
  const [hStr, mStr] = (startTime || "10:00").split(":");
  const h = Number(hStr) || 10;
  const m = Number(mStr) || 0;

  const startHour = String(h).padStart(2, "0");
  const startMin = String(m).padStart(2, "0");

  const totalEndMinutes = h * 60 + m + durationMinutes;
  const endHourNum = Math.min(23, Math.floor(totalEndMinutes / 60));
  const endMinNum = totalEndMinutes % 60;

  const endHour = String(endHourNum).padStart(2, "0");
  const endMin = String(endMinNum).padStart(2, "0");

  const dates = `${cleanDate}T${startHour}${startMin}00/${cleanDate}T${endHour}${endMin}00`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: description,
    location: location,
    dates: dates,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Downloads an .ics calendar file for Apple Calendar (iPhone/Mac) or Microsoft Outlook
 */
export function downloadIcsFile({
  title,
  description,
  location,
  startDate,
  startTime = "10:00",
  durationMinutes = 60,
}: {
  title: string;
  description: string;
  location: string;
  startDate: string;
  startTime?: string;
  durationMinutes?: number;
}) {
  if (typeof window === "undefined") return;

  const cleanDate = (startDate || new Date().toISOString().slice(0, 10)).replace(/-/g, "");
  const [hStr, mStr] = (startTime || "10:00").split(":");
  const h = Number(hStr) || 10;
  const m = Number(mStr) || 0;

  const startHour = String(h).padStart(2, "0");
  const startMin = String(m).padStart(2, "0");

  const totalEndMinutes = h * 60 + m + durationMinutes;
  const endHourNum = Math.min(23, Math.floor(totalEndMinutes / 60));
  const endMinNum = totalEndMinutes % 60;

  const endHour = String(endHourNum).padStart(2, "0");
  const endMin = String(endMinNum).padStart(2, "0");

  const dtStart = `${cleanDate}T${startHour}${startMin}00`;
  const dtEnd = `${cleanDate}T${endHour}${endMin}00`;

  const sanitizedDesc = description.replace(/\n/g, "\\n").replace(/,/g, "\\,");
  const sanitizedTitle = title.replace(/\n/g, " ").replace(/,/g, "\\,");
  const sanitizedLoc = location.replace(/\n/g, " ").replace(/,/g, "\\,");

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SOS Abdichtung//Terminplaner//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@sos-abdichtung.de`,
    `DTSTAMP:${cleanDate}T000000Z`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${sanitizedTitle}`,
    `DESCRIPTION:${sanitizedDesc}`,
    `LOCATION:${sanitizedLoc}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Erinnerung Vor-Ort-Termin SOS Abdichtung",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([icsLines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `SOS-Termin-${cleanDate}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
