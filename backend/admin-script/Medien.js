/* Website media and page content, edited in the admin and published with one button.
 *
 * Medien:  photos and short videos live in the Drive folder MEDIA_FOLDER; the tab "Medien" keeps one
 *          row per file (size, dimensions, a small preview), so the list loads without asking Drive.
 * Seiten:  per page (town and service pages) the owner can replace title, description, headline and
 *          intro and attach photos from the library; the tab "Seiten" keeps one row per page.
 * Publish: writes public/data/pages.json and the photos it uses (public/media/…) to GitHub as ONE
 *          commit on main; that push runs the site build, so the change is in the page's HTML.
 */
var MEDIA_FOLDER = 'SOS Abdichtung - Website-Medien';
var MEDIA_TAB = 'Medien', PAGES_TAB = 'Seiten';
var MEDIA_COLS = ['ID', 'Name', 'Typ', 'Breite', 'Höhe', 'Bytes', 'Hochgeladen', 'Von', 'Vorschau'];
var PAGE_COLS = ['Pfad', 'Titel', 'Beschreibung', 'Überschrift', 'Einleitung', 'Fotos', 'Geändert', 'Von'];
var MEDIA_IMG = ['image/jpeg', 'image/png', 'image/webp'];
var MEDIA_VID = ['video/mp4', 'video/webm', 'video/quicktime'];
var MEDIA_IMG_MAX = 8 * 1024 * 1024, MEDIA_VID_MAX = 25 * 1024 * 1024;
var MEDIA_EXT = {'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov'};
var PAGE_PATH = /^\/(kellersanierung|leistungen)\/[a-z0-9-]{2,60}\/$/;
/* field -> [label, max length, column] */
var PAGE_TEXT = {title: ['Titel', 60, 2], metaDescription: ['Beschreibung', 160, 3], h1: ['Überschrift', 120, 4], lede: ['Einleitung', 600, 5]};
var PAGE_PHOTOS_MAX = 12;

function tab_(name, cols) {
  var sh = ss_().getSheetByName(name);
  if (!sh) { sh = ss_().insertSheet(name); sh.getRange(1, 1, 1, cols.length).setValues([cols]); }
  return sh;
}
function tabRows_(name, cols) {
  var sh = tab_(name, cols), n = sh.getLastRow();
  return n > 1 ? sh.getRange(2, 1, n - 1, cols.length).getValues() : [];
}
function mediaItem_(r) {
  return {id: String(r[0]), name: String(r[1]), type: String(r[2]), w: Number(r[3]) || 0, h: Number(r[4]) || 0,
    size: Number(r[5]) || 0, at: iso_(r[6]), by: String(r[7] || ''), thumb: String(r[8] || ''),
    url: 'https://drive.google.com/file/d/' + r[0] + '/view'};
}
/* A file name that is safe in a URL: "Keller Rüttenscheid (1).JPG" -> "keller-ruettenscheid-1" */
function mediaSlug_(name) {
  var s = String(name || '').replace(/\.[A-Za-z0-9]{2,5}$/, '').toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  return s || 'datei';
}

function api_mediaList_() {
  guard_();
  var items = tabRows_(MEDIA_TAB, MEDIA_COLS).filter(function (r) { return r[0]; }).map(mediaItem_);
  items.sort(function (a, b) { return a.at < b.at ? 1 : -1; });
  var folder = ensureDriveFolder_(MEDIA_FOLDER);
  return {items: items, folderUrl: folder && folder.getUrl ? folder.getUrl() : '', limits: {image: MEDIA_IMG_MAX, video: MEDIA_VID_MAX}};
}

