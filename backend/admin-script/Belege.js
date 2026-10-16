/**
 * SOS Abdichtung – GoBD Invoicing & Quote Engine (backend/admin-script/Belege.js).
 *
 * Implements German tax & accounting compliance (§ 14 UStG, § 19 UStG Kleinunternehmer toggle,
 * § 35a EStG Handwerkerleistung craft labor breakdown, and GoBD immutability):
 *  - Consecutive yearly numbering: ANG-2026-0001 for offers, RE-2026-0001 for invoices, deposits & cancellations.
 *  - Issued invoices are locked and archived to Google Drive ("SOS Abdichtung - Belege / <Jahr>/").
 *  - Cancellations generate negative Stornorechnung referencing the original invoice.
 */

var DOC_COLS = ['Nr', 'Art', 'Status', 'Anfrage', 'Datum', 'Kunde', 'Netto €', 'USt €', 'Brutto €', 'Fällig', 'Bezahlt am', 'Bezahlt €',
  'PDF', 'Erstellt von', 'Geändert', 'Bezug', 'Daten (JSON)'];
var DOC_TAB = 'Belege';
var DOC_TYPES = {offer: 'Angebot', invoice: 'Rechnung', deposit: 'Abschlagsrechnung', final: 'Schlussrechnung', storno: 'Stornorechnung'};
var PAY_METHODS = ['Überweisung', 'Bar', 'EC-/Kreditkarte', 'PayPal'];

function docSheet_() {
  var s = ss_(), sh = s.getSheetByName(DOC_TAB);
  if (!sh) {
    sh = s.insertSheet(DOC_TAB);
    sh.getRange(1, 1, 1, DOC_COLS.length).setValues([DOC_COLS]).setFontWeight('bold').setBackground('#0b251c').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  }
  return sh;
}
function docCol_(n) { return DOC_COLS.indexOf(n) + 1; }
function findDoc_(nr) {
  var sh = docSheet_(), n = sh.getLastRow();
  if (n < 2) return null;
  var ids = sh.getRange(2, 1, n - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(nr)) {
    var v = sh.getRange(i + 2, 1, 1, DOC_COLS.length).getValues()[0];
    return {row: i + 2, doc: JSON.parse(v[DOC_COLS.length - 1] || '{}')};
  }
  return null;
}
function writeDoc_(doc, row) {
  var t = docTotals_(doc), sh = docSheet_();
  doc.totals = t;
  var paid = (doc.payments || []).reduce(function (a, p) { return a + (Number(p.amount) || 0); }, 0);
  var lastPay = (doc.payments || []).length ? doc.payments[doc.payments.length - 1].date : '';
  var vals = [doc.nr, DOC_TYPES[doc.type] || doc.type, doc.status, doc.lead || '', doc.date || '', cell_(doc.to.company && doc.to.kind === 'firma' ? doc.to.company + (doc.to.name ? ' (' + doc.to.name + ')' : '') : doc.to.name, 120), t.net, t.vat, t.gross,
    doc.due || '', lastPay, round_(paid, 2), doc.pdf || '', doc.by || '', new Date(), doc.ref || '', JSON.stringify(doc)];
  if (row) sh.getRange(row, 1, 1, DOC_COLS.length).setValues([vals]);
  else sh.appendRow(vals);
  return doc;
}
function allDocs_() {
  var sh = docSheet_(), n = sh.getLastRow();
  if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, DOC_COLS.length).getValues().filter(function (v) { return v[0]; }).map(function (v) {
    var d = {}; try { d = JSON.parse(v[DOC_COLS.length - 1]); } catch (err) {}
    return {nr: String(v[0]), type: d.type, typeLabel: String(v[1]), status: String(v[2]), lead: String(v[3]), date: day_(v[4]), customer: String(v[5]),
      net: Number(v[6]) || 0, vat: Number(v[7]) || 0, gross: Number(v[8]) || 0, due: day_(v[9]), paid: Number(v[11]) || 0,
      toPay: d.totals ? d.totals.toPay : Number(v[8]) || 0, ref: String(v[15] || ''), sent: d.sent || '', validUntil: d.validUntil || '', pdf: String(v[12] || '')};
  }).reverse();
}

function cents_(x) { return Math.round((Number(x) || 0) * 100) / 100; }

function docTotals_(doc) {
  var small = !!doc.small, gross = doc.priceMode !== 'net';
  var lines = (doc.lines || []).map(function (l) {
    var base = cents_((Number(l.qty) || 0) * (Number(l.price) || 0));
    var amt = cents_(base * (1 - Math.min(100, Math.max(0, Number(l.disc) || 0)) / 100));
    return {amt: amt, base: base, vat: small ? 0 : Number(l.vat) || 0, labour: !!l.labour};
  });
  var sum = lines.reduce(function (a, l) { return a + l.amt; }, 0);
  var dType = doc.discount && doc.discount.type, dVal = Number(doc.discount && doc.discount.value) || 0, dAmt = 0;
  if (dVal && sum) dAmt = cents_(dType === 'pct' ? sum * Math.min(100, dVal) / 100 : Math.min(Math.abs(dVal), Math.abs(sum)) * (sum < 0 ? -1 : 1));
  var factor = sum ? (sum - dAmt) / sum : 1;
  var rates = {}, labourGross = 0, labourVat = 0;
  lines.forEach(function (l) {
    var a = l.amt * factor, r = rates[l.vat] = rates[l.vat] || {rate: l.vat, amount: 0};
    r.amount += a;
    if (l.labour) { var lg = gross ? a : a * (1 + l.vat / 100); labourGross += lg; labourVat += lg - lg / (1 + l.vat / 100); }
  });
  var groups = Object.keys(rates).map(function (k) {
    var r = rates[k], amount = cents_(r.amount), net, vat;
    if (gross) { net = cents_(amount / (1 + r.rate / 100)); vat = cents_(amount - net); }
    else { net = amount; vat = cents_(net * r.rate / 100); }
    return {rate: r.rate, net: net, vat: vat, gross: cents_(net + vat)};
  }).sort(function (a, b) { return b.rate - a.rate; });
  var t = {
    lines: sum, discount: dAmt, groups: groups,
    net: cents_(groups.reduce(function (a, g) { return a + g.net; }, 0)),
    vat: cents_(groups.reduce(function (a, g) { return a + g.vat; }, 0))
  };
  t.gross = cents_(t.net + t.vat);
  t.deposit = cents_(doc.deposit || 0);
  t.toPay = cents_(t.gross - t.deposit);
  t.labour = cents_(labourGross); t.labourVat = cents_(labourVat);
  t.skonto = doc.skonto && Number(doc.skonto.pct) ? cents_(t.toPay * Number(doc.skonto.pct) / 100) : 0;
  return t;
}

