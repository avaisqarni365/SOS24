/* Social media hub and AI helper for the admin.
 *
 * Beiträge: one post is written once and adapted per platform. The admin prepares the texts and
 *           media; the owner publishes by hand on each platform and ticks it off. Nothing here
 *           posts to a platform. Tab "Beiträge": one row per post.
 * KI:       drafts from Google Gemini (key in Script Property GEMINI_API_KEY, model in GEMINI_MODEL).
 *           Every draft follows AI_RULES and is checked again for prices and other claims the
 *           business does not make; the owner always edits and decides.
 */
var POSTS_TAB = 'Beiträge';
var POST_COLS = ['ID', 'Datum', 'Status', 'Thema', 'Text', 'Plattformen', 'Medien', 'Link', 'Erledigt', 'Geändert', 'Von'];
/* platform -> [label, max characters of a post text] */
var PLATFORMS = {facebook: ['Facebook', 5000], instagram: ['Instagram', 2200], tiktok: ['TikTok', 2200], youtube: ['YouTube', 5000], gbp: ['Google-Unternehmensprofil', 1500]};
var POST_STATUS = ['Entwurf', 'Geplant', 'Veröffentlicht'];
var GEMINI_DEFAULT_MODEL = 'gemini-3.5-flash-lite';
var AI_PER_HOUR = 60;

