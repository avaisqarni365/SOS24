/**
 * SOS Abdichtung (sos-abdichtung.de / sod-abdichtung.de) – Google Sheet Website API (Phase 1–3).
 *
 * The Google Sheet is the relational database and back office; this script is its public & internal API:
 *   POST {action:'lead'}      website ContactForm, QuoteCalculator or AI Chatbot inquiry -> Anfragen + Positionen + E-Mail
 *   POST {action:'quick'}     short inquiry form -> Anfragen + E-Mail
 *   POST {action:'photos'}    base64 damage photos -> "SOS Abdichtung - Schadensfotos / <Anfrage-ID>/" in Google Drive + E-Mail
 *   POST {action:'booking'}   or {action:'book'} on-site moisture inspection -> Termine + Google Calendar + .ics E-Mail
 *   POST {action:'sign'}      or {action:'accept'} digital contract signature -> "SOS Abdichtung - Verträge" in Drive + status Gebucht
 *   POST {action:'chat'}      AI Diagnostic & Waterproofing Advisor (Gemini + local expert knowledge)
 *   GET  ?action=health       health check & version
 *   GET  ?action=slots        free inspection slots
 *   GET  ?action=portal       customer portal data by token
 */

function ss_() { return SpreadsheetApp.getActive(); }

/* ------------------------------------------------------------------ web app */

function doGet(e) {
  var p = (e && e.parameter) || {};
  try {
    if (p.action === 'health') {
      return json(p.pdf ? {ok: true, pdf: pdfCheck_()} : {
        ok: true,
        service: 'sos-abdichtung',
        version: masterVersion_(),
        warm: PropertiesService.getScriptProperties().getProperty('WARM_TRIGGER') === '1'
      });
    }
    if (p.action === 'draft') return json(loadDraft_(String(p.ref || ''), String(p.token || '')));
    if (p.action === 'portal') return json(portal_(String(p.id || ''), String(p.k || '')));
    if (p.action === 'slots') return json(slots_(String(p.type || 'all')));
    return json({ok: false, error: 'unknown_action'});
  } catch (err) {
    console.error(err);
    return json({ok: false, error: 'server'});
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return json({ok: false, error: 'empty'});
    var big = e.postData.contents.length > 100000;
    if (big && (e.postData.contents.slice(0, 60).indexOf('"photos"') < 0 || e.postData.contents.length > PHOTO_MAX_BODY)) {
      return json({ok: false, error: 'too_large'});
    }
    if (!rateLimit_()) return json({ok: false, error: 'busy'});
    var body = JSON.parse(e.postData.contents);
    switch (body.action) {
      case 'lead': return json(saveLead_(body));
      case 'quick': return json(saveQuick_(body));
      case 'photos': return json(photos_(body));
      case 'book':
      case 'booking': return json(book_(body));
      case 'accept':
      case 'sign': return json(accept_(String(body.id || ''), String(body.k || ''), body.confirm !== false, body.sig || body.signature, body.signer || body.name));
      case 'route': return json(route_(String(body.from || ''), String(body.to || '')));
      case 'routeMap':
      case 'diagCheck': return json(diagCheck_(body));
      case 'hit': return json(hit_(body));
      case 'saveDraft': return json(saveDraft_(body));
      case 'resend': return json(resend_(String(body.email || ''), String(body.lang || 'de')));
      case 'chat': return json(aiChat_(body));
      default: return json({ok: false, error: 'unknown_action'});
    }
  } catch (err) {
    console.error(err);
    return json({ok: false, error: 'server'});
  }
}

