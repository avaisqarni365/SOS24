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
  return {to: officeTo_(), hour: 7, items: Object.keys(AUTOS).map(function (k) { return {key: k, label: AUTOS[k][1], text: AUTOS[k][2], on: autoOn_(k)}; })};
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
