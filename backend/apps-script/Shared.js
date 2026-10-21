/**
 * SOS Abdichtung (sos-abdichtung.de / sod-abdichtung.de) – Shared constants, Google Sheets schemas,
 * Google Drive folder hierarchy, Google Calendar sync, and GitHub 1-Click publishing logic.
 * Shared across backend/apps-script (Website API) and backend/admin-script (Admin Portal).
 */

var OLD_EMAILS = ['info.stabilumzug@gmail.com', 'info@stabilumzug.de'];

var TAB = {
  leads: 'Anfragen',
  items: 'Positionen',
  quotes: 'Angebote',
  catalog: 'Katalog',
  settings: 'Regeln',
  rates: 'Preise',
  audit: 'Protokoll',
  drafts: 'Entwürfe',
  config: 'Konfiguration',
  routes: 'Strecken',
  appts: 'Termine',
  visits: 'Besuche',
  users: 'Benutzer',
  docs: 'Belege'
};

var DOC_COLS = ['Nr', 'Art', 'Status', 'Anfrage', 'Datum', 'Kunde', 'Netto €', 'USt €', 'Brutto €', 'Fällig', 'Bezahlt am', 'Bezahlt €', 'PDF', 'Erstellt von', 'Geändert', 'Bezug', 'Daten (JSON)'];

var USER_COLS = ['Benutzername', 'Name', 'Aktiv', 'Neues Passwort', 'Passwort (verschlüsselt)', 'Salt', 'Letzte Anmeldung'];
var PW_MIN = 8;
var DEFAULT_SITE = 'https://sos-abdichtung.de';
var STATUS = ['Neu', 'In Arbeit', 'Angebot raus', 'Gebucht', 'Erledigt', 'Verloren'];

var LEAD_COLS = [
  'ID', 'Eingang', 'Status', 'Zuständig', 'Angebot €', 'Name', 'Telefon', 'E-Mail', 'Kontaktweg', 'Von', 'Nach',
  'km (Familie)', 'km (Maps)', 'Fahrzeit min', 'Termin', 'Haushalt', 'Zugang Auszug', 'Zugang Einzug', 'Halteverbot', 'Räume',
  'Anzahl', 'Volumen min m³', 'Volumen max m³', 'Gewicht kg', 'Fahrzeug', 'Team', 'Stunden', 'Vertrauen', 'Stammdaten',
  'Quelle', 'Sprache', 'Nachricht', 'Referenz', 'Einwilligung', 'Daten (JSON)', 'Leistung', 'Notizen', 'Kundentoken', 'Angebot gesendet',
  'Kostenträger', 'Vorvereinbarung'
];

var PAYERS = ['Eigentümer / Selbstzahler', 'Hausverwaltung / WEG', 'Versicherung', 'Vermieter / Bauträger', 'Andere'];
var JSON_COL = LEAD_COLS.indexOf('Daten (JSON)') + 1;

var SERVICE_DE = {
  'horizontalsperre': 'Feuchte Wände & Horizontalsperre',
  'feuchte-waende': 'Feuchte Wände & Horizontalsperre',
  'kellersanierung': 'Kellersanierung & Innenabdichtung',
  'kellerinnenabdichtung': 'Kellerinnenabdichtung (MDS)',
  'schimmelbeseitigung': 'Schimmelbeseitigung & Analyse',
  'rissverpressung': 'Rissverpressung & Fugenabdichtung',
  'feuchtemessung': 'Kostenlose Feuchtemessung vor Ort',
  'dachabdichtung': 'Dach- & Balkonabdichtung',
  'sockelabdichtung': 'Sockelabdichtung',
  'other': 'Bautenschutz & Abdichtung'
};

var ITEM_COLS = ['Anfrage', 'item_id', 'Leistung / Material', 'Variante / Wandstärke', 'Menge', 'Herkunft', 'Zeitfaktor', 'Gesamt'];
var QUOTE_COLS = ['Anfrage', 'Version', 'Erstellt', 'Stammdaten', 'Position', 'Basis', 'Menge', 'Einheit', 'Satz €', 'Betrag €'];
var CAT_COLS = ['item_id', 'Variante', 'Name DE', 'Name EN', 'Suchwörter', 'Bereich', 'Faktor', 'Material min kg', 'Material max kg', 'Vorbereitung min', 'Nacharbeit min', 'Techniker', 'Garantie', 'Aktiv'];
var AUDIT_COLS = ['Zeit', 'Nutzer', 'Tab', 'Zelle', 'Alt', 'Neu'];
var DRAFT_COLS = ['Referenz', 'Token', 'Gespeichert', 'Läuft ab', 'Daten (JSON)'];
var ROUTE_COLS = ['Zeit', 'Objektort (PLZ Ort)', 'Schadensart', 'Fläche/m', 'Dringlichkeit', 'Seite', 'Sprache', 'Quelle'];
var APPT_COLS = ['Nr', 'Eingang', 'Status', 'Art', 'Datum', 'Uhrzeit', 'Dauer min', 'Name', 'Telefon', 'E-Mail', 'Adresse', 'Schadensbild',
  'Nachricht', 'Anfrage', 'Sprache', 'Quelle', 'Kalender', 'Notiz'];
var APPT_STATUS = ['Gebucht', 'Bestätigt', 'Verschoben', 'Erledigt', 'Abgesagt'];
var APPT_TYPES = {
  visit: {de: 'Vor-Ort-Feuchtigkeitsmessung', en: 'On-site moisture inspection', min: 60},
  video: {de: 'Video-Ersteinschätzung (Google Meet / WhatsApp)', en: 'Video inspection', min: 30},
  call: {de: 'Telefonische Fachberatung', en: 'Expert phone consultation', min: 30}
};
var VISIT_COLS = ['Datum', 'Seite', 'Quelle', 'Gerät', 'Sprache', 'Aufrufe', 'Einstiege'];