function addDays_(isoDay, n) {
  var d = isoDay ? new Date(isoDay + 'T12:00:00') : new Date();
  d.setDate(d.getDate() + (Number(n) || 0));
  return Utilities.formatDate(d, 'Europe/Berlin', 'yyyy-MM-dd');
}
function today_() { return Utilities.formatDate(new Date(), 'Europe/Berlin', 'yyyy-MM-dd'); }

var DOC_TEXT = {
  offer: {
    subject: 'Festpreis-Angebot für Ihre Bauwerksabdichtung / Sanierung',
    intro: 'Sehr geehrte Damen und Herren,\n\nvielen Dank für Ihre Anfrage und das Vertrauen in SOS Abdichtung. Auf Basis unserer messtechnischen Prüfung bieten wir Ihnen folgende Fachleistungen zum Festpreis an:',
    outro: 'Garantieversprechen: Sie erhalten 10 Jahre Ausführungsgarantie von sos-abdichtung auf die ausgeführten Arbeiten sowie 25 Jahre Produktgarantie der SchimmelPeter GmbH.\n\nDas Angebot gilt bis zum genannten Datum. Wenn Ihnen das Angebot zusagt, können Sie es direkt digital unterzeichnen oder uns kurz per E-Mail / WhatsApp bestätigen.'
  },
  invoice: {
    subject: 'Rechnung',
    intro: 'Sehr geehrte Damen und Herren,\n\nvielen Dank für Ihren Auftrag. Für die fachgerechte Ausführung der Sanierungs- und Abdichtungsarbeiten berechnen wir Ihnen:',
    outro: 'Bitte überweisen Sie den Rechnungsbetrag unter Angabe der Rechnungsnummer bis zum Fälligkeitsdatum auf das unten angegebene Konto.\n\nHinweis nach § 35a EStG: Der ausgewiesene Lohnanteil für Handwerkerleistungen ist zu 20 % steuerlich absetzbar (bei unbarer Zahlung).'
  },
  deposit: {
    subject: 'Abschlagsrechnung',
    intro: 'Sehr geehrte Damen und Herren,\n\ngemäß unserer Vereinbarung berechnen wir Ihnen für Materialbereitstellung und Baustelleneinrichtung folgenden Abschlag:',
    outro: 'Der Abschlag wird in der Schlussrechnung vollständig verrechnet. Bitte überweisen Sie den Betrag bis zum Fälligkeitsdatum.'
  },
  final: {
    subject: 'Schlussrechnung',
    intro: 'Sehr geehrte Damen und Herren,\n\nvielen Dank für Ihren Auftrag und die gemeinsame Abnahme inkl. Messprotokoll. Für unsere Leistungen berechnen wir Ihnen abschließend:',
    outro: 'Bereits gezahlte Abschläge sind abgezogen. Bitte überweisen Sie den Restbetrag bis zum Fälligkeitsdatum.\n\nVielen Dank für Ihr Vertrauen in SOS Abdichtung.'
  },
  storno: {
    subject: 'Stornorechnung',
    intro: 'Sehr geehrte Damen und Herren,\n\nhiermit stornieren wir die unten genannte Rechnung vollständig:',
    outro: 'Bereits gezahlte Beträge erstatten wir Ihnen bzw. verrechnen wir mit der korrigierten Rechnung.'
  }
};

function splitAddr_(a) {
  a = String(a || '').trim();
  var m = a.match(/^(.*?),\s*(\d{5}\s+.*)$/);
  return m ? {street: m[1], city: m[2]} : {street: '', city: a};
}

function newDoc_(type, leadId) {
  var c = company_(), t = DOC_TEXT[type] || DOC_TEXT.invoice, now = today_();
  var doc = {
    v: 1, nr: 'E-' + Utilities.getUuid().slice(0, 8), type: type, status: 'Entwurf', lead: leadId || '',
    date: now, subject: t.subject, intro: t.intro, outro: t.outro,
    to: {kind: 'privat', name: '', company: '', street: '', city: '', country: 'Deutschland', email: '', phone: '', vatId: ''},
    serviceFrom: '', serviceTo: '', validUntil: type === 'offer' ? addDays_(now, c.offer_days) : '',
    payDays: c.pay_days, due: '', payMethod: PAY_METHODS[0], skonto: {pct: 0, days: 7},
    priceMode: c.price_mode, small: c.small, discount: {type: 'pct', value: 0}, deposit: 0,
    lines: [], ref: '', payments: [], log: []
  };
  if (leadId) {
    var hit = findLead_(leadId);
    if (!hit) throw new Error('Anfrage ' + leadId + ' nicht gefunden.');
    var l = leadObj_(hit.values), a = splitAddr_(l.from);
    doc.to.name = l.name; doc.to.street = a.street; doc.to.city = a.city || l.from; doc.to.email = l.email; doc.to.phone = l.phone;
    if (/^\d{4}-\d{2}-\d{2}$/.test(l.date)) { doc.serviceFrom = l.date; }
    var svc = String(l.service || 'Kellersanierung & Horizontalsperre');
    doc.subject = (type === 'offer' ? 'Festpreis-Angebot: ' + svc : DOC_TYPES[type] + ' – ' + svc) + ' (Anfrage ' + leadId + ')';
    if (l.name) {
      doc.intro = doc.intro.replace('Sehr geehrte Damen und Herren,', 'Guten Tag ' + l.name + ',');
    }
    var q = latestQuote_(leadId);
    var src = q ? q.lines : quoteLines_((function () { try { return JSON.parse(hit.values[JSON_COL - 1] || '{}'); } catch (err) { return null; } })(), hit.values, masterFromSheet_(), rates_()).lines;
    src.forEach(function (x) {
      if (x[0] === '' && !(Number(x[2]) * Number(x[4]))) return;
      doc.lines.push({
        title: String(x[0]), detail: String(x[1] || ''), qty: Number(x[2]) || 1, unit: String(x[3] || 'Pausch.'), price: Number(x[4]) || 0,
        vat: c.small ? 0 : c.vat, disc: 0,
        labour: /facharbeiter|arbeit|lohn|montage|injektionstechnik|35a/i.test(String(x[0] + ' ' + x[1]))
      });
    });
  }
  if (!doc.lines.length) doc.lines.push({title: 'Horizontalsperre im WTA-Injektionsverfahren', detail: 'Bohrlochreihe setzen & Silan-Mikroemulsion injizieren', qty: 10, unit: 'lfm', price: 135, vat: c.small ? 0 : c.vat, disc: 0, labour: false});
  return doc;
}

