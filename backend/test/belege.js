/* Comprehensive GoBD Invoicing, Offers & § 35a Handwerkerleistungen test suite for SOS Abdichtung.
 * Tests German tax compliance (§ 14 UStG, § 35a EStG), sequential gapless numbering (ANG-2026-xxxx, RE-2026-xxxx),
 * payments, Storno cancellations, and Google Drive PDF archiving.
 * Usage: node backend/test/belege.js
 */
const assert = require('assert');
const M = require('./mock');
const {ctx, sheets, driveFolders} = M;

// Load apps-script and admin-script modules
M.load('apps-script', ['Estimator.js', 'Shared.js', 'Code.js', 'Website.js']);
M.load('admin-script', ['Config.js', 'Belege.js', 'Termine.js', 'Admin.js']);

// Initialize Google Sheet database structure
ctx.setup();

console.log('--- SOS ABDICHTUNG GOBD & § 35a INVOICING TEST SUITE ---');

// 1. Authenticate Admin session
const loginRes = ctx.login('shahzad', 'SOS2026!Wuppertal');
assert(loginRes.ok && loginRes.token, 'Admin session authenticated');
const token = loginRes.token;

// 2. Verify Belege Tab Schema
const belegeSheet = sheets['Belege'];
assert(belegeSheet, 'Belege tab exists in Google Sheets');
const header = belegeSheet.data[0];
const expectedCols = ['Nr', 'Art', 'Status', 'Anfrage', 'Datum', 'Kunde', 'Netto €', 'USt €', 'Brutto €', 'Fällig', 'Bezahlt am', 'Bezahlt €', 'PDF', 'Erstellt von', 'Geändert', 'Bezug', 'Daten (JSON)'];
expectedCols.forEach((col, idx) => {
  assert.strictEqual(header[idx], col, `Column ${idx + 1} must be ${col}, got ${header[idx]}`);
});
console.log('✓ [1/6] Belege Tab Schema verified: 17 columns match GoBD specification.');

// 2. Seed Lead A-1001 in Anfragen
const post = b => ctx.doPost({postData: {contents: JSON.stringify(b)}});
post({
  action: 'lead',
  consent: true,
  t: 5000,
  lang: 'de',
  contact: {name: 'Familie Berger', phone: '0172 2064177', email: 'berger@example.de', note: 'Feuchte Kellerwand'},
  state: {
    ref: 'LEAD-1',
    f1: {from: 'Friedrich-Ebert-Str. 40, 42103 Wuppertal', to: 'Kellerabdichtung', km: '15', dateMode: 'fixed', date: '2026-11-10', hh: 1, service: 'Kellerabdichtung'},
    acc: {old: {floor: 0, lift: 1, park: 0}, new: {floor: 0, lift: 1, park: 0}},
    hvz: true,
    rooms: [{r: 'basement', sqm: '24'}],
    inv: {'keller-mds': {vi: 0, by: {pick: 18}}},
    customs: [],
    src: {utm_source: 'google'}
  }
});

// 3. Create Offer (Angebot) with § 35a Handwerkerleistungen (Labor) breakdown
const newOfferObj = ctx.api(token, 'api_newDoc', ['offer', 'A-1001', '']);
assert(newOfferObj && newOfferObj.doc, 'New offer template created');
const offerDoc = newOfferObj.doc;
assert(offerDoc && offerDoc.nr, 'Offer draft created with ID: ' + offerDoc.nr);

// Add representative waterproofing positions:
// Pos 1: Kellerinnenabdichtung MDS (Labor + Material)
// Pos 2: Horizontalsperre Injektion (Labor + Material)
offerDoc.items = [
  ['Baustelleneinrichtung & Feuchtemessung', '', 'Psch', 1, 150, true],
  ['Kellerinnenabdichtung MDS 3-lagig', '', 'm²', 25, 110, true],
  ['Spezial-Dichtschlämme & Verkieselung Konzentrat', '', 'm²', 25, 45, false],
  ['Horizontalsperre Paraffininjektion', '', 'lfm', 12, 95, true]
];

const savedOffer = ctx.api(token, 'api_saveDoc', [offerDoc]);
assert(/^ANG-\d{4}-0001$/.test(savedOffer.nr), 'Offer saved with sequential number ANG-YYYY-0001, got: ' + savedOffer.nr);
assert(savedOffer.net > 0 && savedOffer.vat > 0 && savedOffer.gross > 0, 'Net, VAT (19%), and Gross calculated');
assert.strictEqual(savedOffer.vatRate, 19, 'Default 19% German VAT applied');