var APPT_HOURS_DEFAULT = {1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18], 6: [9, 14]};
function apptHours_() {
  var v = config_('termin_zeiten');
  try { var o = JSON.parse(v); if (o && typeof o === 'object') return o; } catch (err) {}
  return APPT_HOURS_DEFAULT;
}
function apptBlocked_() { return String(config_('termin_gesperrt') || '').split(/[\s,;]+/).filter(function (d) { return /^\d{4}-\d{2}-\d{2}$/.test(d); }); }
function apptType_(label) { for (var k in APPT_TYPES) if (APPT_TYPES[k].de === String(label) || k === String(label)) return k; return String(label); }
function hhmm_(min) { return ('0' + Math.floor(min / 60)).slice(-2) + ':' + ('0' + (min % 60)).slice(-2); }

function allAppts_() {
  var sh = ss_().getSheetByName(TAB.appts);
  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, APPT_COLS.length).getValues().filter(function (v) { return v[0]; }).map(function (v, i) {
    var g = function (n) { return v[APPT_COLS.indexOf(n)]; };
    var time = g('Uhrzeit') instanceof Date ? Utilities.formatDate(g('Uhrzeit'), 'Europe/Berlin', 'HH:mm') : String(g('Uhrzeit')).replace(/^'/, '');
    return {
      row: i + 2, nr: String(g('Nr')), received: iso_(g('Eingang')), status: String(g('Status')), type: apptType_(g('Art')),
      date: String(day_(g('Datum'))).replace(/^'/, ''), time: time, min: Number(g('Dauer min')) || 60,
      name: String(g('Name')), phone: String(g('Telefon')), email: String(g('E-Mail')), address: String(g('Adresse')),
      to: String(g('Schadensbild')), message: String(g('Nachricht')), lead: String(g('Anfrage')), lang: String(g('Sprache') || 'DE'),
      source: String(g('Quelle')), calendar: String(g('Kalender') || ''), note: String(g('Notiz') || '')
    };
  });
}

function slotBase_(withMoveDays) {
  var b = {hours: apptHours_(), blocked: apptBlocked_(), taken: {}, moveDays: {}};
  allAppts_().forEach(function (a) {
    if (a.status === 'Abgesagt') return;
    var m = a.time.split(':'), s = Number(m[0]) * 60 + Number(m[1]);
    (b.taken[a.date] = b.taken[a.date] || []).push([s, s + a.min]);
  });
  if (withMoveDays) {
    var ls = ss_().getSheetByName(TAB.leads);
    if (ls && ls.getLastRow() > 1) ls.getRange(2, 1, ls.getLastRow() - 1, LEAD_COLS.length).getValues().forEach(function (v) {
      if (v[LEAD_COLS.indexOf('Status')] === 'Gebucht') b.moveDays[day_(v[LEAD_COLS.indexOf('Termin')])] = true;
    });
  }
  return b;
}

function freeSlots_(type, days, todayIso, base) {
  var T = APPT_TYPES[type] || APPT_TYPES.visit;
  base = base || slotBase_(false);
  var hours = base.hours, blocked = base.blocked, taken = base.taken;
  var out = [], startDay = new Date((todayIso || Utilities.formatDate(new Date(), 'Europe/Berlin', 'yyyy-MM-dd')) + 'T12:00:00');
  for (var i = 1; i <= (days || 21); i++) {
    var d = new Date(startDay.getTime() + i * 864e5), iso = Utilities.formatDate(d, 'Europe/Berlin', 'yyyy-MM-dd');
    var h = hours[d.getDay()] || hours[String(d.getDay())], slots = [];
    if (h && blocked.indexOf(iso) < 0) {
      for (var s = h[0] * 60; s + T.min <= h[1] * 60; s += 60) {
        var busy = (taken[iso] || []).some(function (r) { return s < r[1] && s + T.min > r[0]; });
        if (!busy) slots.push(hhmm_(s));
      }
    }
    out.push({date: iso, slots: slots});
  }
  return out;
}

function ics_(a, title, location, description) {
  var p = a.date.split('-'), t = a.time.split(':');
  var start = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]), Number(t[0]), Number(t[1])), end = new Date(start.getTime() + a.min * 60000);
  var z = function (d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); };
  var e = function (s) { return String(s || '').replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n'); };
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SOS Abdichtung//Termine//DE', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    'UID:' + a.nr + '@sos-abdichtung.de', 'DTSTAMP:' + z(new Date()), 'DTSTART:' + z(start), 'DTEND:' + z(end),
    'SUMMARY:' + e(title), 'LOCATION:' + e(location), 'DESCRIPTION:' + e(description), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}
function apptStart_(a) { var p = a.date.split('-'), t = a.time.split(':'); return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]), Number(t[0]), Number(t[1])); }
function dayDeLong_(iso) {
  var d = new Date(iso + 'T12:00:00'), wd = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][d.getDay()];
  return wd + ', ' + iso.slice(8, 10) + '.' + iso.slice(5, 7) + '.' + iso.slice(0, 4);
}