function cleanDoc_(d, old) {
  var c = company_(), s = function (x, n) { return String(x == null ? '' : x).slice(0, n || 200); }, day = function (x) { x = s(x, 10); return /^\d{4}-\d{2}-\d{2}$/.test(x) ? x : ''; };
  var doc = old ? JSON.parse(JSON.stringify(old)) : newDoc_(DOC_TYPES[d.type] ? d.type : 'invoice', '');
  if (!old) doc.nr = 'E-' + Utilities.getUuid().slice(0, 8);
  if (DOC_TYPES[d.type] && d.type !== 'storno') doc.type = d.type;
  doc.lead = s(d.lead, 20); doc.ref = s(d.ref, 40);
  doc.date = day(d.date) || today_(); doc.subject = s(d.subject, 160); doc.intro = s(d.intro, 2000); doc.outro = s(d.outro, 3000);
  var to = d.to || {};
  doc.to = {kind: to.kind === 'firma' ? 'firma' : 'privat', name: s(to.name, 120), company: s(to.company, 120), street: s(to.street, 120), city: s(to.city, 120),
    country: s(to.country || 'Deutschland', 60), email: s(to.email, 120), phone: s(to.phone, 40), vatId: s(to.vatId, 20)};
  doc.serviceFrom = day(d.serviceFrom); doc.serviceTo = day(d.serviceTo); doc.validUntil = day(d.validUntil);
  doc.payDays = Math.max(0, Math.min(120, Number(d.payDays) || 0));
  doc.due = doc.type === 'offer' ? '' : addDays_(doc.date, doc.payDays);
  doc.payMethod = PAY_METHODS.indexOf(d.payMethod) >= 0 ? d.payMethod : PAY_METHODS[0];
  doc.skonto = {pct: Math.max(0, Math.min(10, Number(d.skonto && d.skonto.pct) || 0)), days: Math.max(0, Math.min(60, Number(d.skonto && d.skonto.days) || 0))};
  doc.priceMode = d.priceMode === 'net' ? 'net' : 'gross';
  doc.small = c.small;
  doc.discount = {type: d.discount && d.discount.type === 'eur' ? 'eur' : 'pct', value: Math.max(0, Number(d.discount && d.discount.value) || 0)};
  doc.deposit = Math.max(0, Number(d.deposit) || 0);
  if (!Array.isArray(d.lines) || d.lines.length > 60) throw new Error('Ungültige Positionen.');
  doc.lines = d.lines.map(function (l) {
    var vat = Number(l.vat); if ([0, 7, 19].indexOf(vat) < 0) vat = c.vat;
    return {title: s(l.title, 120), detail: s(l.detail, 400), qty: Number(l.qty) || 0, unit: s(l.unit, 12), price: Number(l.price) || 0,
      vat: c.small ? 0 : vat, disc: Math.max(0, Math.min(100, Number(l.disc) || 0)), labour: !!l.labour};
  }).filter(function (l) { return l.title || l.detail || l.price; });
  return doc;
}

function docProblems_(doc) {
  var c = company_(), p = [];
  if (!doc.to.name && !doc.to.company) p.push('Name des Kunden fehlt.');
  if (doc.type !== 'offer' && (!doc.to.street || !doc.to.city)) p.push('Vollständige Anschrift des Kunden fehlt (Straße, PLZ und Ort).');
  if (!doc.lines.length) p.push('Mindestens eine Position eintragen.');
  doc.lines.forEach(function (l, i) { if (!l.title) p.push('Position ' + (i + 1) + ': Bezeichnung fehlt.'); });
  if (doc.type !== 'offer' && doc.type !== 'storno' && !doc.serviceFrom) p.push('Leistungsdatum fehlt (Pflichtangabe auf Rechnungen).');
  if (doc.type !== 'offer' && !c.vat_id && !c.tax_no) p.push('USt-IdNr. oder Steuernummer in den Firmendaten eintragen.');
  if (doc.type !== 'offer' && doc.payMethod === 'Überweisung' && !c.iban) p.push('IBAN in den Firmendaten eintragen (Zahlung per Überweisung).');
  if (doc.type === 'offer' && !doc.validUntil) p.push('Gültig-bis-Datum fehlt.');
  return p;
}

/* Consecutive GoBD numbering: ANG-2026-0001 for offers, RE-2026-0001 for invoices */
function nextDocNr_(type, isoDay) {
  var prefix = type === 'offer' ? 'ANG' : 'RE', year = String(isoDay || today_()).slice(0, 4), key = 'seq_' + prefix + '_' + year;
  var n = (Number(config_(key)) || 0) + 1;
  setConfig_(key, n);
  return prefix + '-' + year + '-' + ('000' + n).slice(-4);
}

function eurDe_(x) {
  var n = cents_(x), neg = n < 0, s = Math.abs(n).toFixed(2).split('.');
  return (neg ? '−' : '') + s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + s[1] + ' €';
}
function numDe_(x) { var n = Math.round((Number(x) || 0) * 1000) / 1000; return String(n).replace('.', ','); }
function dayDe_(iso) { return /^\d{4}-\d{2}-\d{2}$/.test(iso || '') ? iso.slice(8, 10) + '.' + iso.slice(5, 7) + '.' + iso.slice(0, 4) : ''; }
function h_(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (ch) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[ch]; }); }
function nl_(s) { return h_(s).replace(/\n/g, '<br>'); }

