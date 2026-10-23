/**
 * SOS Abdichtung – Website API Part 2:
 *   - Appointment booking for free on-site moisture inspections (Vor-Ort-Feuchtemessung)
 *   - Base64 customer damage photo uploads -> Google Drive ("SOS Abdichtung - Schadensfotos / <Anfrage-ID>/")
 *   - Inspection Pre-Agreement PDF (Mess- & Besichtigungsvereinbarung)
 *   - Anonymous cookie-free traffic counting
 */

var SLOT_TTL = 900;

function slots_(type) {
  type = type || 'all';
  if (type !== 'all' && !APPT_TYPES[type]) return {ok: false, error: 'type'};
  ensureWarm_();
  var cache = CacheService.getScriptCache(), key = 'slots_' + type, hit = cache.get(key);
  if (hit) return JSON.parse(hit);
  var res = computeSlots_(type);
  cache.put(key, JSON.stringify(res), SLOT_TTL);
  return res;
}

function computeSlots_(type) {
  if (type !== 'all') return {ok: true, type: type, min: APPT_TYPES[type].min, days: freeSlots_(type, 21)};
  var base = slotBase_(false), types = {};
  Object.keys(APPT_TYPES).forEach(function (k) { types[k] = {min: APPT_TYPES[k].min, days: freeSlots_(k, 21, null, base)}; });
  return {ok: true, type: 'all', types: types};
}

function clearSlots_() {
  var cache = CacheService.getScriptCache();
  cache.removeAll(['slots_all'].concat(Object.keys(APPT_TYPES).map(function (k) { return 'slots_' + k; })));
  try { cache.put('slots_all', JSON.stringify(computeSlots_('all')), SLOT_TTL); } catch (err) { console.error(err); }
}

function warmSlots() {
  var h = Number(Utilities.formatDate(new Date(), 'Europe/Berlin', 'H'));
  if (h < 6 || h >= 22) return;
  CacheService.getScriptCache().put('slots_all', JSON.stringify(computeSlots_('all')), SLOT_TTL);
}

function ensureWarm_() {
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty('WARM_TRIGGER') === '1') return;
  try {
    var has = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === 'warmSlots'; });
    if (!has) ScriptApp.newTrigger('warmSlots').timeBased().everyMinutes(10).create();
    props.setProperty('WARM_TRIGGER', '1');
  } catch (err) { console.error(err); }
}

/* ------------------------------------------------------------------ Damage Photos Upload (action: 'photos')
   Saves customer damage photos directly to Google Drive:
   "SOS Abdichtung - Schadensfotos / <Anfrage-ID>/" and sends an alert email with attachments & Drive link. */

var PHOTO_MAX = 10, PHOTO_MAX_BYTES = 2500000, PHOTO_MAX_BODY = 16000000, PHOTO_TYPES = {'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp'};

function photoToken_(id) {
  var cache = CacheService.getScriptCache();
  var raw = cache.get('up_' + id);
  if (raw) {
    try { var parsed = JSON.parse(raw); if (parsed && parsed.k) return parsed.k; } catch (e) {}
  }
  var hit = findLead_(id);
  var k = (hit && hit.values && hit.values[leadCol_('Kundentoken') - 1]) ? String(hit.values[leadCol_('Kundentoken') - 1]) : Utilities.getUuid().replace(/-/g, '');
  cache.put('up_' + id, JSON.stringify({k: k, n: 0}), 7200);
  return k;
}

