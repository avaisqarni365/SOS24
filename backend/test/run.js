/* Comprehensive test suite for SOS Abdichtung backend/apps-script & backend/admin-script. Usage: node backend/test/run.js */
const assert = require('assert');
const M = require('./mock');
const {ctx, sheets, alerts, mails, puts, calEvents, driveFolders} = M;

// Load both Website API and Admin modules
M.load('apps-script', ['Estimator.js', 'Shared.js', 'Code.js', 'Website.js']);
M.load('admin-script', ['Config.js', 'Belege.js', 'Termine.js', 'Admin.js']);

// 1. Setup initializes all relational database tabs (Anfragen, Positionen, Angebote, Katalog, Regeln, Preise, Protokoll, Entwürfe, Konfiguration, Strecken, Termine, Besuche, Benutzer, Belege)
ctx.setup();
ctx.docSheet_();
const expectedTabs = ['Anfragen', 'Positionen', 'Angebote', 'Katalog', 'Regeln', 'Preise', 'Protokoll', 'Entwürfe', 'Konfiguration'];
expectedTabs.forEach(t => assert(sheets[t], 'Missing sheet tab: ' + t));
const fromSheet = JSON.parse(JSON.stringify(ctx.masterFromSheet_()));
assert(fromSheet.items.length === 11, 'Catalog items seeded');
assert.strictEqual(ctx.config_('notify_email'), 'simplypizza2020@gmail.com');
assert.strictEqual(ctx.company_().owner, 'Shahzad Mahmood');
console.log('✓ [1/7] Setup & Relational Sheets initialized:', Object.keys(sheets).join(', '));

// 2. Website Lead Intake (action: 'lead' & action: 'quick') -> ID A-1001
const post = b => ctx.doPost({postData: {contents: JSON.stringify(b)}});
const state = {
  ref: 'SOS-TEST1',
  f1: {from: 'Friedrich-Ebert-Str. 40, 42103 Wuppertal', to: 'Kellerwand Nord', km: '15', dateMode: 'fixed', date: '2026-11-10', hh: 1, service: 'Kellerabdichtung'},
  acc: {old: {floor: 0, lift: 1, park: 0}, 'new': {floor: 0, lift: 1, park: 0}},
  hvz: true,
  rooms: [{r: 'basement', sqm: '24'}],
  inv: {'keller-mds': {vi: 0, by: {pick: 18}}, 'hs-injektion': {vi: 0, by: {pick: 10}}},
  customs: [],
  src: {utm_source: 'google', utm_medium: 'organic'}
};
const r1 = post({
  action: 'lead',
  state,
  consent: true,
  t: 9000,
  lang: 'de',
  contact: {name: 'Familie Berger', phone: '0172 2064177', email: 'berger@example.de', channel: 'whatsapp', note: 'Ausblühungen an der Außenwand im Keller'}
});
assert(r1.ok && r1.id === 'A-1001', 'Expected first inquiry ID A-1001, got: ' + JSON.stringify(r1));
assert(/^[0-9a-f]{32}$/.test(r1.up), 'Valid HMAC customer token returned');
console.log('✓ [2/7] Lead intake (action: lead):', r1.id, '| Total estimate:', r1.total, '€');

// 3. Base64 Damage Photo Upload (action: 'photos') -> Saves to Google Drive folder "SOS Abdichtung - Schadensfotos / A-1001"
mails.length = 0;
const sampleJpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4, 0xff, 0xd9]).toString('base64');
const phRes = post({
  action: 'photos',
  id: r1.id,
  k: r1.up,
  note: 'Feuchter Sockelbereich links neben Kellerfenster',
  images: [
    {type: 'image/jpeg', data: sampleJpg},
    {type: 'image/png', data: sampleJpg}
  ]
});
assert(phRes.ok && phRes.n === 2 && phRes.driveUrl, 'Photo upload response: ' + JSON.stringify(phRes));
assert(driveFolders['SOS Abdichtung - Schadensfotos'], 'Root damage photos folder created in Drive');
assert(driveFolders['SOS Abdichtung - Schadensfotos'].subs['A-1001'], 'Lead subfolder A-1001 created in Drive');
assert.strictEqual(driveFolders['SOS Abdichtung - Schadensfotos'].subs['A-1001'].files.length, 2, '2 damage photos saved in Drive');
assert.strictEqual(mails.length, 1, 'Alert email sent with photo attachments & Drive link');
assert(/Schadensfotos zu Anfrage A-1001/.test(mails[0].subject), 'Email subject: ' + mails[0].subject);
console.log('✓ [3/7] Damage photo upload (action: photos): 2 files saved in Drive ->', phRes.driveUrl);