function renderDoc_(doc) {
  var c = company_(), t = docTotals_(doc), offer = doc.type === 'offer', gross = doc.priceMode !== 'net';
  var title = DOC_TYPES[doc.type] || 'Rechnung', draft = doc.status === 'Entwurf';
  var emerald = '#0f766e', deep = '#0b251c';
  var to = doc.to;
  var addr = [to.kind === 'firma' && to.company ? to.company : '', to.name, to.street, to.city, to.country && to.country !== 'Deutschland' ? to.country : '']
    .filter(String).map(h_).join('<br>');
  var meta = [[offer ? 'Angebotsnummer' : 'Rechnungsnummer', draft ? 'ENTWURF' : doc.nr], [offer ? 'Angebotsdatum' : 'Rechnungsdatum', dayDe_(doc.date)]];
  if (!offer && doc.type !== 'storno') meta.push([doc.serviceTo && doc.serviceTo !== doc.serviceFrom ? 'Leistungszeitraum' : 'Leistungsdatum',
    dayDe_(doc.serviceFrom) + (doc.serviceTo && doc.serviceTo !== doc.serviceFrom ? ' – ' + dayDe_(doc.serviceTo) : '')]);
  if (offer && doc.serviceFrom) meta.push(['Geplanter Ausführungstermin', dayDe_(doc.serviceFrom)]);
  if (offer) meta.push(['Gültig bis', dayDe_(doc.validUntil)]);
  if (doc.lead) meta.push(['Anfrage-Nr.', doc.lead]);
  if (doc.ref) meta.push([doc.type === 'storno' ? 'Storniert Rechnung' : 'Bezug', doc.ref]);
  if (to.kind === 'firma' && to.vatId) meta.push(['Ihre USt-IdNr.', to.vatId]);
  if (!offer && doc.type !== 'storno' && doc.due) meta.push(['Zahlbar bis', dayDe_(doc.due)]);

  var rows = doc.lines.map(function (l, i) {
    var base = cents_(l.qty * l.price), amt = cents_(base * (1 - (l.disc || 0) / 100));
    return '<tr><td class="c">' + (i + 1) + '</td><td><b>' + h_(l.title) + '</b>' + (l.detail ? '<div class="d">' + nl_(l.detail) + '</div>' : '') +
      (l.disc ? '<div class="d">abzüglich ' + numDe_(l.disc) + ' % Rabatt</div>' : '') + '</td>' +
      '<td class="r">' + numDe_(l.qty) + ' ' + h_(l.unit) + '</td><td class="r">' + eurDe_(l.price) + '</td>' +
      (doc.small ? '' : '<td class="r">' + l.vat + ' %</td>') + '<td class="r">' + eurDe_(amt) + '</td></tr>';
  }).join('');
  var sumRows = '';
  if (t.discount) sumRows += '<tr><td>Summe Positionen</td><td class="r">' + eurDe_(t.lines) + '</td></tr><tr><td>Rabatt' +
    (doc.discount.type === 'pct' ? ' ' + numDe_(doc.discount.value) + ' %' : '') + '</td><td class="r">−' + eurDe_(t.discount) + '</td></tr>';
  if (doc.small) sumRows += '<tr class="g"><td>Gesamtbetrag</td><td class="r">' + eurDe_(t.gross) + '</td></tr>';
  else {
    t.groups.forEach(function (g) { sumRows += '<tr><td>Nettobetrag' + (t.groups.length > 1 ? ' (' + g.rate + ' %)' : '') + '</td><td class="r">' + eurDe_(g.net) + '</td></tr>'; });
    t.groups.forEach(function (g) { sumRows += '<tr><td>zzgl. Umsatzsteuer ' + g.rate + ' %</td><td class="r">' + eurDe_(g.vat) + '</td></tr>'; });
    sumRows += '<tr class="g"><td>Gesamtbetrag (brutto)</td><td class="r">' + eurDe_(t.gross) + '</td></tr>';
  }
  if (t.deposit) sumRows += '<tr><td>abzüglich ' + (doc.type === 'final' ? 'gezahlter Abschläge' : 'Anzahlung') + '</td><td class="r">−' + eurDe_(t.deposit) + '</td></tr>' +
    '<tr class="g"><td>' + (offer ? 'Restbetrag' : 'Zu zahlen') + '</td><td class="r">' + eurDe_(t.toPay) + '</td></tr>';

  var notes = [];
  if (doc.small) notes.push('Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.');
  if (gross && !doc.small) notes.push('Alle Einzelpreise inklusive gesetzlicher Umsatzsteuer.');
  if (t.labour > 0 && doc.type !== 'storno') notes.push('Steuerbonus nach § 35a EStG (Handwerkerleistungen): Im Gesamtbetrag enthaltene Arbeits- und Fahrtkosten (Lohnanteil): ' + eurDe_(t.labour) +
    (doc.small ? '' : ' (darin ' + eurDe_(t.labourVat) + ' Umsatzsteuer)') + '. ' + (offer ? 'Privatkunden können 20 % (' + eurDe_(t.labour * 0.2) + ') direkt von der Einkommensteuer abziehen.' : 'Bitte unbar überweisen, damit das Finanzamt den Steuerabzug anerkennt.'));
  if (!offer && doc.type !== 'storno') {
    var pay = doc.payMethod === 'Überweisung'
      ? 'Bitte überweisen Sie ' + eurDe_(t.toPay) + ' bis zum ' + dayDe_(doc.due) + ' auf das unten genannte Konto. Verwendungszweck: ' + (draft ? '[Rechnungsnummer]' : doc.nr) + '.'
      : 'Zahlungsart: ' + doc.payMethod + '.';
    if (doc.skonto.pct && doc.payMethod === 'Überweisung') pay += ' Bei Zahlung innerhalb von ' + doc.skonto.days + ' Tagen gewähren wir ' + numDe_(doc.skonto.pct) + ' % Skonto (' + eurDe_(t.skonto) + ').';
    notes.push(pay);
  }
  if (to.kind === 'firma' && to.vatId && t.vat === 0 && !doc.small) notes.push('Steuerschuldnerschaft des Leistungsempfängers (§ 13b UStG).');
  (doc.payments || []).forEach(function (p) { notes.push('Betrag von ' + eurDe_(p.amount) + ' am ' + dayDe_(p.date) + ' (' + h_(p.method) + ') dankend erhalten.'); });

  var foot = [
    [h_(c.name), h_(c.legal) + (c.owner ? ' · Inh. ' + h_(c.owner) : ''), h_(c.street), h_(c.city)],
    ['Tel. ' + h_(c.phone), h_(c.email), h_(c.web)],
    [c.vat_id ? 'USt-IdNr. ' + h_(c.vat_id) : '', c.tax_no ? 'Steuernr. ' + h_(c.tax_no) : '', '10 J. Ausführungsgarantie · 25 J. Produktgarantie'],
    [c.bank ? h_(c.bank) : '', c.iban ? 'IBAN ' + h_(c.iban) : '', c.bic ? 'BIC ' + h_(c.bic) : '']
  ].map(function (col) { return '<td>' + col.filter(String).join('<br>') + '</td>'; }).join('');

  return '<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><title>' + h_(title + ' ' + doc.nr) + '</title><style>' +
    '@page{size:A4;margin:16mm 18mm 18mm}' +
    'body{font-family:Helvetica,Arial,sans-serif;font-size:10pt;color:' + deep + ';margin:0;line-height:1.4}' +
    '.top{width:100%;border-collapse:collapse}.top td{vertical-align:top;padding:0}' +
    '.logo{font-weight:bold;font-size:19pt;line-height:1;letter-spacing:-.5pt}.logo span{color:' + emerald + ';display:block}.logo small{display:block;font-size:7.5pt;letter-spacing:2pt;margin-top:4pt;color:#475569}' +
    '.sender{font-size:7.5pt;color:#475569;border-bottom:.5pt solid #475569;display:inline-block;margin:20pt 0 6pt}' +
    '.addr{font-size:10.5pt;min-height:70pt}' +
    '.meta{border-collapse:collapse;float:right}.meta td{padding:1.5pt 0 1.5pt 12pt;font-size:9pt}.meta td:first-child{color:#475569;padding-left:0}' +
    'h1{font-size:16pt;margin:24pt 0 2pt;color:' + deep + '}h1 span{color:' + emerald + '}' +
    '.subj{font-weight:bold;margin:0 0 12pt}.txt{margin:0 0 12pt}' +
    '.pos{width:100%;border-collapse:collapse;margin:6pt 0}.pos th{background:' + deep + ';color:#fff;font-size:8.5pt;text-align:left;padding:5pt 6pt;font-weight:bold}' +
    '.pos td{padding:6pt;border-bottom:.5pt solid #cbd5e1;vertical-align:top}.pos .r{text-align:right;white-space:nowrap}.pos .c{text-align:center;width:18pt}.d{color:#475569;font-size:8.5pt;margin-top:2pt}' +
    '.sum{width:54%;margin-left:46%;border-collapse:collapse}.sum td{padding:3pt 6pt}.sum .r{text-align:right;white-space:nowrap}.sum .g td{border-top:1.5pt solid ' + deep + ';font-weight:bold;font-size:11pt;padding-top:5pt}' +
    '.notes{margin:14pt 0 0;padding:8pt 10pt;background:#f0fdfa;border-left:3pt solid ' + emerald + ';font-size:9pt}.notes p{margin:0 0 4pt}' +
    '.foot{width:100%;border-collapse:collapse;margin-top:22pt;border-top:1pt solid ' + emerald + '}.foot td{vertical-align:top;font-size:7.5pt;color:#475569;padding:6pt 8pt 0 0;width:25%}' +
    '.draft{color:#d97706;font-weight:bold;letter-spacing:2pt}' +
    '</style></head><body>' +
    '<table class="top"><tr><td><div class="logo">sos<span>abdichtung</span><small>SCHIMMELPETER® PARTNER WUPPERTAL &amp; NRW</small></div></td>' +
    '<td style="text-align:right;font-size:8.5pt;color:#475569">' + h_(c.name) + '<br>Inh. ' + h_(c.owner) + '<br>' + h_(c.street) + '<br>' + h_(c.city) + '<br>' + h_(c.phone) + ' · ' + h_(c.email) + '</td></tr></table>' +
    '<div class="sender">' + h_(c.name) + ' · ' + h_(c.street) + ' · ' + h_(c.city) + '</div>' +
    '<table class="top"><tr><td class="addr">' + addr + '</td><td><table class="meta">' + meta.map(function (m) { return '<tr><td>' + h_(m[0]) + '</td><td><b>' + h_(m[1]) + '</b></td></tr>'; }).join('') + '</table></td></tr></table>' +
    '<h1>' + h_(title) + (draft ? ' <span class="draft">ENTWURF</span>' : ' <span>' + h_(doc.nr) + '</span>') + '</h1>' +
    (doc.subject ? '<p class="subj">' + h_(doc.subject) + '</p>' : '') +
    (doc.intro ? '<p class="txt">' + nl_(doc.intro) + '</p>' : '') +
    '<table class="pos"><thead><tr><th class="c">Pos.</th><th>Fachleistung / Beschreibung</th><th class="r">Menge</th><th class="r">' + (gross ? 'Einzelpreis brutto' : 'Einzelpreis netto') + '</th>' +
    (doc.small ? '' : '<th class="r">USt</th>') + '<th class="r">Betrag</th></tr></thead><tbody>' + rows + '</tbody></table>' +
    '<table class="sum">' + sumRows + '</table>' +
    (notes.length ? '<div class="notes">' + notes.map(function (n) { return '<p>' + n + '</p>'; }).join('') + '</div>' : '') +
    (doc.outro ? '<p class="txt" style="margin-top:14pt">' + nl_(doc.outro) + '</p>' : '') +
    '<p class="txt">Mit freundlichen Grüßen<br><b>' + h_(c.owner || c.name) + '</b><br>' + h_(c.name) + '</p>' +
    '<table class="foot"><tr>' + foot + '</tr></table>' +
    '</body></html>';
}