/* files: [{name, type, data (base64), w, h, thumb (small JPEG data URL, images only)}], at most 10 per call. */
function api_mediaUpload_(files) {
  var user = guard_();
  if (!Array.isArray(files) || !files.length || files.length > 10) throw new Error('1 bis 10 Dateien auswählen.');
  var folder = ensureDriveFolder_(MEDIA_FOLDER);
  if (!folder) throw new Error('Google Drive ist nicht erreichbar.');
  var sh = tab_(MEDIA_TAB, MEDIA_COLS), saved = 0, skipped = [];
  var stamp = Utilities.formatDate(new Date(), 'Europe/Berlin', 'yyyy-MM-dd');
  files.forEach(function (f, i) {
    f = f || {};
    var type = String(f.type || ''), isImg = MEDIA_IMG.indexOf(type) >= 0, isVid = MEDIA_VID.indexOf(type) >= 0;
    var data = String(f.data || '').replace(/^data:[^,]*,/, '');
    var label = String(f.name || 'Datei ' + (i + 1)).slice(0, 80);
    if (!isImg && !isVid) { skipped.push(label + ' (Format)'); return; }
    if (!data || data.length > (isImg ? MEDIA_IMG_MAX : MEDIA_VID_MAX) * 4 / 3) { skipped.push(label + ' (zu groß)'); return; }
    var name = mediaSlug_(f.name) + '-' + stamp + '.' + MEDIA_EXT[type];
    var file = folder.createFile(Utilities.newBlob(Utilities.base64Decode(data), type, name));
    var thumb = isImg ? String(f.thumb || '') : '';
    if (!/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]{100,40000}$/.test(thumb)) thumb = '';
    var dim = function (v) { v = Math.round(Number(v)); return v > 0 && v < 20000 ? v : ''; };
    sh.appendRow([file.getId(), name, type, dim(f.w), dim(f.h), file.getSize(), new Date(), user, thumb]);
    saved++;
  });
  if (!saved) throw new Error('Keine Datei gespeichert: ' + skipped.join(', ') + '. Erlaubt: JPG, PNG, WebP bis 8 MB; MP4, WebM, MOV bis 25 MB.');
  sheet_(TAB.audit).appendRow([new Date(), user, MEDIA_TAB, '—', '', saved + ' Datei(en) in die Mediathek geladen']);
  var out = api_mediaList_();
  out.saved = saved; out.skipped = skipped;
  return out;
}

/* Moves the file to the Drive bin (recoverable for 30 days) unless a page still shows it. */
function api_mediaDelete_(id) {
  var user = guard_();
  id = String(id || '');
  var sh = tab_(MEDIA_TAB, MEDIA_COLS), rows = tabRows_(MEDIA_TAB, MEDIA_COLS), at = -1;
  rows.forEach(function (r, i) { if (String(r[0]) === id) at = i; });
  if (!id || at < 0) throw new Error('Datei nicht gefunden.');
  var used = pageRows_().filter(function (p) { return p.photos.some(function (ph) { return ph.id === id; }); }).map(function (p) { return p.path; });
  if (used.length) throw new Error('Die Datei wird noch auf ' + used.join(', ') + ' gezeigt. Dort zuerst entfernen.');
  try { if (typeof DriveApp.getFileById === 'function') DriveApp.getFileById(id).setTrashed(true); } catch (err) { console.error(err); }
  sh.deleteRow(at + 2);
  sheet_(TAB.audit).appendRow([new Date(), user, MEDIA_TAB, id, rows[at][1], 'Aus der Mediathek gelöscht (Drive-Papierkorb)']);
  return api_mediaList_();
}

