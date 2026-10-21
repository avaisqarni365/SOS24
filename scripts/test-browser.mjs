import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve("out");
const PORT = 3333;
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
};

const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  let file = path.join(ROOT, url);
  if (existsSync(file) && statSync(file).isDirectory()) {
    file = path.join(file, "index.html");
  }
  if (!existsSync(file)) {
    res.writeHead(404).end("Not found");
    return;
  }
  const type = TYPES[path.extname(file)] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type });
  createReadStream(file).pipe(res);
});

await new Promise((resolve) => server.listen(PORT, resolve));
console.log(`Preview server running at http://localhost:${PORT}`);

const chromePath = existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
  ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  : "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

console.log(`Using browser: ${chromePath}`);

const chromeProc = spawn(chromePath, [
  "--headless=new",
  "--remote-debugging-port=9222",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "about:blank",
]);

// Wait for Chrome debugging port to open
let targets = null;
for (let i = 0; i < 30; i++) {
  try {
    const res = await fetch("http://127.0.0.1:9222/json");
    if (res.ok) {
      targets = await res.json();
      break;
    }
  } catch {
    await new Promise((r) => setTimeout(r, 200));
  }
}

if (!targets || targets.length === 0) {
  console.error("Failed to connect to browser CDP");
  chromeProc.kill();
  server.close();
  process.exit(1);
}

const pageTarget = targets.find((t) => t.type === "page") || targets[0];
const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});

let msgId = 1;
const pending = new Map();
const consoleErrors = [];

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.method === "Runtime.consoleAPICalled") {
    if (msg.params.type === "error") {
      consoleErrors.push(msg.params.args.map((a) => a.value || a.description).join(" "));
    }
  } else if (msg.method === "Runtime.exceptionThrown") {
    consoleErrors.push(msg.params.exceptionDetails.text + " " + (msg.params.exceptionDetails.exception?.description || ""));
  }

  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(msg.error);
    else resolve(msg.result);
  }
};

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = msgId++;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await send("Runtime.enable");
await send("Page.enable");

async function evaluate(expression) {
  const res = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return res.result?.value;
}

console.log("Navigating to http://localhost:3333/admin/ ...");
await send("Page.navigate", { url: "http://localhost:3333/admin/" });

// Wait for page load
await new Promise((r) => setTimeout(r, 2000));

const title = await evaluate("document.title");
console.log(`Page title: "${title}"`);

// Click the 1-Click Quick Access button to log in
const loginResult = await evaluate(`
  (() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const quickBtn = btns.find(b => (b.textContent || '').includes('Schnellzugriff') || (b.textContent || '').includes('Quick Access'));
    if (quickBtn) {
      quickBtn.click();
      return "quick_button_clicked";
    }
    const submitBtn = btns.find(b => (b.textContent || '').includes('anmelden') || (b.textContent || '').includes('Log in'));
    if (submitBtn) {
      const passInput = document.querySelector('input[type="password"]');
      if (passInput) passInput.value = 'SOS2026!Wuppertal';
      submitBtn.click();
      return "submit_button_clicked";
    }
    return "no_button_found";
  })()
`);
console.log(`Login action result: ${loginResult}`);

// Wait for dashboard to unlock
await new Promise((r) => setTimeout(r, 600));

// Test tabs
const tabsToTest = [
  "overview",
  "strategy",
  "ads",
  "analytics",
  "searchconsole",
  "maps",
  "seo",
  "belege",
  "hilfe",
];