function photos_(b) {
  var id = String(b.id || '');
  var cache = CacheService.getScriptCache(), raw = cache.get('up_' + id), tok = raw ? JSON.parse(raw) : null;
  var k = String(b.k || '');
  if (!/^A-\d+$/.test(id) || !k || !leadByToken_(id, k)) return {ok: false, error: 'token'};
  // keep the running count, so the PHOTO_MAX limit holds across tokens
  tok = {k: k, n: tok ? Number(tok.n) || 0 : 0};
  var list = Array.isArray(b.images) ? b.images : [];
  if (!list.length) return {ok: false, error: 'empty'};
  if (tok.n + list.length > PHOTO_MAX) return {ok: false, error: 'too_many'};

  var blobs = [];
  for (var i = 0; i < list.length; i++) {
    var im = list[i] || {}, mime = im.type || 'image/jpeg', ext = PHOTO_TYPES[mime];
    var data = String(im.data || '').replace(/^data:image\/\w+;base64,/, '');
    if (!ext || !data || data.length > PHOTO_MAX_BYTES * 4 / 3 + 4) return {ok: false, error: 'file'};
    var bytes;
    try { bytes = Utilities.base64Decode(data); } catch (err) { return {ok: false, error: 'file'}; }
    blobs.push(Utilities.newBlob(bytes, mime, id + '-schadensfoto-' + (tok.n + i + 1) + '.' + ext));
  }
  tok.n += blobs.length;
  cache.put('up_' + id, JSON.stringify(tok), 7200);

  var driveFolderUrl = '';
  if (typeof DriveApp !== 'undefined') {
    try {
      var rootFolder = ensureDriveFolder_('SOS Abdichtung - Kundenfotos') || ensureDriveFolder_('SOS Abdichtung - Schadensfotos');
      if (rootFolder) {
        var leadFolder = ensureDriveFolder_(id, rootFolder);
        if (leadFolder) {
          for (var fi = 0; fi < blobs.length; fi++) {
            leadFolder.createFile(blobs[fi]);
          }
          driveFolderUrl = leadFolder.getUrl();
        }
      }
    } catch (err) { console.error('Drive photo upload error:', err); }
  }

  var note = clip_(b.note, 300), hit = findLead_(id), name = hit ? hit.values[LEAD_COLS.indexOf('Name')] : '';
  if (hit) {
    var col = LEAD_COLS.indexOf('Notizen') + 1, old = String(hit.values[col - 1] || '');
    var driveText = driveFolderUrl ? ' (Google Drive: ' + driveFolderUrl + ')' : '';
    sheet_(TAB.leads).getRange(hit.row, col).setValue(cell_((old ? old + '\n' : '') + 'Schadensfotos: ' + tok.n + ' per E-Mail erhalten' + (driveFolderUrl ? ' und in Google Drive gespeichert' + driveText : '') + (note ? ' – ' + note : ''), 2000));
  }

  var to = config_('notify_email') || Session.getEffectiveUser().getEmail();
  if (to) {
    try {
      MailApp.sendEmail({
        to: to,
        subject: 'Schadensfotos zu Anfrage ' + id + (name ? ' – ' + name : '') + ' (' + blobs.length + ')',
        body: [
          blobs.length + ' Schadensfoto(s) zur Sanierungsanfrage ' + id + ' über sos-abdichtung.de hochgeladen.',
          driveFolderUrl ? 'Google Drive Ordner (Originalauflösung): ' + driveFolderUrl : '',
          note ? 'Hinweis des Kunden: ' + note : '',
          '',
          adminLink_(id),
          'Tabelle: ' + SpreadsheetApp.getActive().getUrl()
        ].filter(Boolean).join('\n'),
        attachments: blobs
      });
    } catch (err) { console.error(err); return {ok: false, error: 'mail'}; }
  }
  return {ok: true, n: tok.n, driveUrl: driveFolderUrl};
}

/* ------------------------------------------------------------------ Appointment Booking (action: 'booking' / 'book') */

function nextApptNr_() {
  var props = PropertiesService.getScriptProperties();
  var n = Number(props.getProperty('NEXT_APPT') || 1001);
  props.setProperty('NEXT_APPT', String(n + 1));
  return 'T-' + n;
}

