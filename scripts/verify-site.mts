// Quality and SEO gate for the built site (out/). Runs locally with
// `pnpm check` and in GitHub Actions before every deploy. Fails (exit 1) on
// anything that would hurt ranking or break a page; prints a keyword table.
//
//   node --experimental-strip-types scripts/verify-site.mts [outDir]
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { SERVICE_PAGES, CITY_PAGES } from "../src/data/seo-pages.ts";

const OUT = path.resolve(process.argv[2] || "out");
const SITE = readFileSync("src/lib/site.ts", "utf8").match(/SITE_URL = "([^"]+)"/)?.[1] ?? "";
const HOME_KEYWORD = "Kellersanierung Wuppertal";

const errors: string[] = [];
const warnings: string[] = [];
const err = (page: string, msg: string) => errors.push(`${page}: ${msg}`);
const warn = (page: string, msg: string) => warnings.push(`${page}: ${msg}`);

if (!existsSync(OUT)) {
  console.error(`No build found at ${OUT}. Run "pnpm build" first.`);
  process.exit(1);
}

// --------------------------------------------------------------- helpers
const decode = (s: string) =>
  s
    .replace(/­/g, "")
    .replace(/&shy;/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;| |‑/g, (m) => (m === "‑" ? "-" : " "));
const text = (html: string) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];

function htmlFiles(dir: string, acc: string[] = []) {
  for (const e of readdirSync(dir)) {
    const p = path.join(dir, e);
    if (statSync(p).isDirectory()) {
      if (e === "_next") continue;
      htmlFiles(p, acc);
    } else if (e === "index.html") acc.push(p);
  }
  return acc;
}
const routeOf = (file: string) => "/" + path.relative(OUT, path.dirname(file)).split(path.sep).filter(Boolean).map((s) => s + "/").join("");
const fileFor = (route: string) => {
  const clean = decodeURIComponent(route.split("#")[0].split("?")[0]);
  const candidates = [path.join(OUT, clean), path.join(OUT, clean, "index.html"), path.join(OUT, clean + ".html")];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
};

const keywordFor = (route: string) => {
  if (route === "/") return HOME_KEYWORD;
  const s = route.match(/^\/leistungen\/([^/]+)\/$/);
  if (s) return SERVICE_PAGES.find((p) => p.slug === s[1])?.keyword;
  const c = route.match(/^\/kellersanierung\/([^/]+)\/$/);
  if (c) return CITY_PAGES.find((p) => p.slug === c[1])?.keyword;
  return undefined;
};

