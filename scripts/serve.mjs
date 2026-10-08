// Local preview of the built site, exactly as it will be served: static
// files from out/, folder URLs to index.html, the site's own 404 page.
// No dependencies.   node scripts/serve.mjs [port]
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve("out");
const PORT = Number(process.argv[2] || process.env.PORT || 3000);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

if (!existsSync(ROOT)) {
  console.error('No build found. Run "pnpm build" first.');
  process.exit(1);
}

const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  let file = path.join(ROOT, url);
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!url.endsWith("/")) {
      res.writeHead(301, { Location: url + "/" }).end();
      return;
    }
    file = path.join(file, "index.html");
  }
  let status = 200;
  if (!existsSync(file)) {
    status = 404;
    file = path.join(ROOT, "404.html");
  }
  res.writeHead(status, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  // A client that disconnects mid-download makes the stream emit 'error';
  // without these handlers that is an uncaught event and the whole server
  // process dies on the first impatient visitor.
  const stream = createReadStream(file);
  stream.on("error", () => res.destroy());
  res.on("close", () => stream.destroy());
  stream.pipe(res);
});
server.on("clientError", (err, socket) => socket.destroy());
server.listen(PORT, () => {
  console.log(`\n  sos-abdichtung preview: http://localhost:${PORT}\n  (Ctrl+C to stop)\n`);
});