function pdfCheck_() {
  try { return HtmlService.createHtmlOutput('<p>SOS Abdichtung PDF Test</p>').getBlob().getAs('application/pdf').getBytes().length > 0; }
  catch (err) { return String(err).slice(0, 120); }
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function rateLimit_() {
  var cache = CacheService.getScriptCache(), key = 'rl_' + Math.floor(Date.now() / 60000);
  var n = Number(cache.get(key) || 0) + 1;
  cache.put(key, String(n), 120);
  return n <= 80;
}

/* ------------------------------------------------------------------ leads (action: 'lead') */

function saveLead_(b) {
  if (b.hp) return {ok: true, id: 'A-0000'};
  if (b.t !== undefined && !(Number(b.t) > 1200)) return {ok: false, error: 'too_fast'};
  if (b.consent === false) return {ok: false, error: 'consent'};

  // Support both flat website payloads and structured planner states
  var c = b.contact || {
    name: b.name,
    phone: b.phone,
    email: b.email,
    channel: b.channel || b.via || 'whatsapp',
    note: b.message || b.note || ''
  };
  var name = clip_(c.name, 80), phone = clip_(c.phone, 40), email = clip_(c.email, 120);
  if (!name || (!phone && !email)) return {ok: false, error: 'contact'};
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return {ok: false, error: 'email'};

  var s = b.state || {
    f1: {
      from: b.address || b.plz || b.place || '',
      to: b.damageType || b.service || 'Feuchte Wände / Horizontalsperre',
      km: b.area || b.qty || '',
      dateMode: b.date ? 'fixed' : 'flex',
      date: b.date || '',
      hh: 0
    },
    damage: {
      service: b.service || b.damageType || 'Feuchte Wände / Horizontalsperre',
      area: Number(b.area || b.qty || 15),
      unit: b.unit || 'm²',
      severity: b.severity || b.stateLevel || 'deutlich',
      wallThickness: Number(b.wallThickness || 36),
      plz: b.plz || '',
      place: b.place || ''
    },
    acc: {old: {floor: 0, lift: 0, park: 1}, 'new': {floor: 0, lift: 0, park: 0}},
    inv: b.inv || {},
    customs: b.customs || [],
    src: b.src || {page: b.page || 'website'}
  };

  var master = loadMaster_();
  var est = Estimator.estimate(s, master);
  var byId = {};
  master.items.forEach(function (it) { byId[it.id] = it; });

  var objAddr = clip_((s.f1 && s.f1.from) || b.plz || b.address || 'Raum Wuppertal', 200);
  var dmgType = clip_((s.damage && s.damage.service) || (s.f1 && s.f1.to) || b.damageType || 'Feuchteschaden / Abdichtung', 200);
  var areaVal = Number((s.damage && s.damage.area) || est.vol || 0);
  var areaUnit = clip_((s.damage && s.damage.unit) || (est.lfm > 0 ? 'lfm' : 'm²'), 12);
  var sevLabel = clip_((s.damage && s.damage.severity) || 'Deutlich', 40);

  var lock = LockService.getScriptLock(), rows = [];
  lock.waitLock(20000);
  var id, token;
  try {
    ensureLeadHeader_();
    id = nextId_();
    token = Utilities.getUuid().replace(/-/g, '');
    var now = new Date();
    var src = s.src || b.src || {};
    var srcTxt = [src.utm_source, src.utm_medium, src.utm_campaign, src.page].filter(Boolean).join(' / ') || src.ref || 'Website';
    var dateStr = moveDate_(s.f1);
    var msgText = clip_(c.note || b.message || '', 1000);

    sheet_(TAB.leads).appendRow([
      id, now, STATUS[0], 'Shahzad Mahmood', '', cell_(name, 80), cell_(phone, 40), cell_(email, 120), clip_(c.channel || 'whatsapp', 20),
      cell_(objAddr), cell_(dmgType), clip_(areaVal ? areaVal + ' ' + areaUnit : '', 20), areaVal || '', est.asmMin || '',
      dateStr, HH[(s.f1 && s.f1.hh) || 0] || 'Bestandsbau', cell_(sevLabel, 60), 'Messung vor Ort', 'nein', cell_(dmgType, 300),
      est.n || areaVal || 1, round_(est.volLow), round_(est.volHigh), Math.round(est.kgMin) + '–' + Math.round(est.kgMax) + ' kg Material',
      VEH_DE[est.vehicle] || 'Messfahrzeug', est.crew, round_(est.hours),
      {high: 'Hoch', medium: 'Mittel', low: 'Standard'}[est.conf] || 'Standard', master.version, cell_(srcTxt, 120), b.lang === 'en' ? 'EN' : 'DE',
      cell_(msgText, 1000), clip_(s.ref || '', 20), now, JSON.stringify(s).slice(0, 45000), cell_(dmgType, 120), '', token, '',
      'Eigentümer / Selbstzahler', ''
    ]);

    Object.keys(s.inv || {}).forEach(function (iid) {
      var e = s.inv[iid], it = byId[iid];
      if (!it || !e || !e.by) return;
      Object.keys(e.by).forEach(function (k) {
        var n = Math.max(0, Math.min(999, Number(e.by[k]) || 0));
        if (!n) return;
        var v = Estimator.itemVol(it, e.vi);
        rows.push([id, iid, it.de, it.vars ? it.vars[e.vi || 0].l : '', n, SRC_DE[k] || k, v, round_(n * v, 2)]);
      });
    });
    (s.customs || []).forEach(function (cu) {
      var n = Math.max(1, Math.min(999, Number(cu.n) || 1)), v = Math.max(0, Number(cu.v) || 1);
      rows.push([id, 'custom', cell_(cu.name, 60), '', n, SRC_DE.custom, round_(v, 2), round_(n * v, 2)]);
    });
    if (rows.length) {
      var sh = sheet_(TAB.items);
      sh.getRange(sh.getLastRow() + 1, 1, rows.length, ITEM_COLS.length).setValues(rows);
    }
  } finally {
    lock.releaseLock();
  }

  notifyOffice_(id, name, phone, email, objAddr, dmgType, areaVal + ' ' + areaUnit, sevLabel, dateStr, c.note || b.message || '', est);
  return {ok: true, id: id, token: token, up: photoToken_(id)};
}

/* Short form handler (action: 'quick') */
function saveQuick_(b) {
  var f = b.form || b;
  return saveLead_({
    hp: b.hp,
    t: b.t || 5000,
    consent: b.consent !== false,
    name: f.name,
    phone: f.phone,
    email: f.email,
    plz: f.plz || f.from,
    address: f.address || f.from || f.plz,
    damageType: SERVICE_DE[f.service] || f.damageType || f.service || 'Feuchte Wände & Horizontalsperre',
    area: f.area || f.rooms || 15,
    date: f.date || 'flexibel',
    message: f.message || '',
    channel: f.channel || 'whatsapp',
    lang: b.lang || 'de',
    src: b.src || {ref: 'Kurzformular'}
  });
}

function notifyOffice_(id, name, phone, email, objAddr, dmgType, areaStr, sevLabel, dateStr, note, est) {
  var to = config_('notify_email') || Session.getEffectiveUser().getEmail();
  if (!to) return;
  var url = '';
  try { url = SpreadsheetApp.getActive().getUrl(); } catch (e) {}
  var body = [
    'Neue Sanierungsanfrage ' + id + ' über sos-abdichtung.de', '',
    'Kunde: ' + name,
    'Telefon / WhatsApp: ' + (phone || '—'),
    'E-Mail: ' + (email || '—'),
    'Objekt / PLZ: ' + (objAddr || '—'),
    'Schadensbild: ' + (dmgType || '—'),
    'Umfang / Fläche: ' + (areaStr || '—') + ' (Zustand: ' + (sevLabel || 'Deutlich') + ')',
    'Wunschtermin: ' + (dateStr || 'flexibel'),
    est ? ('Kalkulation: ca. ' + round_(est.hours) + ' Std. Arbeitszeit, ' + est.crew + ' Techniker, ca. ' + Math.round(est.kgMin) + '–' + Math.round(est.kgMax) + ' kg Material') : '',
    note ? ('\nNachricht des Kunden:\n' + clip_(note, 1000)) : '',
    '',
    adminLink_(id),
    url ? ('Google Sheet: ' + url) : ''
  ].filter(Boolean).join('\n');
  try {
    MailApp.sendEmail({
      to: to,
      subject: 'Neue Anfrage ' + id + ' – ' + dmgType + ' – ' + name + ' (' + objAddr + ')',
      body: body
    });
  } catch (err) { console.error(err); }
}

/* ------------------------------------------------------------------ customer portal & digital signature (action: 'sign' / 'accept') */

function leadByToken_(id, k) {
  if (!id) return null;
  var hit = findLead_(id);
  if (!hit) return null;
  var stored = String(hit.values[leadCol_('Kundentoken') - 1] || '');
  if (k && stored && stored !== k) {
    var rawUp = CacheService.getScriptCache().get('up_' + id);
    var upTok = rawUp ? JSON.parse(rawUp) : null;
    if (!upTok || upTok.k !== String(k)) return null;
  }
  return hit;
}

function portal_(id, k) {
  var hit = leadByToken_(id, k);
  if (!hit) return {ok: false, error: 'not_found'};
  var v = hit.values, g = function (n) { return v[leadCol_(n) - 1]; };
  var q = latestQuote_(id), lines = [];
  if (q) q.lines.forEach(function (l) { var a = Math.round(l[2] * l[4] * 100) / 100; if (a >= 0) lines.push({pos: l[0], basis: l[1], amount: a}); });
  var name = String(g('Name') || '');
  var jsonMeta = {};
  try { jsonMeta = JSON.parse(v[JSON_COL - 1] || '{}'); } catch (e) {}
  var contract = jsonMeta.contract || null;
  return {
    ok: true, id: id, name: name, service: String(g('Leistung') || 'Kellersanierung'),
    status: String(g('Status') || STATUS[0]), date: day_(g('Termin')), from: String(g('Von') || ''), to: String(g('Nach') || ''),
    lang: String(g('Sprache') || 'DE'), quoteSent: iso_(g('Angebot gesendet')),
    quote: q ? {version: q.version, lines: lines, total: Number(g('Angebot €')) || quoteTotal_(q.lines, rates_().min_price)} : null,
    signedAt: contract ? contract.signedAt : null,
    signer: contract ? contract.signer : null,
    signature: contract ? (contract.sigData || contract.sigUrl || contract.sigDriveUrl) : null
  };
}

/* Digital contract signature (action: 'sign' or 'accept') */
function accept_(id, k, confirm, sig, signer) {
  if (!confirm) return {ok: false, error: 'confirm'};
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  var hit, res, sigUrl = '';
  try {
    hit = leadByToken_(id, k);
    if (!hit) return {ok: false, error: 'not_found'};
    var status = String(hit.values[leadCol_('Status') - 1]);
    if (status === 'Gebucht' || status === 'Erledigt') return {ok: true, already: true, status: status};
    if (status === 'Verloren') return {ok: false, error: 'closed'};

    var now = new Date(), nowIso = iso_(now), nowDe = Utilities.formatDate(now, 'Europe/Berlin', 'dd.MM.yyyy HH:mm');
    var signerName = clip_(signer || hit.values[leadCol_('Name') - 1] || 'Kunde', 80);

    if (sig && typeof DriveApp !== 'undefined') {
      try {
        var base64Data = String(sig).replace(/^data:image\/\w+;base64,/, '');
        var bytes = Utilities.base64Decode(base64Data);
        var folder = ensureDriveFolder_('SOS Abdichtung - Verträge');
        if (folder) {
          var file = folder.createFile(Utilities.newBlob(bytes, 'image/png', id + '-unterschrift.png'));
          sigUrl = file.getUrl();
        }
      } catch (err) { console.error('Drive save signature err:', err); }
    }

    sheet_(TAB.leads).getRange(hit.row, leadCol_('Status')).setValue('Gebucht');
    var colNote = leadCol_('Notizen'), oldNote = String(hit.values[colNote - 1] || '');
    var signNote = 'Sanierungsauftrag digital gezeichnet von ' + signerName + ' am ' + nowDe + ' Uhr' + (sigUrl ? ' (Drive: ' + sigUrl + ')' : '');
    sheet_(TAB.leads).getRange(hit.row, colNote).setValue(cell_((oldNote ? oldNote + '\n' : '') + signNote, 2000));

    var jsonMeta = {};
    try { jsonMeta = JSON.parse(hit.values[JSON_COL - 1] || '{}'); } catch (e) {}
    jsonMeta.contract = {
      signed: true,
      signedAt: nowIso,
      signer: signerName,
      sigUrl: sigUrl,
      sigDriveUrl: sigUrl,
      sigData: sig ? String(sig).slice(0, 80000) : ''
    };
    sheet_(TAB.leads).getRange(hit.row, JSON_COL).setValue(JSON.stringify(jsonMeta));

    sheet_(TAB.audit).appendRow([now, 'Kunde (' + signerName + ')', TAB.leads, id + ' · Status', status, 'Gebucht – digital unterschrieben']);
    res = {ok: true, status: 'Gebucht', signedAt: nowIso, signer: signerName, signature: sig || sigUrl, sigDriveUrl: sigUrl};
  } finally { lock.releaseLock(); }

  var to = config_('notify_email') || Session.getEffectiveUser().getEmail();
  if (to) {
    var v = hit.values;
    try {
      MailApp.sendEmail({
        to: to,
        subject: 'Sanierungsauftrag erteilt (digital signiert): ' + id + ' – ' + (res.signer || ''),
        body: 'Der Kunde hat das Angebot ' + id + ' rechtsverbindlich digital unterzeichnet.\n\n' +
          'Name: ' + res.signer + '\n' +
          'Telefon: ' + (v[leadCol_('Telefon') - 1] || '—') + '\n' +
          'E-Mail: ' + (v[leadCol_('E-Mail') - 1] || '—') + '\n' +
          'Angebot: ' + (v[leadCol_('Angebot €') - 1] || '—') + ' €' +
          (sigUrl ? '\nUnterschrift in Google Drive: ' + sigUrl : '') +
          '\n\n' + adminLink_(id) + '\n' + ss_().getUrl()
      });
    } catch (err) { console.error(err); }
  }

  var custEmail = String(hit.values[leadCol_('E-Mail') - 1] || '');
  if (custEmail) {
    try {
      MailApp.sendEmail({
        to: custEmail,
        name: 'SOS Abdichtung – Shahzad Mahmood',
        subject: 'Auftragsbestätigung ' + id + ' – SOS Abdichtung (SchimmelPeter® Partnerbetrieb)',
        body: 'Guten Tag ' + res.signer + ',\n\nvielen Dank für Ihr Vertrauen! Ihr Auftrag zur Anfrage ' + id + ' wurde erfolgreich digital unterzeichnet und verbindlich gebucht.\n\n' +
          'Vereinbarter Festpreis: ' + (hit.values[leadCol_('Angebot €') - 1] || 'laut Angebot') + ' €\n' +
          'Herr Shahzad Mahmood setzt sich zur finalen Terminabstimmung persönlich mit Ihnen in Verbindung.\n\n' +
          'Mit freundlichen Grüßen\nShahzad Mahmood\nsos-abdichtung · Niebuhrstraße 46 · 45144 Essen · Telefon & WhatsApp: +49 172 2064177'
      });
    } catch (err) { console.error('Cust email send err:', err); }
  }

  return res;
}

function resend_(email, lang) {
  email = clip_(email, 120).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return {ok: false, error: 'email'};
  var cache = CacheService.getScriptCache(), ck = 'rs_' + Utilities.base64EncodeWebSafe(email);
  if (cache.get(ck)) return {ok: true};
  cache.put(ck, '1', 600);
  var portal = String(config_('portal_url') || (DEFAULT_SITE + '/kontakt/'));
  var sh = sheet_(TAB.leads), n = sh.getLastRow(), links = [];
  if (n >= 2) {
    sh.getRange(2, 1, n - 1, LEAD_COLS.length).getValues().forEach(function (v) {
      var tok = String(v[leadCol_('Kundentoken') - 1] || '');
      if (tok && String(v[leadCol_('E-Mail') - 1]).toLowerCase() === email) links.push(v[0] + ': ' + portal + '?id=' + encodeURIComponent(v[0]) + '&k=' + tok);
    });
  }
  if (links.length) {
    try {
      MailApp.sendEmail({
        to: email,
        subject: 'Ihr Zugangslink – SOS Abdichtung',
        body: 'Hier ist Ihr persönlicher Link zu Ihrem Angebot und Auftragsstatus bei SOS Abdichtung:\n\n' + links.join('\n') +
          '\n\nFragen? Telefon und WhatsApp +49 172 2064177.\nsos-abdichtung · Shahzad Mahmood'
      });
    } catch (err) { console.error(err); }
  }
  return {ok: true};
}

/* ------------------------------------------------------------------ route & diagnostic checks (Strecken tab) */

function route_(from, to) {
  from = clip_(from || '45144 Essen', 200); to = clip_(to || '42103 Wuppertal', 200);
  if (from.length < 3 || to.length < 3) return {ok: false, error: 'address'};
  var cache = CacheService.getScriptCache();
  var key = 'rt_' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, from + '|' + to));
  var hit = cache.get(key);
  if (hit) return JSON.parse(hit);
  var res;
  try {
    var d = Maps.newDirectionFinder().setOrigin(from).setDestination(to).setMode(Maps.DirectionFinder.Mode.DRIVING)
      .setRegion('de').setLanguage('de').getDirections();
    if (d && d.routes && d.routes.length) {
      var leg = d.routes[0].legs[0];
      res = {ok: true, km: Math.round(leg.distance.value / 1000), min: Math.round(leg.duration.value / 60)};
    } else res = {ok: false, error: 'not_found'};
  } catch (err) {
    res = {ok: true, km: 22, min: 25};
  }
  cache.put(key, JSON.stringify(res), 21600);
  return res;
}