function postObj_(r) {
  var json = function (v, d) { try { var o = JSON.parse(String(v || '')); return o && typeof o === 'object' ? o : d; } catch (err) { return d; } };
  return {id: String(r[0]), date: String(day_(r[1]) || '').replace(/^'/, ''), status: String(r[2] || POST_STATUS[0]), topic: String(r[3] || ''), text: String(r[4] || ''),
    platforms: json(r[5], {}), media: [].concat(json(r[6], [])), link: String(r[7] || ''), done: json(r[8], {}), at: iso_(r[9]), by: String(r[10] || '')};
}
function api_posts_() {
  guard_();
  var posts = tabRows_(POSTS_TAB, POST_COLS).filter(function (r) { return r[0]; }).map(postObj_);
  posts.sort(function (a, b) { return (a.date || '9999') < (b.date || '9999') ? -1 : (a.date || '9999') > (b.date || '9999') ? 1 : (a.id < b.id ? 1 : -1); });
  var limits = {};
  Object.keys(PLATFORMS).forEach(function (k) { limits[k] = PLATFORMS[k][1]; });
  return {posts: posts, limits: limits, ai: !!geminiKey_()};
}
/* Multi-line plain text: no markup, tidy line breaks, no leading formula characters. */
function postText_(v, max, label) {
  var s = String(v == null ? '' : v).replace(/[<>]/g, '').replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  if (s.length > max) throw new Error(label + ': höchstens ' + max + ' Zeichen (jetzt ' + s.length + ').');
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function api_postSave_(p) {
  var user = guard_();
  p = p || {};
  var topic = pageText_(p.topic, 120, 'Thema');
  if (String(topic).length < 3) throw new Error('Bitte ein Thema eintragen.');
  var date = String(p.date || '');
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Datum ungültig.');
  var text = postText_(p.text, 3000, 'Text');
  var platforms = {}, done = {};
  Object.keys(PLATFORMS).forEach(function (k) {
    var v = postText_(p.platforms && p.platforms[k], PLATFORMS[k][1], PLATFORMS[k][0]);
    if (v) platforms[k] = v;
    if (v && p.done && p.done[k]) done[k] = true;
  });
  var known = {};
  tabRows_(MEDIA_TAB, MEDIA_COLS).forEach(function (r) { known[String(r[0])] = true; });
  var media = (Array.isArray(p.media) ? p.media : []).map(String);
  if (media.length > 10) throw new Error('Höchstens 10 Dateien pro Beitrag.');
  media.forEach(function (id) { if (!known[id]) throw new Error('Eine gewählte Datei ist nicht (mehr) in der Mediathek.'); });
  var link = String(p.link || '').trim();
  if (link && !/^https:\/\/(www\.)?sos-abdichtung\.de\/[\w\-\/?=&%.#]*$/.test(link)) throw new Error('Link: bitte eine Adresse von sos-abdichtung.de eintragen.');
  var keys = Object.keys(platforms);
  var status = keys.length && keys.every(function (k) { return done[k]; }) ? POST_STATUS[2] : (date ? POST_STATUS[1] : POST_STATUS[0]);

  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  var id = String(p.id || '');
  try {
    var sh = tab_(POSTS_TAB, POST_COLS), rows = tabRows_(POSTS_TAB, POST_COLS), at = -1;
    if (id) {
      rows.forEach(function (r, i) { if (String(r[0]) === id) at = i; });
      if (at < 0) throw new Error('Beitrag ' + id + ' nicht gefunden.');
    } else {
      var max = 0;
      rows.forEach(function (r) { var n = Number(String(r[0]).replace(/\D/g, '')) || 0; if (n > max) max = n; });
      id = 'B-' + (max + 1);
    }
    var row = [id, date ? "'" + date : '', status, topic, text, JSON.stringify(platforms), JSON.stringify(media), link, JSON.stringify(done), new Date(), user];
    if (at >= 0) sh.getRange(at + 2, 1, 1, POST_COLS.length).setValues([row]); else sh.appendRow(row);
    sheet_(TAB.audit).appendRow([new Date(), user, POSTS_TAB, id, '', at >= 0 ? 'Beitrag gespeichert (' + status + ')' : 'Beitrag angelegt']);
  } finally { lock.releaseLock(); }
  var out = api_posts_();
  out.id = id;
  return out;
}
function api_postDelete_(id) {
  var user = guard_();
  id = String(id || '');
  var sh = tab_(POSTS_TAB, POST_COLS), rows = tabRows_(POSTS_TAB, POST_COLS), at = -1;
  rows.forEach(function (r, i) { if (String(r[0]) === id) at = i; });
  if (!id || at < 0) throw new Error('Beitrag nicht gefunden.');
  sh.deleteRow(at + 2);
  sheet_(TAB.audit).appendRow([new Date(), user, POSTS_TAB, id, rows[at][3], 'Beitrag gelöscht']);
  return api_posts_();
}

/* ---------- AI (Google Gemini) ---------- */
var AI_RULES = [
  'Du schreibst für den Handwerksbetrieb „sos-abdichtung“ (Inhaber Shahzad Mahmood, Sitz: Niebuhrstraße 46, 45144 Essen).',
  'Kontakt: Telefon und WhatsApp 0172 2064177, Website sos-abdichtung.de.',
  'Leistungen: Kellersanierung von innen ohne Aufgraben, Kellerabdichtung, nachträgliche Horizontalsperre per Injektion, Sockelabdichtung, Rissverpressung, Schimmelbeseitigung, Balkon- und Terrassenabdichtung.',
  'Zusagen, die du nennen darfst: kostenlose Feuchtemessung vor Ort, Festpreis-Angebot nach der Messung, 10 Jahre Garantie auf die ausgeführte Arbeit.',
  'Einsatzgebiet: Essen, das Ruhrgebiet und NRW.',
  'Feste Regeln:',
  '- Schreibe auf Deutsch, in der Sie-Form, sachlich und freundlich, in kurzen Sätzen.',
  '- Nenne keine Preise, Eurobeträge, Rabatte oder Prozentangaben.',
  '- Erwähne keinen TÜV und keine Prüfsiegel.',
  '- Erfinde nichts: keine Zahlen, Kundennamen, Bewertungen, Auszeichnungen oder Baustellen, die nicht in der Vorgabe stehen.',
  '- Keine Superlative wie „der Beste“ oder „Nr. 1“ und keine Garantie-Aussagen über die genannten hinaus.',
  '- Nenne keine Adresse in Wuppertal. „SchimmelPeter Partnerbetrieb“ nur, wenn es ausdrücklich um die Region Wuppertal geht.',
  '- Kein Markdown, keine Sternchen, keine Überschriften mit #.'
].join('\n');

function geminiKey_() {
  return String(PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY') || config_('gemini_api_key') || '');
}
/* One call to Gemini. Returns the text; throws a message the owner can act on. */
function gemini_(prompt, opt) {
  var user = guard_();
  var key = geminiKey_();
  if (!key) throw new Error('Die KI ist noch nicht eingerichtet: Bitte den Gemini-Schlüssel als Skripteigenschaft GEMINI_API_KEY eintragen.');
  var cache = CacheService.getScriptCache(), slot = 'ai_' + String(user).toLowerCase().replace(/\W/g, '') + '_' + Utilities.formatDate(new Date(), 'Europe/Berlin', 'yyyy-MM-dd') + '_' + new Date().getHours();
  var used = Number(cache.get(slot)) || 0;
  if (used >= AI_PER_HOUR) throw new Error('Zu viele KI-Anfragen in dieser Stunde. Bitte später noch einmal versuchen.');
  cache.put(slot, String(used + 1), 3600);
  var model = String(PropertiesService.getScriptProperties().getProperty('GEMINI_MODEL') || GEMINI_DEFAULT_MODEL).replace(/[^\w.\-]/g, '');
  var cfg = {maxOutputTokens: (opt && opt.max) || 900, temperature: 0.6};
  if (opt && opt.json) cfg.responseMimeType = 'application/json';
  var res = UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent', {
    method: 'post', contentType: 'application/json', muteHttpExceptions: true, headers: {'x-goog-api-key': key},
    payload: JSON.stringify({systemInstruction: {parts: [{text: AI_RULES}]}, contents: [{role: 'user', parts: [{text: prompt}]}], generationConfig: cfg})
  });
  var code = res.getResponseCode();
  if (code === 400 || code === 403) throw new Error('Google hat den KI-Schlüssel abgelehnt (' + code + '). Bitte GEMINI_API_KEY prüfen.');
  if (code === 404) throw new Error('Das KI-Modell „' + model + '“ gibt es nicht (mehr). Bitte GEMINI_MODEL in den Skripteigenschaften anpassen.');
  if (code === 429) throw new Error('Das kostenlose KI-Kontingent bei Google ist gerade erschöpft. Bitte später noch einmal versuchen.');
  if (code !== 200) throw new Error('Die KI antwortet gerade nicht (' + code + ').');
  var data = JSON.parse(res.getContentText()), c = data.candidates && data.candidates[0];
  var text = c && c.content && c.content.parts ? c.content.parts.map(function (x) { return x.text || ''; }).join('') : '';
  if (!String(text).trim()) throw new Error('Die KI hat keinen Text geliefert. Bitte die Vorgabe anders formulieren.');
  return String(text);
}
/* What a draft must not contain; the owner sees these next to the text. */
function aiWarnings_(text) {
  var w = [], s = String(text || '');
  if (/€|\bEUR\b|\beuro\b|\d\s?%/i.test(s)) w.push('enthält einen Preis oder eine Prozentangabe');
  if (/t[üu]v/i.test(s)) w.push('erwähnt TÜV');
  if (/remscheider\s*str/i.test(s)) w.push('nennt die Wuppertaler Adresse');
  if (/\b(beste[rn]?|nr\.?\s?1|nummer\s?1|marktführer)\b/i.test(s)) w.push('enthält einen Superlativ');
  return w;
}
function aiClean_(text, max) {
  var s = String(text || '').replace(/[<>]/g, '').replace(/\*\*|__/g, '').replace(/^#{1,6}\s+/gm, '').replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
  return s.length > max ? s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…' : s;
}

/* One post, adapted for every platform. p: {topic, text, link} */
function api_aiSocial_(p) {
  guard_();
  p = p || {};
  var topic = pageText_(p.topic, 120, 'Thema'), base = postText_(p.text, 3000, 'Text');
  if (String(topic).length < 3 && String(base).length < 10) throw new Error('Bitte zuerst ein Thema oder ein paar Stichworte eintragen.');
  var link = /^https:\/\/(www\.)?sos-abdichtung\.de\//.test(String(p.link || '')) ? String(p.link) : 'https://sos-abdichtung.de/';
  var prompt = [
    'Schreibe einen Beitrag für die sozialen Medien und passe ihn für jede Plattform an.',
    'Thema: ' + topic,
    base ? 'Stichworte oder Entwurf des Inhabers:\n' + base : '',
    'Link zur passenden Seite: ' + link,
    '',
    'Gib NUR ein JSON-Objekt mit genau diesen fünf Schlüsseln zurück (Werte sind reine Texte):',
    '"facebook": 3 bis 5 Sätze, am Ende Telefon/WhatsApp und der Link, danach 2 bis 3 Hashtags.',
    '"instagram": 2 bis 4 kurze Sätze, kein Link im Text (stattdessen „Link im Profil“), danach 6 bis 10 passende Hashtags.',
    '"tiktok": 1 bis 2 Sätze als Videobeschreibung, danach 4 bis 6 Hashtags.',
    '"youtube": erste Zeile ein Videotitel mit höchstens 70 Zeichen, dann eine Leerzeile, dann eine Beschreibung mit 3 bis 5 Sätzen samt Link und Telefon.',
    '"gbp": 2 bis 4 Sätze für das Google-Unternehmensprofil, ohne Hashtags und ohne Telefonnummer, mit einem klaren Hinweis auf die kostenlose Feuchtemessung.'
  ].filter(function (x) { return x !== ''; }).join('\n');
  var raw = gemini_(prompt, {json: true, max: 1600}), obj = null;
  try { obj = JSON.parse(raw); } catch (err) {
    var m = raw.match(/\{[\s\S]*\}/);
    try { obj = m ? JSON.parse(m[0]) : null; } catch (err2) { obj = null; }
  }
  if (!obj || typeof obj !== 'object') throw new Error('Die KI-Antwort war nicht lesbar. Bitte noch einmal versuchen.');
  var platforms = {}, warnings = {};
  Object.keys(PLATFORMS).forEach(function (k) {
    if (typeof obj[k] !== 'string' || !obj[k].trim()) return;
    platforms[k] = aiClean_(obj[k], PLATFORMS[k][1]);
    var w = aiWarnings_(platforms[k]);
    if (w.length) warnings[k] = w;
  });
  if (!Object.keys(platforms).length) throw new Error('Die KI hat keinen Text geliefert. Bitte noch einmal versuchen.');
  return {platforms: platforms, warnings: warnings};
}

/* A reply draft. p: {kind: 'review' | 'lead', text, stars, name} */
function api_aiReply_(p) {
  guard_();
  p = p || {};
  var kind = p.kind === 'lead' ? 'lead' : 'review';
  var text = postText_(p.text, 3000, 'Text');
  if (String(text).length < 5) throw new Error(kind === 'lead' ? 'Bitte die Nachricht des Kunden einfügen.' : 'Bitte den Text der Bewertung einfügen.');
  var name = pageText_(p.name, 80, 'Name'), stars = Math.max(0, Math.min(5, Math.round(Number(p.stars) || 0)));
  var prompt = kind === 'lead' ? [
    'Ein Interessent hat dem Betrieb geschrieben. Entwirf eine Antwort für WhatsApp oder E-Mail (4 bis 7 Sätze).',
    'Bedanke dich, gehe auf das geschilderte Problem ein, erkläre in einem Satz, wie es weitergeht (kostenlose Feuchtemessung vor Ort, danach Festpreis-Angebot), und bitte um zwei Terminvorschläge und ein paar Fotos.',
    'Stelle keine Diagnose aus der Ferne und versprich kein Ergebnis.',
    name ? 'Name des Kunden: ' + name : 'Der Name ist nicht bekannt: beginne mit „Guten Tag,“.',
    'Schließe mit: Shahzad Mahmood, sos-abdichtung, 0172 2064177.',
    'Nachricht des Kunden:\n' + text
  ].join('\n') : [
    'Ein Kunde hat eine Google-Bewertung geschrieben. Entwirf die öffentliche Antwort des Inhabers (2 bis 4 Sätze).',
    stars ? 'Sterne: ' + stars + ' von 5.' : '',
    stars && stars <= 3
      ? 'Die Bewertung ist kritisch: bleibe ruhig und sachlich, bedanke dich für die Rückmeldung, entschuldige dich für den Ärger, ohne Schuld zuzuweisen oder Einzelheiten zu bestreiten, und bitte um einen Anruf unter 0172 2064177, um eine Lösung zu finden.'
      : 'Bedanke dich persönlich, nenne die Leistung und den Ort nur, wenn sie in der Bewertung stehen, und biete an, bei Fragen jederzeit erreichbar zu sein.',
    name ? 'Name des Kunden: ' + name : '',
    'Unterschrift: Shahzad Mahmood, sos-abdichtung.',
    'Text der Bewertung:\n' + text
  ].filter(function (x) { return x !== ''; }).join('\n');
  var out = aiClean_(gemini_(prompt, {max: 600}), 1500);
  return {text: out, warnings: aiWarnings_(out)};
}

/* ---------- Automations (definitions and mail texts: Shared.js) ---------- */
function api_automations_() {
  guard_();
  return {to: officeTo_(), hour: 7, items: Object.keys(AUTOS).map(function (k) { return {key: k, label: AUTOS[k][1], text: AUTOS[k][2], on: autoOn_(k), last: String(config_('auto_last_' + k) || '').replace(/^'/, '')}; })};
}
function api_automationSet_(key, on) {
  var user = guard_();
  if (!AUTOS[key]) throw new Error('Unbekannte Automatik.');
  setConfig_(AUTOS[key][0], on ? 'ja' : 'nein');
  sheet_(TAB.audit).appendRow([new Date(), user, TAB.config, AUTOS[key][0], '', AUTOS[key][1] + (on ? ' eingeschaltet' : ' ausgeschaltet')]);
  return api_automations_();
}
/* Sends one of the mails now, so the owner sees what it looks like. */
function api_automationTest_(key) {
  guard_();
  if (!AUTOS[key]) throw new Error('Unbekannte Automatik.');
  var to = officeTo_();
  if (!to) throw new Error('Es ist keine Büro-Adresse hinterlegt (Konfiguration: notify_email).');
  var now = new Date(), mail = key === 'weekly' ? autoWeekly_(now) : key === 'posts' ? autoPostsToday_(now) : autoReviews_(now);
  if (!mail) return {sent: false, to: to, why: key === 'posts' ? 'Für heute ist kein Beitrag geplant; es gäbe heute keine E-Mail.' : 'Gestern wurde kein Auftrag auf „Erledigt“ gesetzt; es gäbe heute keine E-Mail.'};
  MailApp.sendEmail({to: to, subject: '[Test] ' + mail.subject, body: mail.body, name: 'sos-abdichtung Admin'});
  return {sent: true, to: to};
}

/* ---------- Review requests ----------
 * Finished jobs and whether the customer was asked for a Google review. The owner sends the
 * WhatsApp himself; the admin only prepares the text and remembers who was asked. */
var REVIEW_COLS = ['Anfrage', 'Kunde', 'Gefragt am', 'Bewertet am', 'Von'];
function api_reviews_() {
  guard_();
  var marks = {}, finished = {};
  tabRows_(REVIEW_TAB, REVIEW_COLS).forEach(function (r) {
    if (r[0]) marks[String(r[0])] = {asked: String(day_(r[2]) || '').replace(/^'/, ''), got: String(day_(r[3]) || '').replace(/^'/, '')};
  });
  autoStatusLog_('Erledigt').forEach(function (x) { finished[x.id] = autoDay_(x.at); });
  var items = allLeads_().filter(function (l) { return l.status === 'Erledigt'; }).map(function (l) {
    var m = marks[l.id] || {}, a = reviewAsk_(l.name, l.phone, l.from, l.to);
    return {id: l.id, name: l.name, phone: l.phone, finished: finished[l.id] || '', asked: m.asked || '', got: m.got || '', text: a.text, wa: a.wa, town: a.town, area: a.area, region: a.region, service: l.to};
  });
  var rank = function (x) { return x.got ? 2 : x.asked ? 1 : 0; };
  items.sort(function (a, b) { return rank(a) - rank(b) || (a.finished < b.finished ? 1 : a.finished > b.finished ? -1 : 0); });
  return {link: REVIEW_LINK, items: items.slice(0, 200),
    open: items.filter(function (x) { return !x.asked && !x.got; }).length,
    asked: items.filter(function (x) { return x.asked; }).length,
    got: items.filter(function (x) { return x.got; }).length};
}
/* field: 'asked' | 'got' */
function api_reviewMark_(id, field, on) {
  var user = guard_();
  id = String(id || '');
  if (field !== 'asked' && field !== 'got') throw new Error('Unbekanntes Feld.');
  var lead = allLeads_().filter(function (l) { return l.id === id; })[0];
  if (!lead) throw new Error('Anfrage ' + id + ' nicht gefunden.');
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = tab_(REVIEW_TAB, REVIEW_COLS), rows = tabRows_(REVIEW_TAB, REVIEW_COLS), at = -1, col = field === 'asked' ? 2 : 3;
    rows.forEach(function (r, i) { if (String(r[0]) === id) at = i; });
    var row = at >= 0 ? rows[at].slice() : [id, lead.name, '', '', user];
    row[2] = String(day_(row[2]) || '').replace(/^'/, ''); row[3] = String(day_(row[3]) || '').replace(/^'/, '');
    row[col] = on ? autoDay_(new Date()) : '';
    if (field === 'got' && on && !row[2]) row[2] = row[3];
    row[2] = row[2] ? "'" + row[2] : ''; row[3] = row[3] ? "'" + row[3] : ''; row[4] = user;
    if (at >= 0) sh.getRange(at + 2, 1, 1, REVIEW_COLS.length).setValues([row]); else sh.appendRow(row);
    sheet_(TAB.audit).appendRow([new Date(), user, REVIEW_TAB, id, '', (field === 'asked' ? 'Um Bewertung gebeten' : 'Bewertung erhalten') + (on ? '' : ' (zurückgenommen)')]);
  } finally { lock.releaseLock(); }
  return api_reviews_();
}
/* The same message for a customer who is not in the enquiries (jobs from before the admin).
 * address: "45144 Essen" or a full address. Nothing is stored; the owner sends it himself. */
function api_reviewDraft_(name, phone, address, service) {
  guard_();
  name = String(name || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  if (name.length < 2) throw new Error('Bitte den Namen des Kunden eintragen, zum Beispiel „Herr Schmidt“.');
  var a = reviewAsk_(name, String(phone || '').slice(0, 30), String(address || '').slice(0, 120), String(service || '').slice(0, 80));
  return {text: a.text, wa: a.wa, town: a.town, area: a.area};
}

/* ---------- Today: what needs doing, for the overview ---------- */
function api_today_() {
  guard_();
  var now = new Date(), today = autoDay_(now), tomorrow = autoDay_(new Date(now.getTime() + 864e5));
  var label = function (k) { return PLATFORMS[k] ? PLATFORMS[k][0] : k; };
  var post = function (p) { return {id: p.id, date: p.date, topic: p.topic, open: p.open.map(label)}; };
  var posts = autoPosts_().filter(function (p) { return p.date && p.open.length; });
  var appt = function (a) { return {nr: a.nr, date: a.date, time: a.time, name: a.name, address: a.address, type: a.type}; };
  var appts = allAppts_().filter(function (a) { return a.status !== 'Abgesagt'; }).sort(function (a, b) { return a.time < b.time ? -1 : 1; });
  var fresh = allLeads_().filter(function (l) { return l.status === 'Neu'; });
  return {date: today,
    postsToday: posts.filter(function (p) { return p.date === today; }).map(post),
    postsLate: posts.filter(function (p) { return p.date < today; }).slice(-10).map(post),
    apptsToday: appts.filter(function (a) { return a.date === today; }).map(appt),
    apptsTomorrow: appts.filter(function (a) { return a.date === tomorrow; }).map(appt),
    leadsNew: fresh.length,
    leads: fresh.slice(0, 5).map(function (l) { return {id: l.id, name: l.name, received: l.received}; }),
    reviewsOpen: api_reviews_().open,
    autosOn: Object.keys(AUTOS).filter(autoOn_).length, autosAll: Object.keys(AUTOS).length};
}

/* ---------- AI: a plan of post ideas ----------
 * p: {count: 3 | 6 | 9, focus}. Returns ideas with a suggested date (Mon, Wed, Fri from tomorrow);
 * nothing is saved until the owner picks ideas and calls api_postsAdd. */
function planDates_(now, n) {
  var out = [], t = now.getTime();
  for (var i = 1; out.length < n && i < 120; i++) {
    var d = autoDay_(new Date(t + i * 864e5)), wd = new Date(Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10))).getUTCDay();
    if (wd === 1 || wd === 3 || wd === 5) out.push(d);
  }
  return out;
}
function api_aiPlan_(p) {
  guard_();
  p = p || {};
  var count = [3, 6, 9].indexOf(Number(p.count)) >= 0 ? Number(p.count) : 6;
  var focus = pageText_(p.focus, 200, 'Schwerpunkt'), now = new Date();
  var have = tabRows_(POSTS_TAB, POST_COLS).filter(function (r) { return r[0]; }).map(function (r) { return String(r[3]); }).slice(-30);
  var prompt = [
    'Plane ' + count + ' Beiträge für die sozialen Medien des Betriebs für die nächsten Wochen.',
    'Heutiges Datum: ' + autoDay_(now) + '. Berücksichtige die Jahreszeit (zum Beispiel Starkregen, Heizperiode, Frost, Frühjahrs-Check).',
    focus ? 'Schwerpunkt des Inhabers: ' + focus : '',
    'Mische die Themen: typische Schäden erkennen, Ablauf einer Sanierung, die kostenlose Feuchtemessung, Tipps für Hausbesitzer, einzelne Leistungen, Orte im Ruhrgebiet.',
    have.length ? 'Diese Themen gibt es schon, bitte nicht wiederholen:\n- ' + have.join('\n- ') : '',
    '',
    'Gib NUR ein JSON-Array mit genau ' + count + ' Objekten zurück. Jedes Objekt hat zwei Schlüssel:',
    '"topic": das Thema in höchstens 80 Zeichen, konkret und ohne Hashtags.',
    '"text": 2 bis 3 Stichpunkte in einem kurzen Absatz: was der Beitrag sagen soll und welches Foto oder Video dazu passt.'
  ].filter(function (x) { return x !== ''; }).join('\n');
  var raw = gemini_(prompt, {json: true, max: 1800}), arr = null;
  try { arr = JSON.parse(raw); } catch (err) {
    var m = raw.match(/\[[\s\S]*\]/);
    try { arr = m ? JSON.parse(m[0]) : null; } catch (err2) { arr = null; }
  }
  if (arr && !Array.isArray(arr) && Array.isArray(arr.items)) arr = arr.items;
  if (!Array.isArray(arr)) throw new Error('Die KI-Antwort war nicht lesbar. Bitte noch einmal versuchen.');
  var dates = planDates_(now, count), ideas = [];
  arr.forEach(function (x) {
    if (!x || typeof x.topic !== 'string' || ideas.length >= count) return;
    var topic = aiClean_(x.topic, 120).replace(/\n/g, ' '), text = aiClean_(typeof x.text === 'string' ? x.text : '', 600);
    if (topic.length < 3) return;
    ideas.push({topic: topic, text: text, date: dates[ideas.length] || '', warnings: aiWarnings_(topic + ' ' + text)});
  });
  if (!ideas.length) throw new Error('Die KI hat keine Themen geliefert. Bitte noch einmal versuchen.');
  return {ideas: ideas};
}
/* Saves picked ideas as posts (topic, notes, date); the platform texts are written later. */
function api_postsAdd_(list) {
  guard_();
  list = Array.isArray(list) ? list : [];
  if (!list.length) throw new Error('Bitte mindestens ein Thema auswählen.');
  if (list.length > 12) throw new Error('Höchstens 12 Beiträge auf einmal.');
  var ids = [];
  list.forEach(function (x) { ids.push(api_postSave_({topic: x && x.topic, text: x && x.text, date: x && x.date}).id); });
  var out = api_posts_();
  out.added = ids;
  return out;
}

/* ---------- AI: content for a page ----------
 * A draft for one own section or one own question on a town or service page.
 * p: {path, kind: 'section' | 'faq', topic, name}. Nothing is saved; the owner edits and saves. */
function api_aiPage_(p) {
  guard_();
  p = p || {};
  var path = String(p.path || '');
  if (!PAGE_PATH.test(path)) throw new Error('Unbekannte Seite: ' + path);
  var kind = p.kind === 'faq' ? 'faq' : 'section';
  var topic = pageText_(p.topic, 160, 'Stichwort'), name = pageText_(p.name, 80, 'Seite');
  if (String(topic).length < 3) throw new Error('Bitte ein Stichwort eintragen, worum es gehen soll.');
  var isTown = /^\/kellersanierung\//.test(path);
  var about = isTown ? 'die Stadtseite „Kellersanierung ' + name + '“' : 'die Leistungsseite „' + name + '“';
  var prompt = (kind === 'faq' ? [
    'Schreibe eine Frage mit Antwort für ' + about + ' der Website.',
    'Thema: ' + topic,
    'Die Frage so formulieren, wie ein Hausbesitzer sie bei Google eingibt' + (isTown ? ', mit dem Ortsnamen ' + name : '') + '.',
    'Die Antwort: 2 bis 4 Sätze, konkret und ehrlich, ohne Diagnose aus der Ferne.',
    'Gib NUR ein JSON-Objekt mit den Schlüsseln "q" und "a" zurück.'
  ] : [
    'Schreibe einen Abschnitt für ' + about + ' der Website.',
    'Thema: ' + topic,
    'Der Abschnitt hat eine Überschrift mit höchstens 80 Zeichen' + (isTown ? ', die den Ort ' + name + ' nennt,' : '') + ' und zwei Absätze mit je 3 bis 4 Sätzen.',
    'Erster Absatz: das Problem, so wie es der Hausbesitzer erlebt. Zweiter Absatz: was wir dagegen tun, von innen und ohne Aufgraben.',
    isTown ? 'Nenne keine Stadtteile, Straßen oder Gebäude, die nicht im Thema stehen.' : '',
    'Gib NUR ein JSON-Objekt mit den Schlüsseln "heading" und "text" zurück. Im "text" trennt eine Leerzeile die beiden Absätze.'
  ]).filter(function (x) { return x !== ''; }).join('\n');
  var raw = gemini_(prompt, {json: true, max: 900}), obj = null;
  try { obj = JSON.parse(raw); } catch (err) {
    var m = raw.match(/\{[\s\S]*\}/);
    try { obj = m ? JSON.parse(m[0]) : null; } catch (err2) { obj = null; }
  }
  if (!obj || typeof obj !== 'object') throw new Error('Die KI-Antwort war nicht lesbar. Bitte noch einmal versuchen.');
  if (kind === 'faq') {
    var q = aiClean_(obj.q, 160).replace(/\n+/g, ' '), a = aiClean_(obj.a, 800).replace(/\n+/g, ' ');
    if (q.length < 8 || a.length < 20) throw new Error('Die KI hat keinen brauchbaren Text geliefert. Bitte das Stichwort genauer fassen.');
    return {kind: kind, q: q, a: a, warnings: aiWarnings_(q + ' ' + a)};
  }
  var heading = aiClean_(obj.heading, 120).replace(/\n+/g, ' '), text = aiClean_(obj.text, 2000);
  if (heading.length < 3 || text.length < 40) throw new Error('Die KI hat keinen brauchbaren Text geliefert. Bitte das Stichwort genauer fassen.');
  return {kind: kind, heading: heading, text: text, warnings: aiWarnings_(heading + ' ' + text)};
}