/* Saves PDF to Google Drive: "SOS Abdichtung - Belege / <Jahr>/" */
function docPdf_(doc) {
  var blob = HtmlService.createHtmlOutput(renderDoc_(doc)).getBlob().getAs('application/pdf')
    .setName((DOC_TYPES[doc.type] || 'Beleg') + ' ' + doc.nr + ' – ' + (doc.to.company || doc.to.name || 'Kunde') + '.pdf');
  var root, id = config_('docs_folder');
  try { if (id) root = DriveApp.getFolderById(String(id)); } catch (err) { root = null; }
  if (!root) {
    root = ensureDriveFolder_('SOS Abdichtung - Belege') || DriveApp.createFolder('SOS Abdichtung - Belege');
    if (root && root.getId) setConfig_('docs_folder', root.getId());
  }
  var year = String(doc.date).slice(0, 4), it = root.getFoldersByName(year), folder = (it && it.hasNext && it.hasNext()) ? it.next() : root.createFolder(year);
  return folder.createFile(blob);
}

/* ------------------------------------------------------------------ Admin API */

function api_docs_() {
  guard_();
  var list = allDocs_().map(function (row) {
    var hit = findDoc_(row.nr);
    return hit ? uiFormatDoc_(hit.doc) : row;
  });
  return {docs: list, types: DOC_TYPES, statuses: DOC_STATUSES_BY_TYPE, defaults: company_(), company: company_(), today: today_()};
}

function api_docNew_(type, leadId) {
  var email = guard_();
  if (!DOC_TYPES[type] || type === 'storno') throw new Error('Unbekannte Belegart.');
  var doc = newDoc_(type, leadId);
  doc.by = email; doc.log = [{at: iso_(new Date()), by: email, what: 'Entwurf angelegt'}];
  doc.due = type === 'offer' ? '' : addDays_(doc.date, doc.payDays);
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try { writeDoc_(doc); } finally { lock.releaseLock(); }
  return doc.nr;
}

function api_doc_(nr) {
  guard_();
  var hit = findDoc_(nr);
  if (!hit) throw new Error('Beleg ' + nr + ' nicht gefunden.');
  var doc = hit.doc;
  doc.totals = docTotals_(doc);
  return {doc: uiFormatDoc_(doc), rawDoc: doc, company: company_(), problems: doc.status === 'Entwurf' ? docProblems_(doc) : [], payMethods: PAY_METHODS, types: DOC_TYPES, statuses: DOC_STATUSES_BY_TYPE, texts: DOC_TEXT};
}