/* Logs diagnostic calculator & PLZ checks into the Strecken tab */
function diagCheck_(b) {
  var now = new Date();
  var plzPlace = clip_(b.from || b.plz || b.place || '42103 Wuppertal', 80);
  var dmg = clip_(b.to || b.service || b.damageType || 'Kellersanierung', 80);
  var area = Number(b.km || b.area || b.qty || 15);
  var sev = clip_(b.severity || 'deutlich', 40);
  try {
    var sh = ss_().getSheetByName(TAB.routes) || ensureTab_(TAB.routes, ROUTE_COLS, [130, 160, 160, 70, 90, 160, 70, 140]);
    sh.appendRow([now, cell_(plzPlace, 80), cell_(dmg, 80), area, cell_(sev, 40), cell_(b.page || '/kostenrechner/', 80), b.lang === 'en' ? 'EN' : 'DE', cell_(b.src || 'Rechner', 80)]);
  } catch (err) { console.error(err); }
  return {ok: true, place: plzPlace, service: dmg, area: area};
}

/* ------------------------------------------------------------------ drafts */

function saveDraft_(b) {
  if (b.consent === false) return {ok: false, error: 'consent'};
  var s = b.state;
  if (!s || typeof s !== 'object' || !s.ref) return {ok: false, error: 'state'};
  var ref = clip_(s.ref, 20), token = clip_(b.token, 40);
  var sh = sheet_(TAB.drafts), data = sh.getDataRange().getValues();
  var now = new Date(), until = new Date(now.getTime() + 30 * 864e5), payload = JSON.stringify(s).slice(0, 45000);
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === ref && token && data[i][1] === token) {
      sh.getRange(i + 1, 3, 1, 3).setValues([[now, until, payload]]);
      return {ok: true, token: token, until: until.toISOString()};
    }
  }
  token = Utilities.getUuid().replace(/-/g, '');
  sh.appendRow([ref, token, now, until, payload]);
  return {ok: true, token: token, until: until.toISOString()};
}

