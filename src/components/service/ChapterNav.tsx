"use client";

import { useEffect, useState } from "react";

/**
 * The chapter bar under the header: every chapter of a long page one tap
 * away, the current one marked as you scroll.
 */
export default function ChapterNav({ items, label = "Kapitel" }: { items: { id: string; label: string }[]; label?: string }) {
  const [current, setCurrent] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setCurrent(hit.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  // keep the current chip in view on narrow screens
  useEffect(() => {
    const a = document.querySelector<HTMLElement>(`.chapnav__a[href="#${current}"]`);
    const list = a?.closest<HTMLElement>(".chapnav__list");
    if (a && list) list.scrollTo({ left: a.offsetLeft - list.clientWidth / 2 + a.offsetWidth / 2, behavior: "smooth" });
  }, [current]);

  return (
    <nav className="chapnav" aria-label={label}>
      <ol className="chapnav__list sc-wrap">
        {items.map((i, n) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className="chapnav__a" aria-current={current === i.id ? "location" : undefined}>
              <span aria-hidden="true">{String(n + 1).padStart(2, "0")}</span>
              {i.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