var FLOORS = ['Keller (UG)', 'Erdgeschoss (EG)', '1. OG / höher', 'Dach / Balkon'];
var LIFTS = ['Ziegelmauerwerk', 'Bruchstein / Schiefer', 'Beton / Hohlblock', 'Baustoff unklar'];
var PARKS = ['Leichte Feuchte / Flecken', 'Deutlich (Salz / Putz bröckelt)', 'Stark (stehendes / drückendes Wasser)', 'Unklar'];
var HH = ['Einfamilienhaus', 'Mehrfamilienhaus', 'Altbau (vor 1950)', 'Gewerbeobjekt'];
var SRC_DE = {pick: 'Kalkulator', custom: 'Sonderposition', list: 'Formular', photo: 'Schadensfoto', preset: 'Vorlage', guess: 'Schätzung'};
var ROOM_DE = {horizontal: 'Horizontalsperre', keller: 'Kellerwand', schimmel: 'Wohnraum / Schimmel', crack: 'Riss / Fuge', Measurement: 'Messung'};
var VEH_DE = {sprinter: 'Mess- & Injektionsfahrzeug', lkw75: 'Sanierungsteam-Transporter', lkw12: 'Großbaustellen-Einheit'};

/* Default rates for SOS Abdichtung in the "Preise" tab */
var DEFAULT_RATES = [
  ['hour', 'Facharbeiter / Techniker je Stunde (Lohnanteil § 35a)', 68, '€/h'],
  ['horizontalsperre_m', 'Horizontalsperre WTA-Injektion je lfm (bis 36 cm)', 135, '€/lfm'],
  ['innenabdichtung_qm', 'Kellerinnenabdichtung (MDS + Sanierputz) je m²', 115, '€/m²'],
  ['schimmel_qm', 'Sporensichere Schimmelbeseitigung & Schutz je m²', 78, '€/m²'],
  ['klimaplatte_qm', 'Calciumsilikat-Klimaplatte inkl. Montage je m²', 95, '€/m²'],
  ['riss_m', 'Hochdruck-Rissverpressung (PU / Epoxid) je lfm', 145, '€/lfm'],
  ['hohlkehle_m', 'Dichtkehle Wand-Sohlen-Anschluss je lfm', 48, '€/lfm'],
  ['anfahrt', 'Anfahrt & Baustelleneinrichtung (Raum Wuppertal / NRW)', 89, '€'],
  ['min_price', 'Mindestauftragswert Sanierung', 450, '€']
];

/* Default catalog of waterproofing services & materials */
var DEFAULT_CATALOG = [
  ['horiz-24', '24 cm Wandstärke', 'Horizontalsperre Injektionsverfahren', 'Horizontal barrier injection', 'horizontalsperre,feuchte wand,injektion,paraffin,silan', 'horizontal', 0.55, 1.4, 1.8, 15, 10, 1, 'ja', 'ja'],
  ['horiz-36', '36,5 cm Wandstärke', 'Horizontalsperre Injektionsverfahren', 'Horizontal barrier injection', 'horizontalsperre,feuchte wand,injektion', 'horizontal', 0.70, 2.0, 2.6, 20, 15, 1, 'ja', 'ja'],
  ['horiz-48', '48+ cm / Bruchstein', 'Horizontalsperre Injektionsverfahren', 'Horizontal barrier injection', 'horizontalsperre,bruchstein,altbau', 'horizontal', 0.95, 2.8, 3.6, 25, 20, 2, 'ja', 'ja'],
  ['mds-seal', '2-lagig', 'Mineralische Dichtungsschlämme (MDS)', 'Mineral waterproofing slurry', 'kellerinnenabdichtung,mds,dichtschlämme,nasser keller', 'keller', 0.45, 5.0, 6.5, 15, 15, 2, 'ja', 'ja'],
  ['wta-plaster', '20 mm Schicht', 'WTA-Sanierputzsystem (Porenputz)', 'WTA restoration plaster', 'sanierputz,putz,salzausblühung,wta', 'keller', 0.50, 18.0, 24.0, 20, 15, 2, 'ja', 'ja'],
  ['fillet-joint', 'Wand-Boden', 'Druckwasserdichte Hohlkehle ausbilden', 'Waterproof wall-floor fillet', 'hohlkehle,wand-boden,anschluss', 'keller', 0.35, 3.5, 4.5, 10, 10, 1, 'ja', 'ja'],
  ['old-plaster', 'inkl. Entsorgung', 'Altputz abschlagen & Fugen auskratzen', 'Remove damaged plaster', 'altputz,abschlagen,vorbereitung', 'keller', 0.40, 15.0, 25.0, 10, 10, 2, 'nein', 'ja'],
  ['mold-clean', 'Sporenfrei', 'Schimmelbeseitigung & Tiefendesinfektion', 'Spore-safe mold removal', 'schimmel,sporen,desinfektion,geruch', 'schimmel', 0.45, 0.5, 1.0, 15, 10, 1, 'ja', 'ja'],
  ['casi-board', '25–30 mm', 'Calciumsilikat-Klimaplatte montieren', 'Calcium silicate board installation', 'klimaplatte,calciumsilikat,wärmebrücke,taupunkt', 'schimmel', 0.65, 6.0, 8.0, 15, 15, 1, 'ja', 'ja'],
  ['crack-pu', 'Hochdruck inkl. Packer', 'Rissverpressung mit PU-Injektionsharz', 'High-pressure PU crack injection', 'riss,rissverpressung,packer,beton,wasserführend', 'crack', 0.75, 1.2, 1.8, 20, 15, 1, 'ja', 'ja'],
  ['cm-measure', 'Protokolliert', 'Feuchtemessung & Salzanalyse inkl. Messprotokoll', 'Moisture & salt analysis protocol', 'feuchtemessung,protokoll,nullmessung,cm-messung', 'all', 1.50, 0.1, 0.2, 15, 15, 1, 'ja', 'ja']
];

function clip_(s, n) { return String(s == null ? '' : s).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n || 200); }
function cell_(s, n) { s = clip_(s, n); return /^[=+\-@]/.test(s) ? "'" + s : s; }
function iso_(v) { return v instanceof Date ? v.toISOString() : (v == null ? '' : String(v)); }