function loadDraft_(ref, token) {
  if (!ref || !token) return {ok: false, error: 'missing'};
  var data = sheet_(TAB.drafts).getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === ref && data[i][1] === token) {
      if (new Date(data[i][3]) < new Date()) return {ok: false, error: 'expired'};
      return {ok: true, state: JSON.parse(data[i][4])};
    }
  }
  return {ok: false, error: 'not_found'};
}

function loadMaster_() {
  var cache = CacheService.getScriptCache(), hit = cache.get('master');
  if (hit) return JSON.parse(hit);
  var shCat = ss_().getSheetByName(TAB.catalog);
  if (!shCat || shCat.getLastRow() < 2) seedDefaultCatalog_();
  var m = masterFromSheet_();
  try { cache.put('master', JSON.stringify(m), 3600); } catch (err) {}
  return m;
}

function seedDefaultCatalog_() {
  var sh = ensureTab_(TAB.catalog, CAT_COLS, [110, 110, 210, 190, 200]);
  if (sh.getLastRow() < 2) {
    sh.getRange(2, 1, DEFAULT_CATALOG.length, CAT_COLS.length).setValues(DEFAULT_CATALOG);
  }
  var shSet = ensureTab_(TAB.settings, ['Schlüssel', 'Wert', 'Bedeutung']);
  if (shSet.getLastRow() < 2) {
    var settings = [
      ['buffer', 0.1, 'Sicherheitszuschlag auf Zeit/Material (10 %)'],
      ['range_high', 0.08, 'Preisspanne bei exaktem Aufmaß (±8 %)'],
      ['range_medium', 0.15, 'Preisspanne bei Standardangaben (±15 %)'],
      ['range_low', 0.25, 'Preisspanne bei Fernschätzung (±25 %)'],
      ['default_km', 15, 'Standard-Anfahrt Raum Wuppertal in km']
    ];
    shSet.getRange(2, 1, settings.length, 3).setValues(settings);
  }
  setConfig_('master_version', '2026.10');
}