function api_docSave_(d) {
  var email = guard_();
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  var doc;
  try {
    var hit = findDoc_(d.nr);
    if (!hit) throw new Error('Beleg ' + d.nr + ' nicht gefunden.');
    if (hit.doc.status !== 'Entwurf') throw new Error('Ausgestellte Belege können nicht geändert werden. Für Korrekturen: Stornorechnung.');
    doc = cleanDoc_(d, hit.doc);
    doc.nr = hit.doc.nr; doc.status = 'Entwurf';
    doc.log = (hit.doc.log || []).concat([{at: iso_(new Date()), by: email, what: 'Entwurf gespeichert'}]).slice(-50);
    writeDoc_(doc, hit.row);
  } finally { lock.releaseLock(); }
  return api_doc_(doc.nr);
}

function api_docPreview_(d) {
  guard_();
  var hit = findDoc_(d.nr), doc = hit && hit.doc.status !== 'Entwurf' ? hit.doc : cleanDoc_(d, hit ? hit.doc : null);
  if (hit && hit.doc.status === 'Entwurf') { doc.status = 'Entwurf'; doc.nr = hit.doc.nr; }
  return renderDoc_(doc);
}

function api_docIssue_(d) {
  var email = guard_();
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  var doc;
  try {
    var hit = findDoc_(d.nr);
    if (!hit) throw new Error('Beleg ' + d.nr + ' nicht gefunden.');
    if (hit.doc.status !== 'Entwurf') throw new Error('Beleg ist bereits ausgestellt.');
    doc = cleanDoc_(d, hit.doc);
    var probs = docProblems_(doc);
    if (probs.length) throw new Error('Bitte ergänzen: ' + probs.join(' '));
    doc.nr = nextDocNr_(doc.type, doc.date);
    doc.status = 'Offen';
    doc.issuedAt = iso_(new Date()); doc.by = email;
    doc.log = (hit.doc.log || []).concat([{at: doc.issuedAt, by: email, what: 'Ausgestellt als ' + doc.nr}]);
    var file = docPdf_(doc);
    doc.pdf = file.getUrl(); doc.pdfId = file.getId ? file.getId() : '';
    writeDoc_(doc, hit.row);
    sheet_(TAB.audit).appendRow([new Date(), email, DOC_TAB, doc.nr, '', (DOC_TYPES[doc.type]) + ' ausgestellt: ' + docTotals_(doc).gross + ' €']);
  } finally { lock.releaseLock(); }
  return api_doc_(doc.nr);
}

function api_docDelete_(nr) {
  var email = guard_();
  var hit = findDoc_(nr);
  if (!hit) throw new Error('Beleg ' + nr + ' nicht gefunden.');
  if (hit.doc.status !== 'Entwurf') throw new Error('Nur Entwürfe können gelöscht werden.');
  docSheet_().deleteRow(hit.row);
  sheet_(TAB.audit).appendRow([new Date(), email, DOC_TAB, nr, '', 'Entwurf gelöscht']);
  return true;
}

function api_docPdf_(nr) {
  guard_();
  var hit = findDoc_(nr);
  if (!hit) throw new Error('Beleg ' + nr + ' nicht gefunden.');
  var file = docPdf_(hit.doc);
  hit.doc.pdf = file.getUrl();
  writeDoc_(hit.doc, hit.row);
  return {pdfUrl: hit.doc.pdf, name: (DOC_TYPES[hit.doc.type] || 'Beleg') + ' ' + nr + '.pdf'};
}

function api_docSend_(nr, msg) {
  var email = guard_();
  var hit = findDoc_(nr);
  if (!hit) throw new Error('Beleg ' + nr + ' nicht gefunden.');
  var doc = hit.doc, c = company_();
  if (doc.status === 'Entwurf') throw new Error('Bitte den Beleg zuerst ausstellen.');
  var to = String(msg && msg.to || doc.to.email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) throw new Error('Gültige E-Mail-Adresse des Kunden fehlt.');
  var blob = doc.pdfId ? DriveApp.getFileById(doc.pdfId).getBlob() : HtmlService.createHtmlOutput(renderDoc_(doc)).getBlob().getAs('application/pdf');
  blob.setName((DOC_TYPES[doc.type] || 'Beleg') + ' ' + doc.nr + '.pdf');
  var opt = {to: to, subject: clip_(msg && msg.subject || (DOC_TYPES[doc.type] + ' ' + doc.nr + ' – ' + c.name), 200),
    body: String(msg && msg.body || '').slice(0, 5000), attachments: [blob], name: c.name, replyTo: c.email};
  if (c.bcc) opt.bcc = String(c.bcc);
  MailApp.sendEmail(opt);
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    hit = findDoc_(nr); doc = hit.doc;
    doc.sent = iso_(new Date());
    doc.log = (doc.log || []).concat([{at: doc.sent, by: email, what: 'Per E-Mail an ' + to + ' gesendet'}]);
    if (doc.type === 'offer' && doc.status === 'Offen') doc.status = 'Gesendet';
    writeDoc_(doc, hit.row);
    if (doc.lead && doc.type === 'offer') {
      var lh = findLead_(doc.lead);
      if (lh) {
        sheet_(TAB.leads).getRange(lh.row, leadCol_('Angebot gesendet')).setValue(new Date());
        if ([STATUS[0], STATUS[1]].indexOf(String(lh.values[leadCol_('Status') - 1])) >= 0) sheet_(TAB.leads).getRange(lh.row, leadCol_('Status')).setValue(STATUS[2]);
      }
    }
  } finally { lock.releaseLock(); }
  return api_doc_(nr);
}

function api_docOffer_(nr, accepted) {
  var email = guard_();
  var hit = findDoc_(nr);
  if (!hit || hit.doc.type !== 'offer') throw new Error('Angebot ' + nr + ' nicht gefunden.');
  if (hit.doc.status === 'Entwurf') throw new Error('Bitte das Angebot zuerst ausstellen.');
  var doc = hit.doc;
  doc.status = accepted ? 'Angenommen' : 'Abgelehnt';
  doc.log = (doc.log || []).concat([{at: iso_(new Date()), by: email, what: doc.status}]);
  writeDoc_(doc, hit.row);
  if (doc.lead) {
    var lh = findLead_(doc.lead);
    if (lh) sheet_(TAB.leads).getRange(lh.row, leadCol_('Status')).setValue(accepted ? 'Gebucht' : 'Verloren');
  }
  return api_doc_(nr);
}