function usersSheet_() {
  var s = ss_(), sh = s.getSheetByName(TAB.users);
  if (!sh) {
    sh = s.insertSheet(TAB.users);
    sh.getRange(1, 1, 1, USER_COLS.length).setValues([USER_COLS]).setFontWeight('bold').setBackground('#0b251c').setFontColor('#ffffff');
    sh.setFrozenRows(1);
    sh.getRange(1, USER_COLS.length + 2).setValue('Neuer Benutzer: Benutzername, Name, Aktiv = ja und ein Passwort (mind. ' + PW_MIN + ' Zeichen) unter „Neues Passwort“ eintragen.');
  }
  return sh;
}
function hashPw_(pass, salt) {
  var h = String(pass);
  for (var i = 0; i < 1000; i++) h = Utilities.base64Encode(Utilities.computeHmacSha256Signature(h, String(salt)));
  return h;
}
function setUserPw_(sh, row, plain) {
  plain = String(plain || '');
  var c = function (n) { return USER_COLS.indexOf(n) + 1; };
  sh.getRange(row, c('Neues Passwort')).setValue('');
  if (plain.length < PW_MIN) return 'Passwort zu kurz (mind. ' + PW_MIN + ' Zeichen) – bitte ein neues eintragen.';
  var salt = Utilities.getUuid().replace(/-/g, '');
  sh.getRange(row, c('Passwort (verschlüsselt)'), 1, 2).setValues([[hashPw_(plain, salt), salt]]);
  return '';
}

var ADMIN_URL = 'https://sos-abdichtung.de/admin/';
function adminUrl_(id) {
  var u = '';
  try { u = String(config_('admin_url') || ''); } catch (err) {}
  return (/^https:\/\//.test(u) ? u : ADMIN_URL) + (id ? '?a=' + encodeURIComponent(id) : '');
}
function adminLink_(id) { return 'Im Admin öffnen: ' + adminUrl_(id); }

function moveDate_(f1, long) {
  f1 = f1 || {};
  var ok = function (x) { return /^\d{4}-\d{2}-\d{2}$/.test(String(x || '')); }, de = function (x) { return x.split('-').reverse().join('.'); };
  if (f1.dateMode === 'fixed' && ok(f1.date)) return long ? de(f1.date) : f1.date;
  var a = ok(f1.dateFrom) ? f1.dateFrom : '', b = ok(f1.dateTo) ? f1.dateTo : '';
  if (a && b && b < a) { var x = a; a = b; b = x; }
  var w = a && b ? (long ? 'zwischen ' + de(a) + ' und ' + de(b) : de(a) + '–' + de(b)) : a ? 'ab ' + de(a) : b ? 'bis ' + de(b) : '';
  return long ? 'flexibel' + (w ? ', ' + w : ', nach Absprache') : 'flexibel' + (w ? ' ' + w : '');
}
function day_(v) { return v instanceof Date ? Utilities.formatDate(v, 'Europe/Berlin', 'yyyy-MM-dd') : (v == null ? '' : String(v)); }

function nextId_() {
  var props = PropertiesService.getScriptProperties();
  var n = Number(props.getProperty('NEXT_ID') || 1001);
  props.setProperty('NEXT_ID', String(n + 1));
  return 'A-' + n;
}
function de_(x, d) { return String(round_(x, d)).replace('.', ','); }
function round_(x, d) { var f = Math.pow(10, d == null ? 1 : d); return Math.round((Number(x) || 0) * f) / f; }
function sheet_(name) { var sh = ss_().getSheetByName(name); if (!sh) throw new Error('Tab fehlt: ' + name + ' – bitte „Einrichten“ ausführen.'); return sh; }

/* Company fields for SOS Abdichtung */
var COMPANY_FIELDS = [
  ['name', 'Firmenname', 'SOS Abdichtung (SchimmelPeter® Partnerbetrieb)'],
  ['owner', 'Inhaber', 'Shahzad Mahmood'],
  ['legal', 'Rechtsform', 'Einzelunternehmen'],
  ['street', 'Straße und Hausnummer', 'Niebuhrstraße 46'],
  ['city', 'PLZ und Ort', '45144 Essen (Servicegebiet Wuppertal & NRW)'],
  ['phone', 'Telefon & WhatsApp', '+49 172 2064177'],
  ['email', 'E-Mail', 'info@sos-abdichtung.de'],
  ['web', 'Website', 'www.sos-abdichtung.de'],
  ['vat_id', 'USt-IdNr.', ''],
  ['tax_no', 'Steuernummer', '111/5234/2984'],
  ['bank', 'Bank', 'Sparkasse'],
  ['iban', 'IBAN', 'DE89370501980000000000'],
  ['bic', 'BIC', ''],
  ['small', 'Kleinunternehmer nach § 19 UStG (ja/nein)', 'nein'],
  ['vat', 'Standard-USt-Satz %', 19],
  ['price_mode', 'Preise eingeben als (brutto/netto)', 'brutto'],
  ['pay_days', 'Zahlungsziel Tage', 14],
  ['offer_days', 'Angebot gültig Tage', 14],
  ['bcc', 'Kopie gesendeter Belege an (E-Mail)', '']
];

function company_() {
  var c = {}, all = {}, sh = ss_().getSheetByName(TAB.config);
  if (sh && sh.getLastRow() > 0) sh.getDataRange().getValues().slice(1).forEach(function (r) { if (r[0] !== '' && !(r[0] in all)) all[r[0]] = r[1]; });
  COMPANY_FIELDS.forEach(function (f) { var v = all['firma_' + f[0]]; c[f[0]] = v === '' || v == null ? f[2] : v; });
  c.small = /^(ja|yes|true|1)$/i.test(String(c.small));
  c.vat = Number(c.vat) || 0; c.pay_days = Number(c.pay_days) || 0; c.offer_days = Number(c.offer_days) || 0;
  c.price_mode = String(c.price_mode).toLowerCase() === 'netto' ? 'net' : 'gross';
  c.portalUrl = String(all['portal_url'] || (DEFAULT_SITE + '/mein-auftrag/'));
  return c;
}

function config_(key) {
  var sh = ss_().getSheetByName(TAB.config);
  if (!sh || sh.getLastRow() < 2) return '';
  var v = sh.getDataRange().getValues();
  for (var i = 1; i < v.length; i++) if (v[i][0] === key) return v[i][1];
  return '';
}
function setConfig_(key, value) {
  var sh = sheet_(TAB.config), v = sh.getDataRange().getValues();
  for (var i = 1; i < v.length; i++) if (v[i][0] === key) { sh.getRange(i + 1, 2).setValue(value); return; }
  sh.appendRow([key, value]);
}

function ensureLeadHeader_() {
  var sh = sheet_(TAB.leads), have = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0];
  if (have.length >= LEAD_COLS.length && have[LEAD_COLS.length - 1] === LEAD_COLS[LEAD_COLS.length - 1]) return;
  sh.getRange(1, 1, 1, LEAD_COLS.length).setValues([LEAD_COLS]).setFontWeight('bold').setBackground('#0b251c').setFontColor('#f3f2f2');
}

