"use client";

import { useEffect, useRef, useState, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/**
 * The quick view: click a card and its essentials open in a small, large-
 * type sheet on top of the page. A native modal <dialog>, so focus is
 * trapped and Escape works without extra code; a click on the dimmed
 * backdrop closes it too. Phones get it as a bottom sheet.
 */
export default function QuickView({
  open,
  onClose,
  labelledBy,
  wide = false,
  owner = true,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  wide?: boolean;
  /** the owner's contact strip under the sheet */
  owner?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  // rendered at the end of <body>: outside <main>, so the page's running-
  // text rules do not reach into the sheet and its type stays as set here
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => setHost(document.body), []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const root = document.documentElement;
    if (open && !d.open) {
      opener.current = document.activeElement as HTMLElement | null;
      d.showModal();
      root.style.overflow = "hidden";
    } else if (!open && d.open) {
      d.close();
    }
    if (!open) {
      root.style.overflow = "";
      opener.current?.focus({ preventScroll: true });
      opener.current = null;
    }
  }, [open, host]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    // the dialog box itself is only ever hit outside the card: the backdrop
    const onClick = (e: MouseEvent) => {
      if (e.target === d) onClose();
    };
    d.addEventListener("cancel", onCancel);
    d.addEventListener("click", onClick);
    return () => {
      d.removeEventListener("cancel", onCancel);
      d.removeEventListener("click", onClick);
    };
  }, [onClose, host]);

  useEffect(() => () => void (document.documentElement.style.overflow = ""), []);

  if (!host) return null;
  return createPortal(
    <dialog ref={ref} className={`qv${wide ? " qv--wide" : ""}`} aria-labelledby={labelledBy}>
      {open && (
        <div className="qv__card">
          <button type="button" className="qv__x" onClick={onClose} aria-label="Schließen">
            <X aria-hidden="true" />
          </button>
          {children}
          {owner && (
            <div className="qv__owner">
              <img src="/img/gallery/shahzad-mahmood-160.webp" width={160} height={176} alt="" loading="lazy" />
              <p>
                <strong>Shahzad Mahmood</strong>
                <span>Inhaber, berät Sie persönlich · SchimmelPeter® Partnerbetrieb</span>
              </p>
            </div>
          )}
        </div>
      )}
    </dialog>,
    host,
  );
}

/** A plain left click (no new tab, no new window) opens the quick view. */
export function isPlainClick(e: ReactMouseEvent) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}