console.log("\n--- Testing Admin Tabs Navigation & Rendering ---");
for (const tab of tabsToTest) {
  const foundAndClicked = await evaluate(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('nav button, button'));
      const target = buttons.find(b => {
        const text = (b.textContent || '').toLowerCase();
        if ('${tab}' === 'overview' && text.includes('übersicht')) return true;
        if ('${tab}' === 'strategy' && (text.includes('prognose') || text.includes('strategie') || text.includes('predictive'))) return true;
        if ('${tab}' === 'ads' && text.includes('ads')) return true;
        if ('${tab}' === 'analytics' && text.includes('analytics')) return true;
        if ('${tab}' === 'searchconsole' && text.includes('search console')) return true;
        if ('${tab}' === 'maps' && text.includes('maps')) return true;
        if ('${tab}' === 'seo' && text.includes('seo')) return true;
        if ('${tab}' === 'belege' && (text.includes('belege') || text.includes('rechnungen') || text.includes('invoices'))) return true;
        if ('${tab}' === 'hilfe' && (text.includes('hilfe') || text.includes('help'))) return true;
        return false;
      });
      if (target) {
        target.click();
        return true;
      }
      return false;
    })()
  `);

  await new Promise((r) => setTimeout(r, 400));

  const contentSummary = await evaluate(`
    (() => {
      const h2 = Array.from(document.querySelectorAll('h2, h3')).map(h => h.textContent.trim()).filter(Boolean).slice(0, 3).join(' | ');
      const textLen = document.body.innerText.length;
      return { h2, textLen };
    })()
  `);

  console.log(`Tab [${tab.padEnd(14)}]: clicked=${foundAndClicked} | Headings: "${contentSummary?.h2}" | Body chars: ${contentSummary?.textLen}`);
}

// Specifically test Strategy Tab interactive controls (City selection, slider, 1-click adopt, competitor radar)
console.log("\n--- Testing Strategy & Predictive Cockpit Interactivity ---");
await evaluate(`
  (() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const stratBtn = btns.find(b => (b.textContent || '').includes('Prognose') || (b.textContent || '').includes('Strategy'));
    if (stratBtn) stratBtn.click();
  })()
`);
await new Promise((r) => setTimeout(r, 400));

// Select Essen
const citySelected = await evaluate(`
  (() => {
    const cityBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent && b.textContent.includes('Essen'));
    if (cityBtns.length > 0) {
      cityBtns[0].click();
      return true;
    }
    return false;
  })()
`);
console.log(`City selector (Essen clicked): ${citySelected}`);
await new Promise((r) => setTimeout(r, 200));

// Read Essen Forecast Data
const forecastStats = await evaluate(`
  (() => {
    const text = document.body.innerText;
    const hasEssenTitle = text.includes('Essen');
    const hasAltbauten = text.includes('16.200') || text.includes('16,200');
    const hasCPL = text.includes('16') && text.includes('€');
    const hasRoas = text.includes('ROAS') || text.includes('Umsatz');
    return { hasEssenTitle, hasAltbauten, hasCPL, hasRoas };
  })()
`);
console.log(`Essen Regional Forecast Stats:`, forecastStats);

// Click "Strategie für Essen übernehmen" button
const adoptClick = await evaluate(`
  (() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const adoptBtn = btns.find(b => (b.textContent || '').includes('übernehmen') || (b.textContent || '').includes('Adopt'));
    if (adoptBtn) {
      adoptBtn.click();
      return adoptBtn.textContent.trim();
    }
    return "not_found";
  })()
`);
console.log(`Strategy Adoption Button: "${adoptClick}"`);
await new Promise((r) => setTimeout(r, 300));

// Check if competitor radar is visible
const competitorCount = await evaluate(`
  (() => {
    const text = document.body.innerText;
    const hasIsotec = text.includes('ISOTEC');
    const hasATG = text.includes('ATG Deutschland');
    const hasDrymat = text.includes('Drymat');
    const hasRegional = text.includes('Regionale Handwerks');
    return { hasIsotec, hasATG, hasDrymat, hasRegional };
  })()
`);
console.log(`Competitor Intelligence Radar entries:`, competitorCount);

// Test Customer Portal Page
console.log("\n--- Testing /mein-auftrag/ Page Rendering ---");
await send("Page.navigate", { url: "http://localhost:3333/mein-auftrag/" });
await new Promise((r) => setTimeout(r, 1200));
const portalH1 = await evaluate("document.querySelector('h1')?.textContent");
console.log(`Portal page H1: "${portalH1}"`);

console.log("\n--- Browser Console Errors Report ---");
if (consoleErrors.length === 0) {
  console.log("SUCCESS: 0 console errors or runtime exceptions detected across all views!");
} else {
  console.warn("Console Errors found:", consoleErrors);
}

ws.close();
chromeProc.kill();
server.close();
process.exit(consoleErrors.length > 0 ? 1 : 0);