function api_docPay_(nr, p) {
  var email = guard_();
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var hit = findDoc_(nr);
    if (!hit || hit.doc.type === 'offer') throw new Error('Rechnung ' + nr + ' nicht gefunden.');
    var doc = hit.doc;
    if (['Entwurf', 'Storniert'].indexOf(doc.status) >= 0 || doc.type === 'storno') throw new Error('Für diesen Beleg kann keine Zahlung erfasst werden.');
    var amount = cents_(p && p.amount), date = /^\d{4}-\d{2}-\d{2}$/.test(p && p.date) ? p.date : today_();
    if (!(amount > 0)) throw new Error('Betrag eingeben.');
    doc.payments = (doc.payments || []).concat([{date: date, amount: amount, method: PAY_METHODS.indexOf(p.method) >= 0 ? p.method : PAY_METHODS[0], by: email}]);
    var paid = doc.payments.reduce(function (a, x) { return a + x.amount; }, 0), toPay = docTotals_(doc).toPay;
    doc.status = paid >= toPay - 0.005 ? 'Bezahlt' : 'Teilbezahlt';
    doc.log = (doc.log || []).concat([{at: iso_(new Date()), by: email, what: 'Zahlung ' + eurDe_(amount) + ' am ' + dayDe_(date)}]);
    writeDoc_(doc, hit.row);
    if (doc.status === 'Bezahlt' && doc.lead) {
      var lh = findLead_(doc.lead);
      if (lh && String(lh.values[leadCol_('Status') - 1]) === 'Gebucht' && doc.type !== 'deposit') sheet_(TAB.leads).getRange(lh.row, leadCol_('Status')).setValue('Erledigt');
    }
  } finally { lock.releaseLock(); }
  return api_doc_(nr);
}

function api_docCancel_(nr, reason) {
  var email = guard_();
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  var st;
  try {
    var hit = findDoc_(nr);
    if (!hit || hit.doc.type === 'offer' || hit.doc.type === 'storno') throw new Error('Rechnung ' + nr + ' nicht gefunden.');
    if (hit.doc.status === 'Entwurf') throw new Error('Entwürfe werden gelöscht, nicht storniert.');
    if (hit.doc.status === 'Storniert') throw new Error('Rechnung ist bereits storniert.');
    var o = hit.doc;
    st = JSON.parse(JSON.stringify(o));
    st.type = 'storno'; st.ref = o.nr; st.date = today_(); st.payments = []; st.sent = ''; st.deposit = -(Number(o.deposit) || 0);
    st.subject = 'Stornorechnung zu Rechnung ' + o.nr + ' vom ' + dayDe_(o.date) + (reason ? ' – ' + clip_(reason, 120) : '');
    st.intro = DOC_TEXT.storno.intro; st.outro = DOC_TEXT.storno.outro;
    st.lines = o.lines.map(function (l) { var x = JSON.parse(JSON.stringify(l)); x.qty = -x.qty; return x; });
    st.discount = o.discount && o.discount.type === 'eur' ? {type: 'eur', value: o.discount.value} : o.discount;
    st.nr = nextDocNr_('storno', st.date); st.status = 'Ausgeglichen'; st.issuedAt = iso_(new Date()); st.by = email; st.due = '';
    st.log = [{at: st.issuedAt, by: email, what: 'Stornorechnung zu ' + o.nr + (reason ? ': ' + clip_(reason, 120) : '')}];
    var file = docPdf_(st); st.pdf = file.getUrl(); st.pdfId = file.getId ? file.getId() : '';
    writeDoc_(st);
    o.status = 'Storniert'; o.cancelledBy = st.nr;
    o.log = (o.log || []).concat([{at: st.issuedAt, by: email, what: 'Storniert durch ' + st.nr}]);
    writeDoc_(o, hit.row);
    sheet_(TAB.audit).appendRow([new Date(), email, DOC_TAB, o.nr, o.status, 'Storniert durch ' + st.nr]);
  } finally { lock.releaseLock(); }
  return st.nr;
}

function api_docCopy_(nr, type) {
  var email = guard_();
  var hit = findDoc_(nr);
  if (!hit) throw new Error('Beleg ' + nr + ' nicht gefunden.');
  if (!DOC_TYPES[type] || type === 'storno') throw new Error('Unbekannte Belegart.');
  var o = hit.doc, c = company_(), t = DOC_TEXT[type];
  var d = JSON.parse(JSON.stringify(o));
  d.nr = 'E-' + Utilities.getUuid().slice(0, 8); d.type = type; d.status = 'Entwurf'; d.date = today_(); d.payments = []; d.sent = ''; d.pdf = ''; d.pdfId = '';
  d.ref = o.nr; d.intro = o.intro && o.type === type ? o.intro : t.intro.replace('Sehr geehrte Damen und Herren,', o.to.name ? 'Guten Tag ' + o.to.name + ',' : 'Sehr geehrte Damen und Herren,');
  d.outro = t.outro; d.subject = String(o.subject || '').replace(/^Festpreis-Angebot|^Angebot/, DOC_TYPES[type]).replace(/^Rechnung|^Abschlagsrechnung/, DOC_TYPES[type]);
  d.validUntil = type === 'offer' ? addDays_(d.date, c.offer_days) : ''; d.payDays = c.pay_days; d.due = type === 'offer' ? '' : addDays_(d.date, c.pay_days);
  d.deposit = 0; d.cancelledBy = ''; d.issuedAt = '';
  if (type === 'final') {
    d.deposit = cents_(allDocs_().filter(function (x) { return x.type === 'deposit' && x.lead && x.lead === o.lead && x.status !== 'Storniert'; })
      .reduce(function (a, x) { return a + x.gross; }, 0));
  }
  d.by = email; d.log = [{at: iso_(new Date()), by: email, what: 'Entwurf aus ' + o.nr}];
  writeDoc_(d);
  return d.nr;
}

function api_company_() {
  guard_();
  var c = {};
  COMPANY_FIELDS.forEach(function (f) { var v = config_('firma_' + f[0]); c[f[0]] = v === '' || v == null ? f[2] : v; });
  return {fields: COMPANY_FIELDS.map(function (f) { return {key: f[0], label: f[1]}; }), values: c};
}

function api_companySave_(vals) {
  var email = guard_();
  COMPANY_FIELDS.forEach(function (f) {
    if (vals[f[0]] === undefined) return;
    var v = cell_(vals[f[0]], 200);
    if (String(config_('firma_' + f[0])) !== String(v)) {
      setConfig_('firma_' + f[0], v);
      sheet_(TAB.audit).appendRow([new Date(), email, TAB.config, 'firma_' + f[0], '', f[0] === 'iban' ? '(IBAN geändert)' : v]);
    }
  });
  return api_company_();
}