function book_(b) {
  if (b.hp) return {ok: true, nr: 'T-0000'};
  if (b.t !== undefined && !(Number(b.t) > 1000)) return {ok: false, error: 'too_fast'};
  if (b.consent === false) return {ok: false, error: 'consent'};

  var p = b.booking || b.appt || b;
  var type = String(p.type || b.type || 'visit');
  var T = APPT_TYPES[type] || APPT_TYPES.visit;
  var date = String(p.date || b.date || ''), time = String(p.time || b.time || '10:00');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    var free = freeSlots_(type, 14);
    var firstDay = free.filter(function (d) { return d.slots && d.slots.length > 0; })[0];
    if (!firstDay) return {ok: false, error: 'slot'};
    date = firstDay.date;
    time = firstDay.slots[0] || '10:00';
  }
  if (!/^\d{2}:\d{2}$/.test(time)) time = '10:00';

  var name = clip_(p.name || b.name, 80), phone = clip_(p.phone || b.phone, 40), email = clip_(p.email || b.email, 120);
  var address = clip_(p.address || p.plz || b.address || b.plz || 'Raum Wuppertal', 200);
  var damageType = clip_(p.damageType || p.to || p.service || b.damageType || 'Feuchtemessung vor Ort', 200);
  if (!name || (!phone && !email)) return {ok: false, error: 'contact'};
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return {ok: false, error: 'email'};
  if (!contactLimit_('book', email, phone)) return {ok: false, error: 'limit'};

  var en = (p.lang || b.lang) === 'en', src = p.src || b.src || {};
  var srcTxt = [src.utm_source, src.utm_medium, src.utm_campaign].filter(Boolean).join(' / ') || src.ref || 'Website-Terminbuchung';

  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  var a, leadId, token, calId = '';
  try {
    // only a free slot, checked under the lock so two visitors cannot take the same one
    var day = freeSlots_(type, 21).filter(function (d) { return d.date === date; })[0];
    if (!day || day.slots.indexOf(time) < 0) return {ok: false, error: 'slot'};

    ensureLeadHeader_();
    // a booking joins an existing lead only when the caller proves it owns that lead
    var reqLead = String(p.leadId || b.leadId || ''), reqK = String(p.k || b.k || '');
    var existingHit = /^A-\d+$/.test(reqLead) ? leadByToken_(reqLead, reqK) : null;
    leadId = existingHit ? reqLead : nextId_();
    token = Utilities.getUuid().replace(/-/g, '');
    a = {
      nr: nextApptNr_(), status: 'Gebucht', type: type, date: date, time: time, min: T.min,
      name: name, phone: phone, email: email, address: address, to: damageType,
      message: clip_(p.message || p.note || b.message || b.note, 1000), lead: leadId, lang: en ? 'EN' : 'DE', source: srcTxt,
      meetUrl: type === 'video' ? 'https://meet.google.com/new' : ''
    };

    if (typeof CalendarApp !== 'undefined') {
      try {
        var startDt = apptStart_(a);
        var endDt = new Date(startDt.getTime() + T.min * 60000);
        var ev = CalendarApp.getDefaultCalendar().createEvent(
          'SOS Abdichtung · ' + T.de + ' – ' + name + ' (' + a.nr + ')',
          startDt,
          endDt,
          {location: address, description: 'Anfrage: ' + leadId + '\nTelefon: ' + phone + '\nE-Mail: ' + email + '\nSchadensart: ' + damageType + (a.message ? '\nNotiz: ' + a.message : '')}
        );
        if (ev && ev.getId) calId = ev.getId();
      } catch (calErr) { console.error('Calendar sync optional:', calErr); }
    }

    if (!existingHit) {
      var row = [], set = function (col, v) { row[LEAD_COLS.indexOf(col)] = v; };
      LEAD_COLS.forEach(function () { row.push(''); });
      set('ID', leadId); set('Eingang', new Date()); set('Status', STATUS[0]); set('Zuständig', 'Shahzad Mahmood');
      set('Name', cell_(name, 80)); set('Telefon', cell_(phone, 40)); set('E-Mail', cell_(email, 120));
      set('Kontaktweg', type === 'call' ? 'Telefon' : 'Terminbuchung');
      set('Von', cell_(address)); set('Nach', cell_(damageType)); set('Termin', date);
      set('Quelle', cell_(srcTxt, 120)); set('Sprache', en ? 'EN' : 'DE'); set('Nachricht', cell_(a.message, 1000));
      set('Einwilligung', new Date()); set('Leistung', damageType); set('Kundentoken', token);
      set('Notizen', 'Termin ' + a.nr + ': ' + T.de + ' am ' + dayDeLong_(date) + ', ' + time + ' Uhr');
      set('Daten (JSON)', JSON.stringify({appointment: a.nr, src: src}));
      sheet_(TAB.leads).appendRow(row);
    }

    var sh = ss_().getSheetByName(TAB.appts) || ensureTab_(TAB.appts, APPT_COLS, [70, 130, 90, 180, 90, 60, 70, 150, 120, 170, 220]);
    sh.appendRow([a.nr, new Date(), a.status, T.de, "'" + date, "'" + time, T.min, cell_(name, 80), cell_(phone, 40), cell_(email, 120), cell_(address),
      cell_(damageType), cell_(a.message, 1000), leadId, a.lang, cell_(srcTxt, 120), calId, '']);
  } finally { lock.releaseLock(); }

  apptMails_(a, 'booked');
  clearSlots_();
  return {ok: true, nr: a.nr, lead: leadId, up: photoToken_(leadId), type: type, date: date, time: time, min: T.min, calId: calId};
}

/* ------------------------------------------------------------------ Traffic (cookie-free) */

function hit_(b) {
  var p = String(b.p || '/').slice(0, 80);
  if (p.charAt(0) !== '/' || /[<>"]/.test(p)) return {ok: false};
  var s = cell_(String(b.s || 'Direkt').replace(/\|/g, ' '), 40), d = ['Handy', 'Tablet', 'Computer'].indexOf(b.d) >= 0 ? b.d : 'Computer', l = b.l === 'en' ? 'EN' : 'DE';
  var day = Utilities.formatDate(new Date(), 'Europe/Berlin', 'yyyy-MM-dd'), key = [day, p, s, d, l].join('|');
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(3000)) return {ok: false};
  try {
    var cache = CacheService.getScriptCache(), raw = cache.get('hits'), buf = raw ? JSON.parse(raw) : {since: Date.now(), rows: {}};
    var r = buf.rows[key] = buf.rows[key] || [0, 0];
    r[0]++; if (b.e) r[1]++;
    if (Date.now() - buf.since > 10 * 60000 || Object.keys(buf.rows).length > 150) { writeHits_(buf); buf = {since: Date.now(), rows: {}}; }
    cache.put('hits', JSON.stringify(buf), 21600);
  } finally { lock.releaseLock(); }
  return {ok: true};
}

function writeHits_(buf) {
  var keys = Object.keys(buf.rows || {});
  if (!keys.length) return;
  var sh = ss_().getSheetByName(TAB.visits) || ensureTab_(TAB.visits, VISIT_COLS, [90, 220, 140, 90, 70, 70, 70]);
  sh.getRange(sh.getLastRow() + 1, 1, keys.length, VISIT_COLS.length).setValues(keys.map(function (k) {
    var f = k.split('|'); return ["'" + f[0], f[1], f[2], f[3], f[4], buf.rows[k][0], buf.rows[k][1]];
  }));
}

function flushHits() {
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var cache = CacheService.getScriptCache(), raw = cache.get('hits');
    if (raw) { writeHits_(JSON.parse(raw)); cache.remove('hits'); }
  } finally { lock.releaseLock(); }
}
