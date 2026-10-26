// Tells Bing (and through it ChatGPT search and Copilot) and the other IndexNow
// engines which pages exist, right after a deploy. The key file in public/
// proves the site is ours; the key is public by design.
import { readFileSync, readdirSync } from "node:fs";

const HOST = "sos-abdichtung.de";
const key = readdirSync("public").find((f) => /^[0-9a-f]{32}\.txt$/.test(f))?.slice(0, -4);
if (!key) throw new Error("indexnow: no key file in public/");

const sitemap = readFileSync("out/sitemap.xml", "utf8");
const urlList = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList }),
});
console.log(`indexnow: ${urlList.length} URLs, HTTP ${res.status}`);
// 200 and 202 are both accepted; anything else is reported but never fails the deploy
if (res.status !== 200 && res.status !== 202) console.log(await res.text());
