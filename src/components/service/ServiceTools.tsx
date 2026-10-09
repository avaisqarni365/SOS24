import { ArrowRight, ClipboardCheck, SplitSquareHorizontal, PhoneCall, RotateCcw, MessageCircle } from "lucide-react";
import { ScenarioArt, scenarioSteps } from "@/components/science/Scenarios";
import { CHECK_QUESTIONS, GUIDE, formHrefFor } from "@/data/guide";
import { SERVICE_CARDS } from "@/data/services";
import { COMPANY_INFO } from "@/data/content-data";
import { hy } from "@/lib/hyphenate";

const titleOf = (slug: string) => SERVICE_CARDS.find((s) => s.slug === slug)?.title ?? slug;

/**
 * "Ihr Keller, interaktiv": three tools on every service page, as Web
 * Components (src/components/wc/elements.ts) over server-rendered markup.
 * The Schnell-Check leads from what you see to the likely service, the
 * comparison shows this service's drawing before and after, the callback
 * planner writes the WhatsApp request.
 */
export default function ServiceTools({ slug, navTitle }: { slug: string; navTitle: string }) {
  const steps = scenarioSteps(slug);
  const phone = COMPANY_INFO.phoneTel.replace(/\D/g, "");
  const uid = `t-${slug}`;
  return (
    <section id="check" className="sc-section svc-tools" aria-labelledby="check-title">
      <div className="sc-wrap">
        <p className="sc-label">Interaktiv</p>
        <h2 id="check-title" className="sc-display mt-3">
          Ihr Keller, <em>auf einen Klick.</em>
        </h2>
        <div className="svc-tools__grid">
          {/* 1. Schnell-Check */}
          <sos-check className="tool tool--check">
            <div className="tool__head">
              <span className="tool__i" aria-hidden="true">
                <ClipboardCheck />
              </span>
              <div>
                <p className="tool__k">Schnell-Check</p>
                <p className="tool__t">Was hat Ihr Keller?</p>
              </div>
              <span className="tool__count" data-count aria-hidden="true">
                1 / {CHECK_QUESTIONS.length}
              </span>
            </div>
            <div className="chk__bar" data-progress aria-hidden="true" />
            {CHECK_QUESTIONS.map((q, i) => (
              <fieldset key={q.q} className="chk__q" data-q={i}>
                <legend className="chk__legend">{q.q}</legend>
                <div className="chk__answers">
                  {q.answers.map((a, j) => (
                    <label key={a.a} className="chk__a">
                      <input type="radio" name={`${uid}-q${i}`} value={j} data-score={JSON.stringify(a.score)} />
                      <span>{a.a}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            {GUIDE.map((g) => (
              <div key={g.slug} className="chk__result" data-result={g.slug} hidden>
                <p className="tool__k">Unsere Einschätzung</p>
                <p className="chk__res-t" data-result-title tabIndex={-1}>
                  {titleOf(g.slug)}
                </p>
                <p className="chk__res-d">
                  Häufige Ursache: <strong>{g.cause}</strong>. {hy("Ein Wegweiser, keine Diagnose: Sicherheit gibt die kostenlose Feuchtemessung vor Ort.")}
                </p>
                <div className="chk__res-cta">
                  <a href={formHrefFor(g.slug)} className="tool__btn tool__btn--solid">
                    Kostenlose Messung <ArrowRight aria-hidden="true" />
                  </a>
                  {g.slug !== slug ? (
                    <a href={`/leistungen/${g.slug}/`} className="tool__btn">
                      Zur Leistung
                    </a>
                  ) : null}
                  <button type="button" className="tool__btn tool__btn--ghost" data-restart>
                    <RotateCcw aria-hidden="true" /> Neu
                  </button>
                </div>
              </div>
            ))}
            <noscript>
              <p className="chk__res-d">
                <a href="/leistungen/#wegweiser">Zum Wegweiser: welches Verfahren passt zu welchem Anzeichen?</a>
              </p>
            </noscript>
          </sos-check>

          <div className="svc-tools__side">
            {/* 2. Vorher / Nachher */}
            {steps ? (
              <sos-compare className="tool tool--compare">
                <div className="tool__head">
                  <span className="tool__i" aria-hidden="true">
                    <SplitSquareHorizontal />
                  </span>
                  <div>
                    <p className="tool__k">Vorher / Nachher</p>
                    <p className="tool__t">{navTitle} im Vergleich</p>
                  </div>
                </div>
                <div className="cmp__stage" data-stage>
                  <ScenarioArt slug={slug} state="after" />
                  <div className="cmp__before" aria-hidden="true">
                    <ScenarioArt slug={slug} state="before" />
                  </div>
                  <span className="cmp__tag cmp__tag--before" aria-hidden="true">
                    Vorher
                  </span>
                  <span className="cmp__tag cmp__tag--after" aria-hidden="true">
                    Nachher
                  </span>
                  <span className="cmp__handle" aria-hidden="true" />
                </div>
                <input type="range" className="cmp__range" min={0} max={100} defaultValue={50} aria-label="Vorher und Nachher vergleichen" />
                <div className="cmp__caps">
                  <p>
                    <strong>Vorher:</strong> {steps[0]}
                  </p>
                  <p>
                    <strong>Nachher:</strong> {steps[2]}
                  </p>
                </div>
              </sos-compare>
            ) : null}

            {/* 3. Rückruf planen */}
            <sos-callback className="tool tool--callback" data-phone={phone} data-topic={navTitle}>
              <div className="tool__head">
                <span className="tool__i" aria-hidden="true">
                  <PhoneCall />
                </span>
                <div>
                  <p className="tool__k">Rückruf planen</p>
                  <p className="tool__t">Wann dürfen wir anrufen?</p>
                </div>
              </div>
              <fieldset className="cb__group">
                <legend className="cb__legend">Tag</legend>
                {["Heute", "Morgen", "Übermorgen"].map((d, i) => (
                  <label key={d} className="cb__opt">
                    <input type="radio" name={`${uid}-day`} value={i} />
                    <span>
                      <span data-day-name>{d}</span>
                      <small data-day-date={i} />
                    </span>
                  </label>
                ))}
              </fieldset>
              <fieldset className="cb__group">
                <legend className="cb__legend">Zeit</legend>
                {[
                  ["vormittags", "8 bis 12 Uhr"],
                  ["mittags", "12 bis 14 Uhr"],
                  ["nachmittags", "14 bis 18 Uhr"],
                ].map(([v, t]) => (
                  <label key={v} className="cb__opt">
                    <input type="radio" name={`${uid}-slot`} value={`${v} (${t})`} />
                    <span>
                      {v[0].toUpperCase() + v.slice(1)}
                      <small>{t}</small>
                    </span>
                  </label>
                ))}
              </fieldset>
              <a className="tool__btn tool__btn--solid cb__send" data-send aria-disabled="true" target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden="true" /> Rückruf per WhatsApp anfragen
              </a>
              <p className="cb__note">Öffnet WhatsApp mit der fertigen Nachricht. Gespeichert wird nichts.</p>
            </sos-callback>
          </div>
        </div>
      </div>
    </section>
  );
}