// ------------------------------------------------------------ the pages
const pages = htmlFiles(OUT).filter((f) => !/[/\\](404|_not-found)[/\\]/.test(f));
const idsByRoute = new Map<string, Set<string>>();
const htmlByRoute = new Map<string, string>();
for (const f of pages) {
  const html = readFileSync(f, "utf8");
  const route = routeOf(f);
  htmlByRoute.set(route, html);
  idsByRoute.set(route, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

const table: { route: string; kw: string; title: boolean; h1: boolean; desc: boolean }[] = [];
const titles = new Map<string, string>();

for (const [route, html] of htmlByRoute) {
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const desc = decode(attr(html.match(/<meta name="description"[^>]*>/)?.[0] ?? "", "content") ?? "");
  const canonical = attr(html.match(/<link rel="canonical"[^>]*>/)?.[0] ?? "", "href");
  const robots = attr(html.match(/<meta name="robots"[^>]*>/)?.[0] ?? "", "content") ?? "";
  const ogImage = attr(html.match(/<meta property="og:image"[^>]*>/)?.[0] ?? "", "content");
  const h1s = [...html.matchAll(/<h1[\s>][\s\S]*?<\/h1>/g)].map((m) => text(m[0]));

  if (!title) err(route, "no <title>");
  else if (title.length > 60) err(route, `title is ${title.length} characters (max 60): "${title}"`);
  if (titles.has(title)) err(route, `same title as ${titles.get(title)}`);
  titles.set(title, route);
  if (!desc) err(route, "no meta description");
  else if (desc.length < 70 || desc.length > 160) warn(route, `meta description is ${desc.length} characters (aim for 70-160)`);
  if (h1s.length !== 1) err(route, `${h1s.length} <h1> elements (exactly one expected)`);
  if (!canonical) err(route, "no canonical link");
  else if (canonical !== SITE + route) err(route, `canonical ${canonical} should be ${SITE + route}`);
  if (/noindex/.test(robots)) err(route, "page is set to noindex");
  if (!ogImage) err(route, "no og:image (share preview)");

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch {
      err(route, "invalid JSON-LD block");
    }
  }

  const kw = keywordFor(route);
  if (kw) {
    const k = kw.toLowerCase();
    const row = {
      route,
      kw,
      title: title.toLowerCase().includes(k),
      h1: (h1s[0] ?? "").toLowerCase().includes(k),
      desc: desc.toLowerCase().includes(k),
    };
    table.push(row);
    if (!row.title) err(route, `keyword "${kw}" missing in title`);
    if (!row.h1) err(route, `keyword "${kw}" missing in h1`);
    if (!row.desc) warn(route, `keyword "${kw}" missing in meta description`);
  }

  // internal links and in-page anchors
  for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    const href = decode(m[1]);
    if (/^(https?:|mailto:|tel:|\/\/)/.test(href)) continue;
    const [p, hash] = href.split("#");
    const targetRoute = p === "" ? route : p;
    if (p !== "" && !fileFor(p)) {
      err(route, `broken link ${href}`);
      continue;
    }
    if (hash) {
      const ids = idsByRoute.get(targetRoute.endsWith("/") ? targetRoute : targetRoute + "/");
      if (ids && !ids.has(hash)) err(route, `link ${href} points to a missing anchor #${hash}`);
    }
  }
  // images and icons served from the site
  for (const m of html.matchAll(/<(?:img|source)\s[^>]*>/g)) {
    const srcs = [attr(m[0], "src"), ...(attr(m[0], "srcSet") ?? attr(m[0], "srcset") ?? "").split(",").map((x) => x.trim().split(" ")[0])];
    for (const s of srcs) {
      if (!s || /^(https?:|data:)/.test(s)) continue;
      if (!fileFor(s)) err(route, `missing image ${s}`);
      if (/\.(png|jpe?g)$/i.test(s)) warn(route, `${s} is not WebP`);
    }
    if (m[0].startsWith("<img") && !/\salt="/.test(m[0])) err(route, `image without alt: ${attr(m[0], "src")}`);
  }
}

// --------------------------------------------------------- sitemap, robots
const sitemap = existsSync(path.join(OUT, "sitemap.xml")) ? readFileSync(path.join(OUT, "sitemap.xml"), "utf8") : "";
if (!sitemap) err("/sitemap.xml", "missing");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const loc of locs) {
  if (!loc.startsWith(SITE)) err("/sitemap.xml", `${loc} is not on ${SITE}`);
  else if (!fileFor(loc.slice(SITE.length) || "/")) err("/sitemap.xml", `${loc} has no page`);
}
for (const route of htmlByRoute.keys()) if (!locs.includes(SITE + route)) warn("/sitemap.xml", `${route} is not listed`);
const robots = existsSync(path.join(OUT, "robots.txt")) ? readFileSync(path.join(OUT, "robots.txt"), "utf8") : "";
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) err("/robots.txt", "no Sitemap line for the site");
if (!existsSync(path.join(OUT, "llms.txt"))) warn("/llms.txt", "missing");

// ------------------------------------------------------------ report
const ok = (b: boolean) => (b ? "ok " : "-- ");
console.log(`\nKeywords (${SITE})`);
console.log("title h1  desc  keyword                               page");
for (const r of table.sort((a, b) => a.route.localeCompare(b.route)))
  console.log(`${ok(r.title)}  ${ok(r.h1)} ${ok(r.desc)}  ${r.kw.padEnd(38)}${r.route}`);
console.log(`\n${htmlByRoute.size} pages checked, ${locs.length} sitemap URLs.`);
if (warnings.length) console.log(`\n${warnings.length} warning(s):\n  ` + warnings.join("\n  "));
if (errors.length) {
  console.error(`\n${errors.length} error(s):\n  ` + errors.join("\n  "));
  process.exit(1);
}
console.log("\nAll checks passed.");