function quoteSelectedLead() {
  var ui = SpreadsheetApp.getUi(), sh = SpreadsheetApp.getActiveSheet();
  if (sh.getName() !== TAB.leads || sh.getActiveRange().getRow() < 2) { ui.alert('Bitte eine Zeile im Tab „' + TAB.leads + '“ markieren.'); return; }
  var vals = sh.getRange(sh.getActiveRange().getRow(), 1, 1, LEAD_COLS.length).getValues()[0];
  var id = vals[0], s = null;
  try { s = JSON.parse(vals[JSON_COL - 1] || '{}'); } catch (err) {}
  var master = loadMaster_(), R = rates_(), q = quoteLines_(s, vals, master, R);
  var res = writeQuote_(id, q.lines, master.version, R);
  if (vals[leadCol_('Status') - 1] === STATUS[0]) sh.getRange(sh.getActiveRange().getRow(), leadCol_('Status')).setValue(STATUS[1]);
  ui.alert('Angebot ' + id + ' v' + res.version, 'Summe: ' + Math.round(res.total) + ' €.\nSätze und Mengen können im Tab „' + TAB.quotes + '“ oder im Admin-Bereich angepasst werden.', ui.ButtonSet.OK);
}

function publishCatalog() {
  var ui = SpreadsheetApp.getUi();
  try {
    var user = Session.getActiveUser().getEmail() || 'Tabelle';
    var res = publishCatalogCore_(user, ui);
    ui.alert('Veröffentlicht: Version ' + res.version + '. Die Website wird in wenigen Minuten aktualisiert.');
  } catch (err) {
    if (!ui) throw err;
  }
}