// 4. On-site Moisture Inspection Booking (action: 'booking') -> Google Calendar sync
const availDays = ctx.freeSlots_('visit').filter(d => d.slots && d.slots.length > 0);
const nextDay = availDays[0];
const bookRes = post({
  action: 'booking',
  consent: true,
  t: 9000,
  booking: {
    type: 'visit',
    date: nextDay.date,
    time: nextDay.slots[0],
    name: 'Familie Berger',
    phone: '0172 2064177',
    email: 'berger@example.de',
    address: 'Friedrich-Ebert-Str. 40, 42103 Wuppertal',
    leadId: r1.id,
    note: 'Bitte Feuchtigkeitsmessgerät mitbringen'
  }
});
assert(bookRes.ok && bookRes.nr === 'T-1001', 'Booking response: ' + JSON.stringify(bookRes));
assert(calEvents.length >= 1, 'Google Calendar event created');
console.log('✓ [4/7] On-site inspection booking (action: booking):', bookRes.nr, '| Calendar event:', calEvents[0].title);

// 5. Digital Contract E-Signature (action: 'sign') -> Saves signature PNG in "SOS Abdichtung - Verträge"
const sigRes = post({
  action: 'sign',
  id: r1.id,
  k: r1.up,
  signer: 'Thomas Berger',
  signature: 'data:image/png;base64,' + sampleJpg
});
assert(sigRes.ok && sigRes.signedAt, 'Signature response: ' + JSON.stringify(sigRes));
assert(driveFolders['SOS Abdichtung - Verträge'], 'Contracts folder created in Drive');
assert.strictEqual(driveFolders['SOS Abdichtung - Verträge'].files.length, 1, 'Signature PNG stored in Drive');
const loginRes = ctx.login('shahzad', 'SOS2026!Wuppertal');
assert(loginRes.ok && loginRes.token, 'Admin login failed: ' + JSON.stringify(loginRes));
const admToken = loginRes.token;
const leadDetail = ctx.api(admToken, 'api_lead', [r1.id]);
assert(leadDetail.lead.contract && leadDetail.lead.contract.signed === true, 'Lead marked as digitally signed');
assert(leadDetail.lead.contract.sigDriveUrl, 'Signature Drive URL linked on lead');
assert(leadDetail.lead.photosDrive, 'Damage photos Drive URL linked on lead');
console.log('✓ [5/7] Digital signature (action: sign): Signed by', leadDetail.lead.contract.signer, '->', leadDetail.lead.contract.sigDriveUrl);

// 6. GoBD Invoicing & Quote Engine (ANG-2026-0001, RE-2026-0001, § 35a EStG craft labor, PDF in Drive)
const newOffer = ctx.api(admToken, 'api_newDoc', ['offer', r1.id, '']).doc;
const savedOffer = ctx.api(admToken, 'api_saveDoc', [newOffer]);
assert(/^ANG-\d{4}-0001$/.test(savedOffer.nr), 'Offer number format ANG-YYYY-0001, got: ' + savedOffer.nr);
assert(savedOffer.laborGross > 0, '§ 35a EStG labor portion calculated');

const newInv = ctx.api(admToken, 'api_newDoc', ['invoice', '', savedOffer.nr]).doc;
const savedInv = ctx.api(admToken, 'api_saveDoc', [newInv]);
assert(/^RE-\d{4}-0001$/.test(savedInv.nr), 'Invoice number format RE-YYYY-0001, got: ' + savedInv.nr);

const pdfRes = ctx.api(admToken, 'api_docPdf', [savedInv.nr]);
assert(pdfRes.pdfUrl && driveFolders['SOS Abdichtung - Belege'], 'GoBD PDF archived in Drive folder SOS Abdichtung - Belege');
console.log('✓ [6/7] GoBD Invoicing Engine:', savedOffer.nr, '&', savedInv.nr, '| Gross:', savedInv.gross, '€ | § 35a Labor:', savedInv.laborGross, '€');

// 7. 1-Click GitHub Pages Publishing Bridge & Chatbot
puts.length = 0;
const pubRes = ctx.publishCatalogCore_();
assert(pubRes.ok && puts.length === 1, 'Published master.json to GitHub API');
assert(puts[0].url.includes('avaisqarni365/SOS24/contents/public/data/master.json'), 'GitHub target URL: ' + puts[0].url);

const chatRes = post({
  action: 'chat',
  lang: 'de',
  messages: [{role: 'user', text: 'Was kostet eine Horizontalsperre bei 12 Metern Wandlänge?'}]
});
assert(chatRes.ok && chatRes.reply.length > 20, 'Chatbot reply generated');
console.log('✓ [7/7] 1-Click GitHub Publishing & AI Chatbot verified:', puts[0].url);
console.log('\nALL BACKEND & ADMIN TESTS PASSED SUCCESSFULLY!');