function leadCol_(name) { var i = LEAD_COLS.indexOf(name); if (i < 0) throw new Error('Spalte unbekannt: ' + name); return i + 1; }

function findLead_(id) {
  var sh = sheet_(TAB.leads);
  if (sh.getLastRow() < 2) return null;
  var ids = sh.getRange(1, 1, sh.getLastRow(), 1).getValues();
  for (var i = 1; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return {row: i + 1, values: sh.getRange(i + 1, 1, 1, LEAD_COLS.length).getValues()[0]};
  }
  return null;
}

function masterVersion_() { return String(config_('master_version') || '2026.10'); }

function masterFromSheet_() {
  var shCat = ss_().getSheetByName(TAB.catalog);
  var rows = (shCat && shCat.getLastRow() > 1) ? shCat.getDataRange().getValues().slice(1) : DEFAULT_CATALOG;
  var items = [], byId = {};
  rows.forEach(function (r) {
    var id = String(r[0] || '').trim();
    if (!id || String(r[13]).toLowerCase() === 'nein') return;
    var kg = [Number(r[7]) || 0, Number(r[8]) || 0], v = Number(r[6]) || 0, variant = String(r[1] || '').trim();
    var it = byId[id];
    if (!it) {
      it = {
        id: id, de: String(r[2]), en: String(r[3] || r[2]),
        syn: String(r[4] || '').split(',').map(function (x) { return x.trim().toLowerCase(); }).filter(String),
        room: String(r[5] || 'all'), dis: Number(r[9]) || 0, asm: Number(r[10]) || 0, crew: Number(r[11]) || 1
      };
      if (String(r[12]).toLowerCase() === 'ja') it.fragile = true;
      byId[id] = it; items.push(it);
    }
    if (variant) { (it.vars = it.vars || []).push({l: variant, v: v, kg: kg}); }
    else { it.v = v; it.kg = kg; }
  });
  return {
    version: masterVersion_(),
    rooms: ['horizontal', 'keller', 'schimmel', 'crack'],
    items: items,
    presets: {
      single: {'horiz-36': [12, 0], 'cm-measure': [1, 0]},
      couple: {'horiz-36': [18, 0], 'wta-plaster': [25, 0], 'old-plaster': [25, 0], 'cm-measure': [1, 0]},
      family: {'horiz-36': [28, 0], 'mds-seal': [45, 0], 'wta-plaster': [45, 0], 'fillet-joint': [28, 0], 'old-plaster': [45, 0], 'cm-measure': [1, 0]}
    },
    guess: {},
    rules: {
      buffer: 0.1,
      range: {high: 0.08, medium: 0.15, low: 0.25},
      weight: {pick: 1, custom: 1, list: 0.8, photo: 0.8, preset: 0.5, guess: 0.4},
      vehicles: [{id: 'sprinter', cap: 50}, {id: 'lkw75', cap: 150}, {id: 'lkw12', cap: 300}],
      defaultKm: 15,
      customDensity: 10
    }
  };
}

function rates_() {
  var r = {}, sh = ss_().getSheetByName(TAB.rates);
  if (sh && sh.getLastRow() > 1) {
    sh.getDataRange().getValues().slice(1).forEach(function (x) { if (x[0]) r[String(x[0])] = Number(x[2]) || 0; });
  }
  DEFAULT_RATES.forEach(function (d) { if (r[d[0]] == null) r[d[0]] = d[2]; });
  return r;
}