/* Adapter helpers for BelegeUi.html */
var DOC_STATUSES_BY_TYPE = {
  offer: ['Entwurf', 'Offen', 'Versendet', 'Angenommen', 'Abgelehnt', 'Abgelaufen'],
  invoice: ['Entwurf', 'Offen', 'Bezahlt', 'Teilbezahlt', 'Überfällig', 'Storniert'],
  deposit: ['Entwurf', 'Offen', 'Bezahlt', 'Überfällig', 'Storniert'],
  final: ['Entwurf', 'Offen', 'Bezahlt', 'Überfällig', 'Storniert'],
  credit: ['Ausgeglichen', 'Storniert'],
  storno: ['Ausgeglichen', 'Storniert']
};

function uiFormatDoc_(doc) {
  var t = docTotals_(doc);
  return {
    nr: doc.nr,
    type: doc.type,
    typeLabel: DOC_TYPES[doc.type] || 'Beleg',
    status: doc.status || 'Entwurf',
    leadId: doc.lead || '',
    ref: doc.ref || '',
    name: (doc.to && (doc.to.name || doc.to.company)) || '',
    address: doc.to ? [doc.to.street, doc.to.city].filter(Boolean).join(', ') : '',
    email: (doc.to && doc.to.email) || '',
    phone: (doc.to && doc.to.phone) || '',
    service: doc.subject || '',
    serviceDate: doc.serviceFrom || doc.date || today_(),
    from: (doc.to && doc.to.street) || '',
    to: (doc.to && doc.to.city) || '',
    date: doc.date || today_(),
    validUntil: doc.validUntil || addDays_(doc.date || today_(), 14),
    dueDate: doc.due || addDays_(doc.date || today_(), 14),
    paidAt: (doc.payments && doc.payments[0] && doc.payments[0].date) || '',
    payMethod: doc.payMethod || PAY_METHODS[0],
    discountPct: (doc.discount && doc.discount.value) || 0,
    vatRate: doc.small ? 0 : ((doc.lines && doc.lines[0] && doc.lines[0].vat) != null ? doc.lines[0].vat : 19),
    intro: doc.intro || '',
    note: doc.outro || '',
    net: t.net,
    vat: t.vat,
    gross: t.gross,
    laborGross: t.labour,
    pdfUrl: doc.pdf || '',
    sentAt: doc.sent || '',
    items: (doc.lines || []).map(function (l) {
      return [l.title || '', l.detail || '', l.unit || 'lfm', Number(l.qty) || 1, Number(l.price) || 0, !!l.labour];
    })
  };
}

function api_newDoc_(type, leadId, fromNr) {
  guard_();
  var mappedType = type === 'credit' ? 'storno' : (DOC_TYPES[type] ? type : 'offer');
  if (fromNr) {
    if (mappedType === 'storno') {
      var stNr = api_docCancel_(fromNr, 'Storno');
      return {doc: uiFormatDoc_(findDoc_(stNr).doc), types: DOC_TYPES, statuses: DOC_STATUSES_BY_TYPE};
    }
    var copyNr = api_docCopy_(fromNr, mappedType);
    return {doc: uiFormatDoc_(findDoc_(copyNr).doc), types: DOC_TYPES, statuses: DOC_STATUSES_BY_TYPE};
  }
  var nr = api_docNew_(mappedType, leadId || '');
  return {doc: uiFormatDoc_(findDoc_(nr).doc), types: DOC_TYPES, statuses: DOC_STATUSES_BY_TYPE};
}

function api_saveDoc_(u) {
  var email = guard_();
  var hit = u.nr ? findDoc_(u.nr) : null;
  if (!hit) {
    var newNr = api_docNew_(u.type || 'offer', u.leadId || '');
    hit = findDoc_(newNr);
  }
  var doc = hit.doc;
  var addrParts = splitAddr_(u.address || [u.from, u.to].filter(Boolean).join(', ') || 'Friedrich-Ebert-Str. 40, 42103 Wuppertal');
  var vatRate = u.vatRate != null ? Number(u.vatRate) : 19;
  var payload = {
    nr: doc.nr,
    type: u.type || doc.type,
    lead: u.leadId != null ? u.leadId : doc.lead,
    ref: u.ref != null ? u.ref : doc.ref,
    date: u.date || doc.date || today_(),
    subject: u.service || doc.subject || (DOC_TYPES[doc.type] || 'Beleg'),
    intro: u.intro != null ? u.intro : doc.intro,
    outro: u.note != null ? u.note : doc.outro,
    to: {
      kind: 'privat',
      name: u.name || (doc.to && doc.to.name) || 'Kunde',
      company: '',
      street: addrParts.street || u.from || 'Musterstr. 1',
      city: addrParts.city || u.to || '42103 Wuppertal',
      country: 'Deutschland',
      email: u.email != null ? u.email : (doc.to && doc.to.email) || '',
      phone: u.phone != null ? u.phone : (doc.to && doc.to.phone) || '',
      vatId: ''
    },
    serviceFrom: u.serviceDate || doc.serviceFrom || today_(),
    validUntil: u.validUntil || doc.validUntil || addDays_(today_(), 14),
    payDays: 14,
    payMethod: u.payMethod || doc.payMethod || PAY_METHODS[0],
    priceMode: 'gross',
    discount: {type: 'pct', value: Number(u.discountPct) || 0},
    lines: Array.isArray(u.items) ? u.items.map(function (it) {
      return {
        title: String(it[0] || 'Position'),
        detail: String(it[1] || ''),
        unit: String(it[2] || 'lfm'),
        qty: Number(it[3]) || 1,
        price: Number(it[4]) || 0,
        vat: vatRate,
        disc: 0,
        labour: it[5] !== false
      };
    }) : doc.lines
  };

  var cleaned = cleanDoc_(payload, doc);
  if (/^E-/.test(cleaned.nr)) {
    cleaned.nr = nextDocNr_(cleaned.type, cleaned.date);
    cleaned.status = u.status && u.status !== 'Entwurf' ? u.status : 'Offen';
    cleaned.issuedAt = iso_(new Date());
    cleaned.by = email;
    var f = docPdf_(cleaned);
    cleaned.pdf = f.getUrl();
    cleaned.pdfId = f.getId ? f.getId() : '';
  } else if (u.status) {
    cleaned.status = u.status;
  }
  writeDoc_(cleaned, hit.row);
  return uiFormatDoc_(cleaned);
}

function api_docHtml_(nr) {
  guard_();
  var hit = findDoc_(nr);
  if (!hit) throw new Error('Beleg ' + nr + ' nicht gefunden.');
  var d = uiFormatDoc_(hit.doc);
  return {nr: d.nr, typeLabel: d.typeLabel, customer: d.name, html: renderDoc_(hit.doc), pdfUrl: d.pdfUrl};
}

function api_sendDoc_(nr, to, customBody) {
  api_docSend_(nr, {to: to, body: customBody || ''});
  var hit = findDoc_(nr);
  return {ok: true, doc: uiFormatDoc_(hit.doc)};
}

