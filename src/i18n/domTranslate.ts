/**
 * Page translation for the non-German languages.
 *
 * The site is written in German, in the markup and in the data files. A
 * visitor who picks another language gets the same page with every text
 * swapped from a dictionary (/i18n/<lang>.json, German sentence -> target
 * sentence) built from all strings the site shows. The German original of
 * every node is remembered, so switching back or to a third language never
 * translates a translation. A MutationObserver covers what appears later:
 * menus, quick views, the calculator, the assistant.
 */
import { I18N_VERSION } from "./version";

export type Dict = Record<string, string>;

const SKIP = "script,style,noscript,svg:not([data-i18n]),code,pre,.rx__eq,.qv__eq,.labpanel__rx-eq,[data-no-translate]";
const ATTRS = ["alt", "aria-label", "title", "placeholder"] as const;

/** Must match the extraction (scripts/i18n): soft hyphens out, spaces folded. */
export const norm = (s: string) => s.replace(/­/g, "").replace(/[\s ]+/g, " ").trim();

const srcText = new WeakMap<Text, string>();
const setText = new WeakMap<Text, string>();
const srcAttr = new WeakMap<Element, Map<string, string>>();
const setAttr = new WeakMap<Element, Map<string, string>>();

let dict: Dict | null = null;
let observer: MutationObserver | null = null;
let srcTitle: string | null = null;

const cache = new Map<string, Dict>();

export async function loadDict(lang: string): Promise<Dict> {
  const hit = cache.get(lang);
  if (hit) return hit;
  const res = await fetch(`/i18n/${lang}.json?v=${I18N_VERSION}`);
  if (!res.ok) throw new Error(`i18n ${lang}: ${res.status}`);
  const d = (await res.json()) as Dict;
  cache.set(lang, d);
  return d;
}

function render(src: string): string {
  if (!dict) return src;
  const key = norm(src);
  const tr = key && dict[key];
  if (!tr) return src;
  const lead = src.match(/^\s*/)?.[0] ?? "";
  const trail = src.match(/\s*$/)?.[0] ?? "";
  return lead + tr + trail;
}

function doText(n: Text) {
  const p = n.parentElement;
  if (!p || p.closest(SKIP)) return;
  const cur = n.nodeValue ?? "";
  // a value we did not write is new German source (React re-rendered it)
  if (!srcText.has(n) || setText.get(n) !== cur) srcText.set(n, cur);
  const out = render(srcText.get(n)!);
  if (out !== cur) n.nodeValue = out;
  setText.set(n, out);
}

function doAttr(el: Element, name: string) {
  if (el.closest(SKIP)) return;
  const cur = el.getAttribute(name);
  if (cur == null) return;
  let src = srcAttr.get(el);
  let set = setAttr.get(el);
  if (!src) srcAttr.set(el, (src = new Map()));
  if (!set) setAttr.set(el, (set = new Map()));
  if (!src.has(name) || set.get(name) !== cur) src.set(name, cur);
  const out = render(src.get(name)!);
  if (out !== cur) el.setAttribute(name, out);
  set.set(name, out);
}

function walk(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) return doText(root as Text);
  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
  const el = root as Element;
  const doc = el.ownerDocument ?? (root as Document);
  const w = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n: Node | null;
  while ((n = w.nextNode())) doText(n as Text);
  const sel = ATTRS.map((a) => `[${a}]`).join(",");
  if (el.matches?.(sel)) ATTRS.forEach((a) => el.hasAttribute(a) && doAttr(el, a));
  el.querySelectorAll?.(sel).forEach((e) => ATTRS.forEach((a) => e.hasAttribute(a) && doAttr(e, a)));
}

function translateTitle() {
  if (srcTitle === null) srcTitle = document.title;
  document.title = render(srcTitle);
}

/** Apply a dictionary to the whole page (null = back to German). */
export function applyDict(next: Dict | null) {
  dict = next;
  walk(document.body);
  translateTitle();
  if (!dict) {
    observer?.disconnect();
    observer = null;
    return;
  }
  if (observer) return;
  observer = new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === "characterData") doText(r.target as Text);
      else if (r.type === "attributes" && r.attributeName) doAttr(r.target as Element, r.attributeName);
      else r.addedNodes.forEach((node) => walk(node));
    }
  });
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...ATTRS],
  });
}
