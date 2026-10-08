import type { ReactNode } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";

/**
 * A long chapter folded into one card: what is inside, in a line, and a tap
 * to open it. The content stays in the page (crawlers, find-in-page); the
 * chapter bar opens it (FoldSync). Keeps the service pages short, like the
 * landing page.
 */
export default function ChapterFold({
  id,
  kicker,
  title,
  teaser,
  Icon,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  teaser: string;
  Icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div id={id} className="svc-chapter svc-fold-wrap">
      <div className="sc-wrap">
        <details className="svc-fold" data-fold>
          <summary className="svc-fold__sum">
            <span className="svc-fold__i" aria-hidden="true">
              <Icon />
            </span>
            <span className="svc-fold__txt">
              <span className="svc-fold__k">{kicker}</span>
              <span className="svc-fold__t">{title}</span>
              <span className="svc-fold__d">{teaser}</span>
            </span>
            <span className="svc-fold__go">
              <span className="svc-fold__open">Öffnen</span>
              <span className="svc-fold__close">Schließen</span>
              <ChevronDown aria-hidden="true" />
            </span>
          </summary>
        </details>
      </div>
      <div className="svc-fold__body" data-fold-body>
        {children}
      </div>
    </div>
  );
}