/* Suggested quote lines for a waterproofing / remediation inquiry */
function quoteLines_(s, values, master, R) {
  var svc = values ? String(values[leadCol_('Leistung') - 1] || '') : '';
  var area = values ? (Number(values[leadCol_('Volumen min m³') - 1]) || Number(values[leadCol_('Anzahl') - 1]) || 15) : 15;
  if (!s || (!s.inv && !s.damage)) {
    var isMold = /schimmel/i.test(svc);
    var isCrack = /riss/i.test(svc);
    var isKeller = /keller|innenabdichtung/i.test(svc);
    if (isMold) {
      return {est: null, lines: [
        ['Feuchte- & Taupunktmessung', 'Messtechnische Ursachenanalyse inkl. Protokoll', 1, 'Pausch.', 0],
        ['Sporensichere Schimmelbeseitigung', 'Tiefendesinfektion ohne Chlorbelastung', area, 'm²', R.schimmel_qm],
        ['Calciumsilikat-Klimaplatte', 'Wärmebrückendämmung inkl. Spezialkleber', Math.max(4, Math.round(area * 0.6)), 'm²', R.klimaplatte_qm],
        ['Facharbeiter / Montage (§ 35a EStG)', 'Arbeitszeit vor Ort (steuerlich absetzbar)', Math.max(4, Math.round(area * 0.6)), 'Std.', R.hour],
        ['Anfahrt & Baustelleneinrichtung', 'Raum Wuppertal / Bergisches Land', 1, 'Pausch.', R.anfahrt]
      ]};
    }
    if (isCrack) {
      return {est: null, lines: [
        ['Feuchtemessung & Rissanalyse', 'Kostenlose Erstprüfung inkl. Messprotokoll', 1, 'Pausch.', 0],
        ['Hochdruck-Rissverpressung (PU-Harz)', 'Bohrpacker setzen, verpressen & verschließen', Math.max(3, area), 'lfm', R.riss_m],
        ['Facharbeiter / Injektionstechnik (§ 35a EStG)', 'Arbeitszeit vor Ort (steuerlich absetzbar)', Math.max(4, Math.round(area * 0.8)), 'Std.', R.hour],
        ['Anfahrt & Baustelleneinrichtung', 'Raum Wuppertal / Bergisches Land', 1, 'Pausch.', R.anfahrt]
      ]};
    }
    if (isKeller) {
      return {est: null, lines: [
        ['Feuchtemessung & Salzanalyse', 'Kostenlose Nullmessung inkl. Messprotokoll', 1, 'Pausch.', 0],
        ['Kellerinnenabdichtung (MDS & WTA-Sanierputz)', '2-lagige Dichtschlämme & klimaregulierender Sanierputz', area, 'm²', R.innenabdichtung_qm],
        ['Druckwasserdichte Hohlkehle', 'Wand-Sohlen-Anschluss ausbilden', Math.max(6, Math.round(area * 0.4)), 'lfm', R.hohlkehle_m],
        ['Facharbeiter / Bauwerksabdichtung (§ 35a EStG)', 'Arbeitszeit vor Ort (steuerlich absetzbar)', Math.max(8, Math.round(area * 0.7)), 'Std.', R.hour],
        ['Anfahrt & Baustelleneinrichtung', 'Raum Wuppertal / Bergisches Land', 1, 'Pausch.', R.anfahrt]
      ]};
    }
    return {est: null, lines: [
      ['Feuchtemessung & Diagnose', 'Kostenlose Nullmessung inkl. Messprotokoll', 1, 'Pausch.', 0],
      ['Horizontalsperre im WTA-Injektionsverfahren', 'Bohrlochreihe setzen & Silan-Mikroemulsion injizieren', area, 'lfm', R.horizontalsperre_m],
      ['Facharbeiter / Injektionstechnik (§ 35a EStG)', 'Arbeitszeit vor Ort (steuerlich absetzbar)', Math.max(6, Math.round(area * 0.65)), 'Std.', R.hour],
      ['Anfahrt & Baustelleneinrichtung', 'Raum Wuppertal / Bergisches Land', 1, 'Pausch.', R.anfahrt]
    ]};
  }
  var est = Estimator.estimate(s, master);
  var lines = [
    ['Feuchtemessung & Protokoll', 'Nullmessung, Injektions- & Abnahmeprotokoll', 1, 'Pausch.', 0]
  ];
  if (est.lfm > 0) {
    lines.push(['Horizontalsperre / Rissinjektion (Material & Technik)', 'SchimmelPeter® WTA-System (' + est.lfm + ' lfm)', est.lfm, 'lfm', R.horizontalsperre_m]);
  }
  if (est.sqm > 0) {
    lines.push(['Wandabdichtung / Sanierputz / Schimmelsanierung', 'Flächensanierung (' + est.sqm + ' m²)', est.sqm, 'm²', R.innenabdichtung_qm]);
  }
  lines.push(['Arbeits- & Montagelohn (§ 35a EStG)', est.crew + ' Fachkräfte × ' + de_(est.hours) + ' Std.', round_(est.crew * est.hours, 1), 'Std.', R.hour]);
  lines.push(['Anfahrt & Baustelleneinrichtung', 'Servicefahrzeug & Schutzfolien', 1, 'Pausch.', R.anfahrt]);
  return {est: est, lines: lines};
}

function quoteTotal_(lines, minPrice) {
  var sum = 0;
  lines.forEach(function (l) { sum += (Number(l[2]) || 0) * (Number(l[4]) || 0); });
  return Math.max(Number(minPrice) || 0, Math.round(sum * 100) / 100);
}

