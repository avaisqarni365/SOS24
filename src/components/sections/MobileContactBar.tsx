import { Phone, MessageCircle, CalendarCheck } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

/** Phones only: the three ways to reach us, always one thumb away. */
export default function MobileContactBar() {
  return (
    <nav aria-label="Schnellkontakt" className="mobile-contact sm:hidden">
      <a href={`tel:${COMPANY_INFO.phoneTel}`}>
        <Phone aria-hidden="true" />
        Anrufen
      </a>
      <a href={COMPANY_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle aria-hidden="true" />
        WhatsApp
      </a>
      <a href="/kontakt/" className="is-primary">
        <CalendarCheck aria-hidden="true" />
        Messung anfragen
      </a>
    </nav>
  );
}
