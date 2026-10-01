/**
 * Prefix the site's own root-absolute URLs with a base path, for hosting the
 * static export in a sub-folder (GitHub Pages preview: /SOS24/).
 *
 * Next.js `basePath` already prefixes its framework files (/_next/...) and
 * next/link. The page markup and client code use plain paths such as
 * "/img/...", "/textures/...", "/leistungen/..." and href="/", which this
 * rewrites in the built HTML, JS chunks and RSC payloads. Runs only when
 * PAGES_BASE_PATH is set; a normal build is left untouched.
 *
 *   PAGES_BASE_PATH=/SOS24 node scripts/apply-base-path.mjs
 */
import fs from "node:fs";
import path from "node:path";

const BASE = (process.env.PAGES_BASE_PATH || "").replace(/\/$/, "");
const OUT = path.resolve("out");
if (!BASE) {
  console.log("apply-base-path: PAGES_BASE_PATH not set, nothing to do");
  process.exit(0);
}

// Paths the site itself serves from /public or as pages.
const PREFIX =
  "(?:img/|textures/|scrollcraft/|fonts/|video/|leistungen/|kellersanierung/|galerie/|kostenrechner/|impressum/|datenschutz/|icon\\.svg|logo\\.svg|og-image\\.jpg|llms\\.txt|#)";
// An opening quote, an escaped quote inside RSC/JSON payloads, or url(.
const OPEN = '(\\\\"|["\'`(])';
const rules = [
  [new RegExp(`${OPEN}/(${PREFIX})`, "g"), `$1${BASE}/$2`],
  // second and later srcset candidates: ", /img/..."
  [/(, )\/(img\/)/g, `$1${BASE}/$2`],
  // the home link itself: href="/" in markup, href:"/" in compiled JSX,
  // \"href\":\"/\" in the RSC payload
  [/(href=")\/(")/g, `$1${BASE}/$2`],
  [/(href:\s*")\/(")/g, `$1${BASE}/$2`],
  [/(\\"href\\":\\")\/(\\")/g, `$1${BASE}/$2`],
];

let files = 0;
let hits = 0;
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(html|js|txt|css)$/.test(e.name)) {
      const src = fs.readFileSync(p, "utf8");
      let out = src;
      for (const [re, to] of rules) out = out.replace(re, (...m) => (hits++, to.replace("$1", m[1]).replace("$2", m[2])));
      // never prefix twice
      out = out.split(`${BASE}${BASE}/`).join(`${BASE}/`);
      if (out !== src) {
        fs.writeFileSync(p, out);
        files++;
      }
    }
  }
};
walk(OUT);
// GitHub Pages must not run Jekyll over the export (it hides _next/).
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
console.log(`apply-base-path: ${hits} URLs prefixed with ${BASE} in ${files} files`);
