"use client";

import { useCallback, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import KitArt from "@/components/brand/KitArt";
import QuickView from "@/components/ui/QuickView";
import { Formula } from "@/components/science/Formula";
import { COMPANY_INFO } from "@/data/content-data";
import type { KitItem } from "@/data/kit";

/** The instrument and material cards; a click opens the quick view. */
export default function KitGrid({ items }: { items: KitItem[] }) {
  const [active, setActive] = useState<KitItem | null>(null);
  const close = useCallback(() => setActive(null), []);
  const groups: KitItem["kind"][] = ["Messtechnik", "Material"];

  return (
    <>
      {groups.map((kind) => (
        <div key={kind} className="kit-group">
          <p className="kit-group__k">{kind === "Messtechnik" ? "Messtechnik & Werkzeug" : "Material im Einsatz"}</p>
          <ul className="kit-grid">
            {items
              .filter((it) => it.kind === kind)
              .map((it) => (
                <li key={it.id}>
                  <button type="button" className="kit-card" onClick={() => setActive(it)} aria-haspopup="dialog">
                    <span className="kit-card__art">
                      <KitArt art={it.art} />
                    </span>
                    <span className="kit-card__name">{it.name}</span>
                    <span className="kit-card__short">{it.short}</span>
                    <span className="kit-card__more">
                      {it.services[0].title}
                      <ArrowRight aria-hidden="true" />
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}

      <QuickView open={!!active} onClose={close} labelledBy="kit-qv-title" wide>
        {active && (
          <div className="qv-kit">
            <div className="qv-kit__art">
              <KitArt art={active.art} />
            </div>
            <div className="qv-kit__body">
              <p className="qv__k">{active.kind}</p>
              <h2 id="kit-qv-title" className="qv__t">
                {active.name}
              </h2>
              <p className="qv__lead">{active.what}</p>
              <p className="qv__p">{active.how}</p>
              {active.equation && (
                <p className="qv__eq">
                  <Formula source={active.equation} />
                </p>
              )}
              <p className="qv__k qv__k--sub">Eingesetzt bei</p>
              <ul className="qv__chips">
                {active.services.map((s) => (
                  <li key={s.slug}>
                    <a href={`/leistungen/${s.slug}/`}>{s.title}</a>
                  </li>
                ))}
              </ul>
              <div className="qv__actions">
                <a href="/#kontakt" className="qv__btn qv__btn--solid" onClick={close}>
                  Messung anfragen
                  <ArrowRight aria-hidden="true" />
                </a>
                <a href={`tel:${COMPANY_INFO.phoneTel}`} className="qv__btn">
                  <Phone aria-hidden="true" />
                  {COMPANY_INFO.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        )}
      </QuickView>
    </>
  );
}