// Verify § 35a Handwerkerleistungen (Craftsman labor deduction portion)
assert(savedOffer.laborGross > 0, '§ 35a Labor gross calculated');
console.log('✓ [2/6] Offer Generation & § 35a Handwerkerleistungen:', savedOffer.nr, '| Netto:', savedOffer.net, '€ | MwSt 19%:', savedOffer.vat, '€ | Brutto:', savedOffer.gross, '€ | § 35a Lohnanteil:', savedOffer.laborGross, '€');

// 4. Create Invoice (Rechnung) from Offer
const newInvObj = ctx.api(token, 'api_newDoc', ['invoice', 'A-1001', savedOffer.nr]);
assert(newInvObj && newInvObj.doc, 'Invoice template created referencing offer');
const invDoc = newInvObj.doc;
assert.strictEqual(invDoc.ref, savedOffer.nr, 'Invoice references source offer ' + savedOffer.nr);

const savedInv = ctx.api(token, 'api_saveDoc', [invDoc]);
assert(/^RE-\d{4}-0001$/.test(savedInv.nr), 'Invoice number format RE-YYYY-0001, got: ' + savedInv.nr);
assert(savedInv.dueDate, 'Payment due date computed based on payment terms');
console.log('✓ [3/6] GoBD Invoice Sequential Numbering:', savedInv.nr, 'referencing', savedInv.ref, '| Fällig am:', savedInv.dueDate);

// 5. Payments Tracking (Abschlags- / Teilzahlung und Restzahlung)
// Partial payment: 2000 €
const pay1Res = ctx.api(token, 'api_docPay', [savedInv.nr, {amount: 2000, date: '2026-11-15', method: 'Überweisung', ref: 'Abschlag 1'}]);
assert(pay1Res && pay1Res.doc, 'Payment registered');
assert.strictEqual(pay1Res.doc.status, 'Teilbezahlt', 'Status updated to Teilbezahlt');

// Remainder payment:
const remaining = savedInv.gross - 2000;
const pay2Res = ctx.api(token, 'api_docPay', [savedInv.nr, {amount: remaining, date: '2026-11-20', method: 'Überweisung', ref: 'Schlusszahlung'}]);
assert.strictEqual(pay2Res.doc.status, 'Bezahlt', 'Status updated to Bezahlt after full amount settled');
console.log('✓ [4/6] Payment Tracking & Status Lifecycle: Teilzahlung (2000 €) -> Bezahlt (' + savedInv.gross + ' €)');

// 6. Stornorechnung (Cancellation / Credit Note)
// Issue second invoice to test GoBD cancellation
const inv2DraftNr = ctx.api(token, 'api_docNew', ['invoice', 'A-1001']);
const inv2Raw = ctx.api(token, 'api_doc', [inv2DraftNr]).rawDoc;
const issuedInv2 = ctx.api(token, 'api_docIssue', [inv2Raw]).doc;
assert(/^RE-\d{4}-\d{4}$/.test(issuedInv2.nr), 'Issued invoice has sequential number: ' + issuedInv2.nr);

const stornoNr = ctx.api(token, 'api_docCancel', [issuedInv2.nr, 'Bauherr hat Ausführungstermin vor Beginn verschoben']);
assert(typeof stornoNr === 'string' && stornoNr.length > 0, 'Stornorechnung generated: ' + stornoNr);
console.log('✓ [5/6] GoBD Cancellation & Storno: Invoice', issuedInv2.nr, 'cancelled -> Storno', stornoNr);

// 7. GoBD PDF Archiving in Google Drive
const pdfRes = ctx.api(token, 'api_docPdf', [savedInv.nr]);
assert(pdfRes && pdfRes.pdfUrl, 'PDF generated and URL returned');
assert(driveFolders['SOS Abdichtung - Belege'], 'Google Drive root folder SOS Abdichtung - Belege created');
const currentYear = String(new Date().getFullYear());
assert(driveFolders['SOS Abdichtung - Belege'].subs[currentYear], 'Year folder ' + currentYear + ' created inside SOS Abdichtung - Belege');
console.log('✓ [6/6] Google Drive GoBD PDF Archiving: Stored in SOS Abdichtung - Belege /', currentYear, '->', pdfRes.pdfUrl);

console.log('\nALL GOBD INVOICING & § 35a TESTS PASSED SUCCESSFULLY!\n');