function writeQuote_(id, lines, masterVersion, R) {
  var q = sheet_(TAB.quotes), data = q.getDataRange().getValues(), version = 1;
  data.forEach(function (r) { if (r[0] === id) version = Math.max(version, Number(r[1]) + 1); });
  var start = q.getLastRow() + 1, now = new Date();
  q.getRange(start, 1, lines.length, QUOTE_COLS.length).setValues(lines.map(function (l) {
    return [id, version, now, masterVersion, cell_(l[0], 80), cell_(l[1], 160), Number(l[2]) || 0, clip_(l[3], 10), Number(l[4]) || 0, ''];
  }));
  q.getRange(start, 10, lines.length, 1).setFormulasR1C1(lines.map(function () { return ['=R[0]C[-3]*R[0]C[-1]']; }));
  q.getRange(start + lines.length, 1, 1, QUOTE_COLS.length).setValues([[id, version, now, masterVersion, 'Summe', 'mindestens ' + R.min_price + ' €', '', '', '', '']]);
  q.getRange(start + lines.length, 10).setFormula('=MAX(' + R.min_price + ',SUM(J' + start + ':J' + (start + lines.length - 1) + '))');
  q.getRange(start + lines.length, 1, 1, QUOTE_COLS.length).setFontWeight('bold').setBorder(true, null, null, null, null, null);
  var total = quoteTotal_(lines, R.min_price);
  var hit = findLead_(id);
  if (hit) sheet_(TAB.leads).getRange(hit.row, leadCol_('Angebot €')).setValue(total);
  return {version: version, total: total};
}

function latestQuote_(id) {
  var sh = ss_().getSheetByName(TAB.quotes);
  if (!sh || sh.getLastRow() < 2) return null;
  var data = sh.getDataRange().getValues(), best = 0, lines = [];
  data.forEach(function (r) { if (r[0] === id) best = Math.max(best, Number(r[1]) || 0); });
  if (!best) return null;
  data.forEach(function (r) { if (r[0] === id && Number(r[1]) === best && r[4] !== 'Summe') lines.push([String(r[4]), String(r[5]), Number(r[6]) || 0, String(r[7]), Number(r[8]) || 0]); });
  return {version: best, lines: lines};
}

function ensureDriveFolder_(name, parent) {
  if (typeof DriveApp === 'undefined') return null;
  var p = parent || DriveApp;
  if (!p || typeof p.getFoldersByName !== 'function') return (p && p.createFolder) ? p.createFolder(name) : null;
  var it = p.getFoldersByName(name);
  if (it && it.hasNext && it.hasNext()) return it.next();
  return p.createFolder ? p.createFolder(name) : null;
}

function apptMails_(a, kind, note) {
  var T = APPT_TYPES[a.type] || {de: a.type, en: a.type, min: a.min};
  var en = a.lang === 'EN', when = (en ? a.date.split('-').reverse().join('/') : dayDeLong_(a.date)) + ', ' + a.time + (en ? '' : ' Uhr');
  var meetLink = a.meetUrl || (a.type === 'video' ? 'https://meet.google.com' : '');
  var where = a.type === 'visit' ? a.address : a.type === 'video' ? 'Google Meet / WhatsApp-Video' : 'Telefon';
  var how = {
    visit: 'Shahzad Mahmood kommt persönlich zu Ihrem Objekt (' + a.address + '), führt eine zerstörungsfreie elektronische Feuchte- und Taupunktmessung durch und erstellt Ihnen ein verbindliches Festpreisangebot. Dauer ca. 60 Minuten, kostenlos & unverbindlich.',
    video: 'Wir verbinden uns per Google Meet (' + (meetLink || 'Google Meet') + ') oder per WhatsApp-Video unter ' + a.phone + '. Sie zeigen uns das Schadensbild mit dem Smartphone – ca. 30 Minuten, kostenlos.',
    call: 'Herr Mahmood ruft Sie unter ' + a.phone + ' an und berät Sie ausführlich zur Kellersanierung, Horizontalsperre oder Schimmelbeseitigung.'
  }[a.type] || '';
  var sign = '\n\nViele Grüße\nShahzad Mahmood\nsos-abdichtung (SchimmelPeter® Partnerbetrieb)\nNiebuhrstraße 46 · 45144 Essen · Servicegebiet Wuppertal & Bergisches Land\nTelefon & WhatsApp: +49 172 2064177 · https://sos-abdichtung.de';
  var title = T.de + ' – SOS Abdichtung';
  var file = Utilities.newBlob(ics_(a, title, where, how), 'text/calendar', 'termin-' + a.nr + '.ics');
  var subject, body;
  if (kind === 'booked') {
    subject = 'Ihr Termin zur Feuchtemessung am ' + when + ' – SOS Abdichtung';
    body = 'Guten Tag ' + a.name + ',\n\nvielen Dank – Ihr Termin bei SOS Abdichtung ist fest reserviert:\n\n' +
      T.de + '\n' + when + ' (' + a.min + ' min)\nOrt: ' + where + '\n\n' + how +
      '\n\nDie Kalenderdatei (.ics) ist angehängt. Falls Sie den Termin verschieben möchten, antworten Sie einfach auf diese E-Mail oder schreiben Sie uns auf WhatsApp (+49 172 2064177).' +
      '\n\nTerminnummer: ' + a.nr + sign;
  } else if (kind === 'cancelled') {
    subject = 'Termin abgesagt – SOS Abdichtung';
    body = 'Guten Tag ' + a.name + ',\n\nleider müssen wir Ihren Termin am ' + when + ' absagen.' +
      (note ? '\n\n' + note : '') + '\n\nBitte vereinbaren Sie einen neuen Termin auf https://sos-abdichtung.de/kontakt/ oder rufen Sie uns unter +49 172 2064177 an.' + sign;
    file = null;
  } else {
    subject = 'Neue Uhrzeit für Ihren Termin: ' + when + ' – SOS Abdichtung';
    body = 'Guten Tag ' + a.name + ',\n\nwir haben Ihren Termin verschoben auf:\n\n' +
      T.de + '\n' + when + '\nOrt: ' + where + (note ? '\n\n' + note : '') +
      '\n\nDie aktualisierte Kalenderdatei ist angehängt.' + sign;
  }
  try {
    var mail = {to: a.email, subject: subject, body: body, name: 'SOS Abdichtung – Shahzad Mahmood'};
    if (file) mail.attachments = [file];
    var office = String(config_('notify_email') || Session.getEffectiveUser().getEmail() || '');
    if (office) mail.replyTo = office;
    if (a.email) MailApp.sendEmail(mail);
    if (kind === 'booked') {
      apptCalendarSync_(a);
    }
    if (kind === 'booked' && office) {
      MailApp.sendEmail({
        to: office,
        subject: 'Neuer Mess-Termin ' + a.nr + ': ' + T.de + ' ' + when + ' – ' + a.name,
        attachments: [Utilities.newBlob(ics_(a, T.de + ': ' + a.name, where, how), 'text/calendar', 'termin-' + a.nr + '.ics')],
        body: [
          'Neuer Termin über sos-abdichtung.de', '',
          T.de + ' · ' + when + ' (' + a.min + ' min)',
          'Kunde: ' + a.name,
          'Telefon: ' + a.phone,
          'E-Mail: ' + (a.email || '—'),
          'Objektadresse: ' + (a.address || '—'),
          'Schadensbild: ' + (a.to || '—'),
          'Nachricht: ' + (a.message || '—'),
          'Anfrage-ID: ' + a.lead,
          adminLink_(a.lead),
          '',
          'Tabelle: ' + ss_().getUrl()
        ].join('\n')
      });
    }
  } catch (err) { console.error(err); }
}

