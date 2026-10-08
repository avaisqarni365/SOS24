import { MessageCircle, Mail, Star, Quote } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";
import { REVIEWS } from "@/data/reviews";
import { SERVICE_CARDS } from "@/data/services";

const ASK = "Hallo Herr Mahmood, hier meine Bewertung für SOS-Abdichtung (Sie dürfen sie mit Vornamen und Ort veröffentlichen): ";

/**
 * Kundenstimmen: real reviews only (src/data/reviews.ts). While there are
 * none yet, the section asks customers for one instead of showing filler.
 */
export default function Feedback() {
  const wa = `https://wa.me/${COMPANY_INFO.phoneTel.replace(/\D/g, "")}?text=${encodeURIComponent(ASK)}`;
  const mail = `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent("Meine Bewertung")}&body=${encodeURIComponent(ASK)}`;
  return (
    <section id="feedback" className="sc-section feedback" aria-labelledby="feedback-title">
      <div className="sc-wrap">
        <p className="sc-label">Feedback</p>
        <h2 id="feedback-title" className="sc-display mt-3">
          Kundenstimmen, <em>echt und mit Namen.</em>
        </h2>

        {REVIEWS.length > 0 && (
          <ul className="feedback__list">
            {REVIEWS.map((r) => {
              const service = SERVICE_CARDS.find((s) => s.slug === r.service)?.title;
              return (
                <li key={r.name + r.date} className="feedback__card">
                  <Quote className="feedback__q" aria-hidden="true" />
                  {r.stars ? (
                    <p className="feedback__stars" aria-label={`${r.stars} von 5 Sternen`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} aria-hidden="true" className={i < r.stars! ? "is-on" : ""} />
                      ))}
                    </p>
                  ) : null}
                  <blockquote className="feedback__text">{r.text}</blockquote>
                  <p className="feedback__who">
                    <strong>{r.name}</strong>
                    {r.place} · {r.date}
                    {service ? ` · ${service}` : ""}
                  </p>
                </li>
              );
            })}
          </ul>
        )}

        <div className="feedback__ask">
          <div>
            <p className="feedback__ask-t">Waren Sie zufrieden? Erzählen Sie es weiter.</p>
            <p className="feedback__ask-d">
              Schreiben Sie uns ein paar Sätze zu Ihrer Sanierung. Mit Ihrem Einverständnis veröffentlichen wir sie hier,
              mit Vornamen, Ort und Monat. Wir ändern nichts am Text.
            </p>
          </div>
          <div className="feedback__ask-cta">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="qv__btn qv__btn--solid">
              <MessageCircle aria-hidden="true" />
              Bewertung per WhatsApp
            </a>
            <a href={mail} className="qv__btn">
              <Mail aria-hidden="true" />
              Per E-Mail
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