/* ------------------------------------------------------------------ setup, menu, triggers */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('SOS Abdichtung')
    .addItem('Angebot für markierte Anfrage berechnen', 'quoteSelectedLead')
    .addItem('Leistungen & Preise auf Website veröffentlichen', 'publishCatalog')
    .addSeparator()
    .addItem('Einrichten (Tabs, Startdaten, Trigger)', 'setup')
    .addToUi();
}

function setup() {
  var ss = SpreadsheetApp.getActive();
  ensureTab_(TAB.leads, LEAD_COLS, [70, 130, 110, 120, 90, 140, 120, 170, 90, 180, 200]);
  ensureTab_(TAB.items, ITEM_COLS);
  ensureTab_(TAB.quotes, QUOTE_COLS);
  ensureTab_(TAB.catalog, CAT_COLS, [110, 110, 210, 190, 200]);
  ensureTab_(TAB.settings, ['Schlüssel', 'Wert', 'Bedeutung']);
  ensureTab_(TAB.rates, ['Schlüssel', 'Bezeichnung', 'Wert', 'Einheit', 'Gültig ab']);
  ensureTab_(TAB.audit, AUDIT_COLS);
  ensureTab_(TAB.drafts, DRAFT_COLS);
  ensureTab_(TAB.config, ['Schlüssel', 'Wert']);
  ensureTab_(TAB.routes, ROUTE_COLS, [130, 160, 160, 70, 90, 160, 70, 140]);
  ensureTab_(TAB.appts, APPT_COLS, [70, 130, 90, 180, 90, 60, 70, 150, 120, 170, 220]);
  ensureTab_(TAB.visits, VISIT_COLS, [90, 220, 140, 90, 70, 70, 70]);
  ensureTab_(TAB.docs || 'Belege', DOC_COLS);
  usersSheet_();

  var leads = sheet_(TAB.leads);
  var statusRule = SpreadsheetApp.newDataValidation().requireValueInList(STATUS, true).build();
  leads.getRange(2, 3, leads.getMaxRows() - 1, 1).setDataValidation(statusRule);
  leads.getRange(2, 2, leads.getMaxRows() - 1, 1).setNumberFormat('dd.MM.yyyy HH:mm');
  var colors = {'Neu': '#d1fae5', 'In Arbeit': '#fef3c7', 'Angebot raus': '#e0f2fe', 'Gebucht': '#bbf7d0', 'Verloren': '#f3f4f6'};
  leads.setConditionalFormatRules(Object.keys(colors).map(function (k) {
    return SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(k).setBackground(colors[k]).setRanges([leads.getRange('C2:C')]).build();
  }));
  leads.hideColumns(JSON_COL);

  var rates = sheet_(TAB.rates);
  if (rates.getLastRow() < 2) {
    var today = Utilities.formatDate(new Date(), 'Europe/Berlin', 'dd.MM.yyyy');
    rates.getRange(2, 1, DEFAULT_RATES.length, 5).setValues(DEFAULT_RATES.map(function (r) { return [r[0], r[1], r[2], r[3], today]; }));
  }
  seedDefaultCatalog_();

  // Default admin user for owner Shahzad Mahmood if none exists
  var ush = usersSheet_();
  if (ush.getLastRow() < 2) {
    ush.appendRow(['shahzad', 'Shahzad Mahmood', 'ja', '', '', '', '']);
    setUserPw_(ush, 2, 'SOS2026!Wuppertal');
  }

  var me = Session.getEffectiveUser().getEmail() || 'simplypizza2020@gmail.com';
  ['notify_email', 'firma_email'].forEach(function (k) {
    if (OLD_EMAILS.indexOf(String(config_(k)).toLowerCase()) >= 0) setConfig_(k, 'simplypizza2020@gmail.com');
  });
  setConfig_('notify_email', config_('notify_email') || 'simplypizza2020@gmail.com' || me);
  setConfig_('github_repo', config_('github_repo') || 'avaisqarni365/SOS24');

  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('onEditAudit').forSpreadsheet(ss).onEdit().create();
  ScriptApp.newTrigger('daily').timeBased().everyDays(1).atHour(7).create();
  ScriptApp.newTrigger('warmSlots').timeBased().everyMinutes(10).create();
  PropertiesService.getScriptProperties().setProperty('WARM_TRIGGER', '1');
  try {
    SpreadsheetApp.getUi().alert('SOS Abdichtung Backend eingerichtet. Nächster Schritt: Bereitstellen als Web-App.');
  } catch (e) {}
}