function apptCalendarSync_(a) {
  if (typeof CalendarApp === 'undefined') return '';
  try {
    var cal = CalendarApp.getDefaultCalendar();
    if (!cal) return '';
    var start = new Date(a.date + 'T' + a.time + ':00');
    if (isNaN(start.getTime())) return '';
    var end = new Date(start.getTime() + (Number(a.min) || 60) * 60000);
    var T = APPT_TYPES[a.type] || {de: a.type, en: a.type};
    var where = a.type === 'visit' ? (a.address || 'Kundenobjekt') : (a.type === 'video' ? 'Google Meet / WhatsApp Video' : 'Telefon: ' + a.phone);
    var desc = [
      'Termin: ' + T.de + ' (' + (a.min || 60) + ' min)',
      'Kunde: ' + a.name,
      'Telefon: ' + a.phone,
      'E-Mail: ' + a.email,
      'Objektadresse: ' + (a.address || '—'),
      'Schadensbild: ' + (a.to || '—'),
      a.message ? 'Nachricht: ' + a.message : '',
      a.type === 'video' ? 'Google Meet: https://meet.google.com' : '',
      'Terminnummer: ' + a.nr + ' · Anfrage: ' + (a.lead || '—')
    ].filter(Boolean).join('\n');
    var ev = cal.createEvent('SOS Abdichtung: ' + T.de + ' – ' + a.name, start, end, {
      location: where,
      description: desc
    });
    return ev ? ev.getId() : '';
  } catch (err) {
    console.error('Calendar sync error:', err);
    return '';
  }
}

/* 1-Click Publishing to GitHub Pages (avaisqarni365/SOS24) */
function publishCatalogCore_(user, ui) {
  var props = PropertiesService.getScriptProperties();
  var repo = props.getProperty('GITHUB_REPO') || config_('github_repo') || 'avaisqarni365/SOS24';
  var token = props.getProperty('GITHUB_TOKEN') || config_('github_token');
  var branch = props.getProperty('GITHUB_BRANCH') || 'main';
  if (!repo || !token) {
    var msg = 'GITHUB_TOKEN fehlt in den Skripteigenschaften oder im Tab Konfiguration (Schlüssel: github_token).';
    if (ui) ui.alert(msg);
    throw new Error(msg);
  }
  CacheService.getScriptCache().remove('master');
  var m = masterFromSheet_();
  var d = new Date(), version = Utilities.formatDate(d, 'Europe/Berlin', 'yyyy.MM.dd-HHmm');
  m.version = version;
  m.company = company_();
  var compact = JSON.stringify(m, null, 2) + '\n';
  githubPut_(repo, branch, token, 'public/data/master.json', compact, 'Katalog & Konfiguration ' + version + ' veröffentlicht (' + user + ')');
  // Also trigger workflow_dispatch if desired
  try {
    UrlFetchApp.fetch('https://api.github.com/repos/' + repo + '/actions/workflows/deploy.yml/dispatches', {
      method: 'post',
      headers: {Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28'},
      contentType: 'application/json',
      muteHttpExceptions: true,
      payload: JSON.stringify({ref: branch})
    });
  } catch (e) {}
  setConfig_('master_version', version);
  CacheService.getScriptCache().remove('master');
  sheet_(TAB.audit).appendRow([d, user, TAB.catalog, '—', '', 'Veröffentlicht auf GitHub (' + repo + '): Version ' + version + ', ' + m.items.length + ' Leistungen']);
  return {ok: true, version: version, count: m.items.length};
}

function githubPut_(repo, branch, token, path, content, message) {
  var url = 'https://api.github.com/repos/' + repo + '/contents/' + path;
  var headers = {Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28'};
  var get = UrlFetchApp.fetch(url + '?ref=' + encodeURIComponent(branch), {headers: headers, muteHttpExceptions: true});
  var sha = get.getResponseCode() === 200 ? JSON.parse(get.getContentText()).sha : undefined;
  var res = UrlFetchApp.fetch(url, {
    method: 'put', headers: headers, contentType: 'application/json', muteHttpExceptions: true,
    payload: JSON.stringify({message: message, branch: branch, sha: sha, content: Utilities.base64Encode(content, Utilities.Charset.UTF_8)})
  });
  if (res.getResponseCode() >= 300) throw new Error('GitHub ' + res.getResponseCode() + ' für ' + path + ': ' + res.getContentText().slice(0, 300));
}
