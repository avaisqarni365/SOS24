"use client";

import { useCallback, useState } from "react";
import { Home, Layers, ShieldCheck, SprayCan, Gauge, Wrench, Umbrella, Sun, PanelBottom, ArrowRight, Phone, MessageCircle, type LucideIcon } from "lucide-react";
import QuickView, { isPlainClick } from "@/components/ui/QuickView";
import { COMPANY_INFO } from "@/data/content-data";
import type { ServiceCard } from "@/data/services";

export interface ServiceGridItem {
  slug: string;
  title: string;
  text: string;
  art: ServiceCard["art"];
  facts: { value: string; label: string }[];
  material?: string;
}

const CARD_ICON: Record<ServiceCard["art"], LucideIcon> = {
  keller: Home,
  sperre: Layers,
  innen: ShieldCheck,
  schimmel: SprayCan,
  messung: Gauge,
  riss: Wrench,
  dach: Umbrella,
  balkon: Sun,
  sockel: PanelBottom,
};

/**
 * The service cards. Each is still a real link to its page (new tab,
 * crawlers, no script), but a plain click opens the quick view first: the
 * essentials in large type, then the page, a call or WhatsApp.
 */
export default function ServiceGrid({ items }: { items: ServiceGridItem[] }) {
  const [active, setActive] = useState<(ServiceGridItem & { n: number }) | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <>
      <ul className="services-grid mt-14">
        {items.map((s, i) => {
          const Icon = CARD_ICON[s.art];
          return (
            <li key={s.slug}>
              <a
                className="service-card"
                href={`/leistungen/${s.slug}/`}
                aria-haspopup="dialog"
                onClick={(e) => {
                  if (!isPlainClick(e)) return;
                  e.preventDefault();
                  setActive({ ...s, n: i + 1 });
                }}
              >
                <span className="service-card__top">
                  <span className="service-card__icon" aria-hidden="true">
                    <Icon strokeWidth={1.5} />
                  </span>
                  <span className="service-card__n">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <h3 className="service-card__h">{s.title}</h3>
                <p>{s.text}</p>
                <span className="service-card__more">
                  <span>Kurz erklärt</span>
                  <span aria-hidden="true">→</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <QuickView open={!!active} onClose={close} labelledBy="svc-qv-title">
        {active && (
          <div className="qv-svc">
            <div className="qv-svc__head">
              <span className="qv-svc__icon" aria-hidden="true">
                {(() => {
                  const Icon = CARD_ICON[active.art];
                  return <Icon strokeWidth={1.6} />;
                })()}
              </span>
              <div>
                <p className="qv__k">Leistung {String(active.n).padStart(2, "0")}</p>
                <h2 id="svc-qv-title" className="qv__t">
                  {active.title}
                </h2>
              </div>
            </div>
            <p className="qv__lead">{active.text}</p>
            {active.facts.length > 0 && (
              <dl className="qv-facts">
                {active.facts.slice(0, 4).map((f) => (
                  <div key={f.label}>
                    <dt>{f.value}</dt>
                    <dd>{f.label}</dd>
                  </div>
                ))}
              </dl>
            )}
            {active.material && <p className="qv__p">{active.material}</p>}
            <div className="qv__actions">
              <a href={`/leistungen/${active.slug}/`} className="qv__btn qv__btn--solid">
                Alles zur Leistung
                <ArrowRight aria-hidden="true" />
              </a>
              <a href={`tel:${COMPANY_INFO.phoneTel}`} className="qv__btn">
                <Phone aria-hidden="true" />
                Anrufen
              </a>
              <a href={COMPANY_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="qv__btn">
                <MessageCircle aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </QuickView>
    </>
  );
}