function ensureTab_(name, cols, widths) {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold').setBackground('#0b251c').setFontColor('#f3f2f2');
    sh.setFrozenRows(1);
    (widths || []).forEach(function (w, i) { sh.setColumnWidth(i + 1, w); });
  }
  return sh;
}

function onEditAudit(e) {
  var sh = e.range.getSheet(), name = sh.getName();
  if (name === TAB.users) {
    var pc = USER_COLS.indexOf('Neues Passwort') + 1;
    if (e.range.getColumn() <= pc && e.range.getLastColumn() >= pc) {
      for (var r = Math.max(2, e.range.getRow()); r <= e.range.getLastRow(); r++) {
        var v = sh.getRange(r, pc).getValue();
        if (v !== '') { var err = setUserPw_(sh, r, v); if (err) sh.getRange(r, pc).setNote(err); }
      }
    }
    return;
  }
  if ([TAB.catalog, TAB.settings, TAB.rates].indexOf(name) < 0) return;
  sheet_(TAB.audit).appendRow([new Date(), (e.user && e.user.getEmail()) || Session.getActiveUser().getEmail() || '?', name,
    e.range.getA1Notation(), e.oldValue == null ? '' : e.oldValue, e.value == null ? '(mehrere Zellen)' : e.value]);
  if (name !== TAB.rates) CacheService.getScriptCache().remove('master');
}

function daily() {
  var drafts = sheet_(TAB.drafts), data = drafts.getDataRange().getValues(), now = new Date();
  for (var i = data.length - 1; i >= 1; i--) { if (data[i][3] && new Date(data[i][3]) < now) drafts.deleteRow(i + 1); }
  try { flushHits(); } catch (err) { console.error(err); }
  var leads = sheet_(TAB.leads).getDataRange().getValues().slice(1), open = [];
  leads.forEach(function (r) {
    var age = (now - new Date(r[1])) / 864e5;
    if ((r[2] === 'Neu' && age > 1) || (r[2] === 'Angebot raus' && age > 3)) open.push(r[0] + ' · ' + r[2] + ' · ' + r[5] + ' · seit ' + Math.floor(age) + ' Tagen\n   ' + adminUrl_(r[0]));
  });
  var to = config_('notify_email');
  if (open.length && to) MailApp.sendEmail({to: to, subject: 'SOS Abdichtung: ' + open.length + ' offene Sanierungsanfragen', body: open.join('\n') + '\n\n' + SpreadsheetApp.getActive().getUrl()});
}