/* ---------- pages ---------- */
function pageRows_() {
  return tabRows_(PAGES_TAB, PAGE_COLS).filter(function (r) { return r[0]; }).map(function (r) {
    var photos = [];
    try { photos = JSON.parse(String(r[5] || '[]')); } catch (err) { photos = []; }
    if (!Array.isArray(photos)) photos = [];
    return {path: String(r[0]), title: String(r[1] || ''), metaDescription: String(r[2] || ''), h1: String(r[3] || ''), lede: String(r[4] || ''),
      photos: photos.filter(function (p) { return p && p.id; }).map(function (p) { return {id: String(p.id), alt: String(p.alt || '')}; }),
      at: iso_(r[6]), by: String(r[7] || '')};
  });
}
function api_pages_() {
  guard_();
  var pages = {};
  pageRows_().forEach(function (p) { pages[p.path] = p; });
  return {pages: pages, version: String(config_('pages_version') || ''), dirty: String(config_('pages_dirty')) === 'ja'};
}
/* Plain text only: no markup, no line breaks, no leading formula characters. */
function pageText_(v, max, label) {
  var s = String(v == null ? '' : v).replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
  if (s.length > max) throw new Error(label + ': höchstens ' + max + ' Zeichen (jetzt ' + s.length + ').');
  return cell_(s, max);
}
/* Saves one page. Empty fields mean "use the built-in text"; a page with nothing set loses its row. */
function api_pageSave_(path, p) {
  var user = guard_();
  path = String(path || ''); p = p || {};
  if (!PAGE_PATH.test(path)) throw new Error('Unbekannte Seite: ' + path);
  var vals = {};
  Object.keys(PAGE_TEXT).forEach(function (k) { vals[k] = pageText_(p[k], PAGE_TEXT[k][1], PAGE_TEXT[k][0]); });
  var images = {};
  tabRows_(MEDIA_TAB, MEDIA_COLS).forEach(function (r) { if (MEDIA_IMG.indexOf(String(r[2])) >= 0) images[String(r[0])] = true; });
  var list = Array.isArray(p.photos) ? p.photos : [];
  if (list.length > PAGE_PHOTOS_MAX) throw new Error('Höchstens ' + PAGE_PHOTOS_MAX + ' Fotos pro Seite.');
  var seen = {}, photos = list.map(function (ph, i) {
    var id = String(ph && ph.id || ''), alt = pageText_(ph && ph.alt, 140, 'Bildbeschreibung ' + (i + 1));
    if (!images[id]) throw new Error('Foto ' + (i + 1) + ' ist nicht (mehr) in der Mediathek.');
    if (seen[id]) throw new Error('Foto ' + (i + 1) + ' ist doppelt gewählt.');
    if (String(alt).length < 5) throw new Error('Foto ' + (i + 1) + ': bitte kurz beschreiben, was zu sehen ist (für Google und Vorleseprogramme).');
    seen[id] = true;
    return {id: id, alt: String(alt)};
  });
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = tab_(PAGES_TAB, PAGE_COLS), rows = tabRows_(PAGES_TAB, PAGE_COLS), at = -1;
    rows.forEach(function (r, i) { if (String(r[0]) === path) at = i; });
    var empty = !photos.length && Object.keys(vals).every(function (k) { return !vals[k]; });
    var row = [path, vals.title, vals.metaDescription, vals.h1, vals.lede, JSON.stringify(photos), new Date(), user];
    if (empty) { if (at >= 0) sh.deleteRow(at + 2); }
    else if (at >= 0) sh.getRange(at + 2, 1, 1, PAGE_COLS.length).setValues([row]);
    else sh.appendRow(row);
    setConfig_('pages_dirty', 'ja');
    sheet_(TAB.audit).appendRow([new Date(), user, PAGES_TAB, path, '', empty ? 'Auf Standard zurückgesetzt' : 'Seite gespeichert (' + photos.length + ' Fotos)']);
  } finally { lock.releaseLock(); }
  return api_pages_();
}

