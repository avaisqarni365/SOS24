"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface LabTab {
  id: string;
  label: string;
  icon: ReactNode;
  panel: ReactNode;
}

/**
 * One service at a time in the Lab: a tab bar of the nine methods and one
 * panel below. All panels are in the page (search engines read every one);
 * only the chosen one is shown. Arrow keys move between tabs, and a link to
 * /labor/#verfahren-<slug> or the older #chemie-<slug> opens that tab.
 */
export default function LabTabs({ tabs }: { tabs: LabTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const open = useCallback((id: string, focus = false) => {
    setActive(id);
    if (focus) refs.current[id]?.focus();
    // visuals that measure themselves on resize lay out again once shown
    requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
  }, []);

  useEffect(() => {
    const fromHash = () => {
      const m = /^#(?:verfahren|chemie)-(.+)$/.exec(location.hash);
      if (m && tabs.some((t) => t.id === m[1])) {
        open(m[1]);
        document.getElementById("verfahren")?.scrollIntoView();
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [tabs, open]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = tabs.findIndex((t) => t.id === active);
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next < 0) return;
    e.preventDefault();
    open(tabs[next].id, true);
  };

  return (
    <div className="labtabs">
      <div className="labtabs__list" role="tablist" aria-label="Verfahren" onKeyDown={onKey}>
        {tabs.map((t, n) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[t.id] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-controls={`panel-${t.id}`}
            aria-selected={active === t.id}
            tabIndex={active === t.id ? 0 : -1}
            className="labtabs__tab"
            onClick={() => open(t.id)}
          >
            <span className="labtabs__n" aria-hidden="true">
              {String(n + 1).padStart(2, "0")}
            </span>
            <span className="labtabs__i" aria-hidden="true">
              {t.icon}
            </span>
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={active !== t.id}
          className="labtabs__panel"
          tabIndex={0}
        >
          {t.panel}
        </div>
      ))}
    </div>
  );
}