/* ------------------------------------------------------------------ AI Chatbot (Gemini & Intelligent Waterproofing Advisor) */
function aiChat_(b) {
  var lastMsg = Array.isArray(b.messages) && b.messages.length ? (b.messages[b.messages.length - 1].text || b.messages[b.messages.length - 1].content || '') : '';
  var msg = String(b.message || lastMsg || '').trim();
  if (!msg) return {ok: false, error: 'empty'};
  var lang = (b.lang === 'en' || (/^[a-zA-Z\s?!,.-]+$/.test(msg) && /\b(hello|hi|quote|price|mold|damp|basement|cellar|wall)\b/i.test(msg))) ? 'en' : 'de';
  var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY') || config_('gemini_api_key');

  if (apiKey) {
    try {
      var systemInstruction = "Du bist der digitale Bautenschutz- & Sanierungs-Experte von 'SOS Abdichtung' (Inhaber: Shahzad Mahmood, SchimmelPeter® Partnerbetrieb für Wuppertal, Solingen, Remscheid, Velbert, Essen & NRW, Telefon/WhatsApp: +49 172 2064177). " +
        "Fachgebiete: Kellersanierung ohne Aufgraben, Horizontalsperre im WTA-Injektionsverfahren (Silan-Siloxan / Paraffin-Kunststoff), Kellerinnenabdichtung (MDS & WTA-Sanierputz), Schimmelbeseitigung mit Taupunktmessung & Calciumsilikat-Klimaplatten, Hochdruck-Rissverpressung (PU/Epoxid). " +
        "Garantien: 10 Jahre Ausführungsgarantie von sos-abdichtung + 25 Jahre Produktgarantie der SchimmelPeter GmbH. Kostenlose Vor-Ort-Feuchtemessung mit schriftlichem Messprotokoll. " +
        "Antworte fachkundig, vertrauenswürdig und kompakt auf " + (lang === 'en' ? 'Englisch' : 'Deutsch') + ". " +
        "Biete dem Kunden immer an, die kostenlose Feuchtemessung vor Ort zu buchen, Schadensfotos hochzuladen oder Herrn Mahmood direkt per WhatsApp (+49 172 2064177) zu kontaktieren.";

      var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + encodeURIComponent(apiKey);
      var payload = {
        contents: [{ role: 'user', parts: [{ text: systemInstruction + "\n\nKundenfrage: " + msg }] }],
        generationConfig: { maxOutputTokens: 400, temperature: 0.65 }
      };
      var res = UrlFetchApp.fetch(url, {
        method: 'post', contentType: 'application/json', payload: JSON.stringify(payload), muteHttpExceptions: true
      });
      if (res.getResponseCode() === 200) {
        var jsonRes = JSON.parse(res.getContentText());
        var candidate = jsonRes.candidates && jsonRes.candidates[0];
        if (candidate && candidate.content && candidate.content.parts && candidate.content.parts[0]) {
          return {
            ok: true,
            reply: candidate.content.parts[0].text,
            action: 'gemini',
            ownerPhone: '491722064177'
          };
        }
      }
    } catch (err) {
      console.error('Gemini API fallback:', err);
    }
  }

  var lower = msg.toLowerCase();
  var reply = '', actionType = 'info', quick = [];

  if (/horizontal|aufsteigend|kapillar|wand|salz|putz/i.test(lower)) {
    reply = "Aufsteigende Feuchtigkeit und Salzausblühungen stoppen wir dauerhaft mit einer neuen Horizontalsperre im WTA-Injektionsverfahren – komplett von innen und ohne Aufgraben des Gartens.\n\nRichtwert: ca. 120–160 € pro laufendem Meter (abzüglich 20 % § 35a Steuerbonus auf den Lohnanteil). Wollen wir eine kostenlose Feuchtemessung vor Ort vereinbaren?";
    actionType = 'appointment';
    quick = ['Kostenlose Messung buchen', 'Schadensfoto hochladen', 'WhatsApp an Herrn Mahmood'];
  } else if (/keller|nass|hangwasser|drückend|innenabdichtung/i.test(lower)) {
    reply = "Bei nassen Kellerwänden und seitlich eindringender Feuchte kombinieren wir druckwasserdichte Hohlkehlen, 2-lagige mineralische Dichtungsschlämmen (MDS) und diffusionsoffenen WTA-Sanierputz.\n\nSie erhalten 10 Jahre Garantie auf unsere Arbeit und 25 Jahre SchimmelPeter® Produktgarantie.";
    actionType = 'appointment';
    quick = ['Vor-Ort-Messung buchen', 'Fläche kalkulieren', 'WhatsApp Beratung'];
  } else if (/schimmel|sporen|geruch|taupunkt|wohnzimmer|schlafzimmer/i.test(lower)) {
    reply = "Bei Schimmelbefall messen wir zuerst elektronisch die Bauteilfeuchte und den Taupunkt. Anschließend entfernen wir die Sporen chlorfrei und schützen Wärmebrücken mit kapillaraktiven Calciumsilikat-Klimaplatten.";
    actionType = 'appointment';
    quick = ['Schimmel-Check buchen', 'Foto vom Befall senden', 'WhatsApp an Herrn Mahmood'];
  } else if (/riss|beton|wasserführend|verpressung|packer/i.test(lower)) {
    reply = "Wasserführende Risse in Betonkellern oder Bodenplatten verschließen wir kraft- oder dehnfähig per Hochdruck-Injektion mit 2K-Polyurethanharz (PU) über gesetzte Stahlpacker.";
    actionType = 'appointment';
    quick = ['Riss-Analyse anfragen', 'Foto hochladen', 'Direkt anrufen'];
  } else if (/kosten|preis|teuer|angebot|m2|meter/i.test(lower)) {
    reply = "Durch die Sanierung von innen sparen Sie bis zu 60 % gegenüber teuren Bagger- und Erdarbeiten. Die Vor-Ort-Feuchtemessung im Raum Wuppertal & NRW ist für Sie 100 % kostenlos – danach erhalten Sie ein verbindliches Festpreisangebot inkl. § 35a EStG Steuervorteil.";
    actionType = 'whatsapp';
    quick = ['Schnellkalkulation starten', 'Termin zur Messung', 'WhatsApp an Herrn Mahmood'];
  } else {
    reply = "Guten Tag! Ich bin Ihr digitaler Sanierungs-Berater von SOS Abdichtung (SchimmelPeter® Partnerbetrieb). Sie können hier sofort eine Schadens-Kalkulation durchführen, Fotos Ihrer Wand hochladen oder eine kostenlose Feuchtemessung mit Herrn Shahzad Mahmood buchen.";
    quick = ['Feuchte Kellerwand', 'Schimmelbefall', 'Kosten & Richtpreise', 'Messung buchen'];
  }

  return {ok: true, reply: reply, action: actionType, quickReplies: quick, ownerPhone: '491722064177'};
}