/* ---------- publish ---------- */
function gh_(token, method, url, body) {
  var opt = {method: method, muteHttpExceptions: true,
    headers: {Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28'}};
  if (body) { opt.contentType = 'application/json'; opt.payload = JSON.stringify(body); }
  var res = UrlFetchApp.fetch(url, opt), code = res.getResponseCode(), text = res.getContentText();
  return {code: code, data: text ? JSON.parse(text) : null, text: text};
}
function ghOk_(r, what) {
  if (r.code >= 300) throw new Error('GitHub ' + r.code + ' bei „' + what + '“: ' + String(r.text).slice(0, 200));
  return r.data;
}
function api_pagesPublish_() {
  var user = guard_();
  var props = PropertiesService.getScriptProperties();
  var repo = props.getProperty('GITHUB_REPO') || config_('github_repo') || 'avaisqarni365/SOS24';
  var token = props.getProperty('GITHUB_TOKEN') || config_('github_token');
  var branch = props.getProperty('GITHUB_BRANCH') || 'main';
  if (!token) throw new Error('Veröffentlichen ist noch nicht eingerichtet: GITHUB_TOKEN fehlt in den Skripteigenschaften.');
  var api = 'https://api.github.com/repos/' + repo;

  var media = {};
  tabRows_(MEDIA_TAB, MEDIA_COLS).forEach(function (r) { if (r[0]) media[String(r[0])] = mediaItem_(r); });
  var version = Utilities.formatDate(new Date(), 'Europe/Berlin', 'yyyy.MM.dd-HHmm');
  var out = {version: version, pages: {}}, wanted = {};
  pageRows_().forEach(function (p) {
    var entry = {};
    Object.keys(PAGE_TEXT).forEach(function (k) { if (p[k]) entry[k] = p[k]; });
    var photos = p.photos.map(function (ph) {
      var m = media[ph.id];
      if (!m || MEDIA_IMG.indexOf(m.type) < 0) return null;
      var file = ph.id + '.' + MEDIA_EXT[m.type];
      wanted[file] = ph.id;
      return {src: '/media/' + file, alt: ph.alt, w: m.w, h: m.h};
    }).filter(Boolean);
    if (photos.length) entry.photos = photos;
    if (Object.keys(entry).length) out.pages[p.path] = entry;
  });

  // photos already in the repository are not sent again
  var have = {}, dir = gh_(token, 'get', api + '/contents/public/media?ref=' + encodeURIComponent(branch));
  if (dir.code === 200 && Array.isArray(dir.data)) dir.data.forEach(function (f) { have[f.name] = true; });

  var blob = function (base64, what) { return ghOk_(gh_(token, 'post', api + '/git/blobs', {content: base64, encoding: 'base64'}), what).sha; };
  var tree = [], sent = 0;
  Object.keys(wanted).forEach(function (file) {
    if (have[file]) return;
    var bytes = DriveApp.getFileById(wanted[file]).getBlob().getBytes();
    tree.push({path: 'public/media/' + file, mode: '100644', type: 'blob', sha: blob(Utilities.base64Encode(bytes), file)});
    sent++;
  });
  var json = JSON.stringify(out, null, 2) + '\n';
  tree.push({path: 'public/data/pages.json', mode: '100644', type: 'blob', sha: blob(Utilities.base64Encode(json, Utilities.Charset.UTF_8), 'pages.json')});

  var head = ghOk_(gh_(token, 'get', api + '/git/ref/heads/' + branch), 'Stand lesen').object.sha;
  var base = ghOk_(gh_(token, 'get', api + '/git/commits/' + head), 'Stand lesen').tree.sha;
  var newTree = ghOk_(gh_(token, 'post', api + '/git/trees', {base_tree: base, tree: tree}), 'Dateien anlegen').sha;
  var pages = Object.keys(out.pages).length;
  var commit = ghOk_(gh_(token, 'post', api + '/git/commits', {
    message: 'content(admin): Seiteninhalte ' + version + ' (' + pages + ' Seiten, ' + sent + ' neue Fotos)',
    tree: newTree, parents: [head]}), 'Änderung anlegen').sha;
  ghOk_(gh_(token, 'patch', api + '/git/refs/heads/' + branch, {sha: commit}), 'Veröffentlichen');

  setConfig_('pages_version', version);
  setConfig_('pages_dirty', 'nein');
  sheet_(TAB.audit).appendRow([new Date(), user, PAGES_TAB, '—', '', 'Veröffentlicht auf GitHub (' + repo + '): ' + version + ', ' + pages + ' Seiten, ' + sent + ' neue Fotos']);
  return {ok: true, version: version, pages: pages, photos: sent, actions: 'https://github.com/' + repo + '/actions'};
}
